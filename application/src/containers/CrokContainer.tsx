import { useCallback, useMemo, useState } from "react";

import { CrokGate } from "@web-speed-hackathon-2026/client/src/components/crok/CrokGate";
import { CrokPage } from "@web-speed-hackathon-2026/client/src/components/crok/CrokPage";
import { useSSE } from "@web-speed-hackathon-2026/client/src/hooks/use_sse";

type Props = {
  activeUser: Models.User | null;
  authModalId: string;
};

type ChatMessageWithId = Models.ChatMessage & { id: string };

export const CrokContainer = ({ activeUser, authModalId }: Props) => {
  const [messages, setMessages] = useState<ChatMessageWithId[]>([]);

  const sseOptions = useMemo(
    () => ({
      onMessage: (data: Models.SSEChunk, prevContent: string) => {
        return prevContent + (data.text ?? "");
      },
      onDone: (data: Models.SSEChunk) => data.done === true,
      onComplete: (finalContent: string) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [...prev.slice(0, -1), { ...lastMessage, content: finalContent }];
          }
          return prev;
        });
      },
    }),
    [],
  );

  const { content, isStreaming, start } = useSSE<Models.SSEChunk>(sseOptions);

  const currentAssistantContent = isStreaming || content ? content : null;

  const displayMessages = useMemo(() => {
    if (currentAssistantContent !== null) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        return [
          ...messages.slice(0, -1),
          { ...lastMessage, content: currentAssistantContent },
        ];
      }
    }
    return messages;
  }, [messages, currentAssistantContent]);

  const sendMessage = useCallback(
    (userInput: string) => {
      if (!userInput.trim() || isStreaming) return;

      const userMessage: ChatMessageWithId = {
        id: crypto.randomUUID(),
        role: "user",
        content: userInput,
      };
      const assistantMessage: ChatMessageWithId = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      const encodedPrompt = encodeURIComponent(userInput);
      start(`/api/v1/crok?prompt=${encodedPrompt}`);
    },
    [isStreaming, start],
  );

  if (!activeUser) {
    return (
      <CrokGate headline="Crokを利用するにはサインインしてください" authModalId={authModalId} />
    );
  }

  return (
    <>
      <title>Crok - CaX</title>
      <CrokPage isStreaming={isStreaming} messages={displayMessages} onSendMessage={sendMessage} />
    </>
  );
};
