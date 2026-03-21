import { useLoaderData } from "react-router";
import type { Route } from "./+types/users.$username";

import { UserProfileContainer } from "@web-speed-hackathon-2026/client/src/containers/UserProfileContainer";

export async function loader({ request, params }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const user = await fetch(`${origin}/api/v1/users/${params.username}`).then(
    (r) => r.json() as Promise<Models.User>,
  );
  return { user };
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  if (!data?.user) return [{ title: "CaX" }];
  return [{ title: `${data.user.name} さんのタイムライン - CaX` }];
}

export default function UserProfileRoute() {
  const { user } = useLoaderData<typeof loader>();
  return <UserProfileContainer initialUser={user} />;
}
