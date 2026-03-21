import { useLoaderData } from "react-router";
import type { Route } from "./+types/posts.$postId";

import { PostContainer } from "@web-speed-hackathon-2026/client/app/containers/PostContainer";

export async function loader({ request, params }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}/api/v1/posts/${params.postId}`);
  if (!res.ok) {
    throw new Response(null, { status: res.status });
  }
  const post = (await res.json()) as Models.Post;
  return { post };
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  if (!data?.post) return [{ title: "CaX" }];
  return [{ title: `${data.post.user.name} さんのつぶやき - CaX` }];
}

export default function PostRoute() {
  const { post } = useLoaderData<typeof loader>();
  return <PostContainer initialPost={post} />;
}
