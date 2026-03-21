import type { Route } from "./+types/$";

import { NotFoundContainer } from "@web-speed-hackathon-2026/client/app/containers/NotFoundContainer";

export function meta(): Route.MetaDescriptors {
  return [{ title: "ページが見つかりません - CaX" }];
}

export default function NotFoundRoute() {
  return <NotFoundContainer />;
}
