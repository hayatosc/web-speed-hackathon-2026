import type { Route } from "./+types/search";

import { SearchContainer } from "@web-speed-hackathon-2026/client/app/containers/SearchContainer";

export function meta(): Route.MetaDescriptors {
  return [{ title: "検索 - CaX" }];
}

export default function SearchRoute() {
  return <SearchContainer />;
}
