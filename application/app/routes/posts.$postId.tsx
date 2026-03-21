import { useLoaderData } from "react-router";
import type { Route } from "./+types/posts.$postId";

import { PostContainer } from "@web-speed-hackathon-2026/client/src/containers/PostContainer";

export async function loader({ request, params }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const post = await fetch(`${origin}/api/v1/posts/${params.postId}`).then(
    (r) => r.json() as Promise<Models.Post>,
  );
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
