import { useLoaderData } from "react-router";
import type { Route } from "./+types/_index";

import { TimelineContainer } from "@web-speed-hackathon-2026/client/src/containers/TimelineContainer";

export async function loader({ request }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const posts = await fetch(`${origin}/api/v1/posts?limit=30&offset=0`).then(
    (r) => r.json() as Promise<Models.Post[]>,
  );
  return { posts };
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "タイムライン - CaX" }];
}

export default function IndexRoute() {
  const { posts } = useLoaderData<typeof loader>();
  return <TimelineContainer initialPosts={posts} />;
}
