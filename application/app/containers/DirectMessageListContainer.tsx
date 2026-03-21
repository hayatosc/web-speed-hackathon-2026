import { useCallback, useEffect, useId, useState } from "react";

import { DirectMessageGate } from "@web-speed-hackathon-2026/client/app/components/direct_message/DirectMessageGate";
import { DirectMessageListPage } from "@web-speed-hackathon-2026/client/app/components/direct_message/DirectMessageListPage";
import { NewDirectMessageModalContainer } from "@web-speed-hackathon-2026/client/app/containers/NewDirectMessageModalContainer";
import { useWs } from "@web-speed-hackathon-2026/client/app/hooks/use_ws";
import { fetchJSON } from "@web-speed-hackathon-2026/client/app/utils/fetchers";

interface Props {
  activeUser: Models.User | null;
  authModalId: string;
}

export const DirectMessageListContainer = ({ activeUser, authModalId }: Props) => {
  const newDmModalId = useId();
  const [conversations, setConversations] =
    useState<Array<Models.DirectMessageConversationSummary> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const loadConversations = useCallback(async () => {
    if (activeUser === null) {
      return;
    }

    try {
      const nextConversations = await fetchJSON<Array<Models.DirectMessageConversationSummary>>(
        "/api/v1/dm",
      );
      setConversations(nextConversations);
      setError(null);
    } catch (nextError) {
      setConversations(null);
      setError(nextError as Error);
    }
  }, [activeUser]);

  useEffect(() => {
    if (activeUser === null) {
      setConversations(null);
      setError(null);
      return;
    }

    void loadConversations();
  }, [activeUser, loadConversations]);

  useWs<{ type: string; payload: { unreadCount: number; conversationId?: string } }>(
    "/api/v1/dm/unread",
    ({ payload }) => {
      if (activeUser === null) return;

      if (payload.conversationId != null) {
        setConversations((prev) => {
          if (prev === null) {
            void loadConversations();
            return prev;
          }
          return prev.map((conv) =>
            conv.id === payload.conversationId ? { ...conv, hasUnread: true } : conv
          );
        });
      } else {
        void loadConversations();
      }
    },
  );

  if (activeUser === null) {
    return (
      <DirectMessageGate
        headline="DMを利用するにはサインインが必要です"
        authModalId={authModalId}
      />
    );
  }

  return (
    <>
      <title>ダイレクトメッセージ - CaX</title>
      <DirectMessageListPage
        activeUser={activeUser}
        conversations={conversations}
        error={error}
        newDmModalId={newDmModalId}
      />
      <NewDirectMessageModalContainer
        activeUser={activeUser}
        existingConversations={conversations ?? []}
        id={newDmModalId}
      />
    </>
  );
};
