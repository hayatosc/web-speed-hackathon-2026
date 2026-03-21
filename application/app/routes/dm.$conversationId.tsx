import type { Route } from "./+types/dm.$conversationId";

import { DirectMessageContainer } from "@web-speed-hackathon-2026/client/app/containers/DirectMessageContainer";
import { useLayoutOutletContext } from "./_layout";

export function meta(): Route.MetaDescriptors {
  return [{ title: "ダイレクトメッセージ - CaX" }];
}

export default function DmConversationRoute() {
  const { activeUser, authModalId } = useLayoutOutletContext();
  return <DirectMessageContainer activeUser={activeUser} authModalId={authModalId} />;
}
