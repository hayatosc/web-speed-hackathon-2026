import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { NewDirectMessageModalPage } from "@web-speed-hackathon-2026/client/src/components/direct_message/NewDirectMessageModalPage";
import { Modal } from "@web-speed-hackathon-2026/client/src/components/modal/Modal";
import { NewDirectMessageFormData } from "@web-speed-hackathon-2026/client/src/direct_message/types";
import { fetchJSON, sendJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

interface Props {
  activeUser: Models.User;
  existingConversations: Array<Models.DirectMessageConversationSummary>;
  id: string;
}

export const NewDirectMessageModalContainer = ({ activeUser, existingConversations, id }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const handleToggle = () => {
      setResetKey((key) => key + 1);
    };
    element.addEventListener("toggle", handleToggle);
    return () => {
      element.removeEventListener("toggle", handleToggle);
    };
  }, [ref]);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: NewDirectMessageFormData) => {
      try {
        const normalizedUsername = values.username.trim().replace(/^@/, "");
        const existingConversation = existingConversations.find((conversation) => {
          const peer =
            conversation.initiator.id !== activeUser.id
              ? conversation.initiator
              : conversation.member;
          return peer.username === normalizedUsername;
        });

        if (existingConversation !== undefined) {
          navigate(`/dm/${existingConversation.id}`);
          return;
        }

        const user = await fetchJSON<Models.User>(`/api/v1/users/${normalizedUsername}`);
        const conversation = await sendJSON<Pick<Models.DirectMessageConversation, "id">>(
          `/api/v1/dm?includeMessages=0`,
          {
            peerId: user.id,
          },
        );
        navigate(`/dm/${conversation.id}`);
      } catch {
        throw new Error("ユーザーが見つかりませんでした");
      }
    },
    [activeUser.id, existingConversations, navigate],
  );

  return (
    <Modal id={id} ref={ref} closedby="any">
      <NewDirectMessageModalPage key={resetKey} id={id} onSubmit={handleSubmit} />
    </Modal>
  );
};
