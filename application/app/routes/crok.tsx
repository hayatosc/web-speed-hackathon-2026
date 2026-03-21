import type { Route } from "./+types/crok";

import { CrokContainer } from "@web-speed-hackathon-2026/client/src/containers/CrokContainer";
import { useLayoutOutletContext } from "./_layout";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Crok - CaX" }];
}

export default function CrokRoute() {
  const { activeUser, authModalId } = useLayoutOutletContext();
  return <CrokContainer activeUser={activeUser} authModalId={authModalId} />;
}
