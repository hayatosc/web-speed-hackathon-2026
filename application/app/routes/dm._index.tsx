import type { Route } from "./+types/dm._index";

import { DirectMessageListContainer } from "@web-speed-hackathon-2026/client/src/containers/DirectMessageListContainer";
import { useLayoutOutletContext } from "./_layout";

export function meta(): Route.MetaDescriptors {
  return [{ title: "ダイレクトメッセージ - CaX" }];
}

export default function DmIndexRoute() {
  const { activeUser, authModalId } = useLayoutOutletContext();
  return <DirectMessageListContainer activeUser={activeUser} authModalId={authModalId} />;
}
