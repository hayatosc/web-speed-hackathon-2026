import type { Route } from "./+types/terms";

import { TermContainer } from "@web-speed-hackathon-2026/client/app/containers/TermContainer";

export function meta(): Route.MetaDescriptors {
  return [{ title: "利用規約 - CaX" }];
}

export default function TermsRoute() {
  return <TermContainer />;
}
