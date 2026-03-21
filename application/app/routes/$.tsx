import type { Route } from "./+types/$";

import { NotFoundContainer } from "@web-speed-hackathon-2026/client/src/containers/NotFoundContainer";

export function meta(): Route.MetaDescriptors {
  return [{ title: "ページが見つかりません - CaX" }];
}

export default function NotFoundRoute() {
  return <NotFoundContainer />;
}
