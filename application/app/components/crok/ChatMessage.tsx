import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@web-speed-hackathon-2026/client/app/components/crok/CodeBlock";
import { TypingIndicator } from "@web-speed-hackathon-2026/client/app/components/crok/TypingIndicator";
import { CrokLogo } from "@web-speed-hackathon-2026/client/app/components/foundation/CrokLogo";

interface Props {
  message: Models.ChatMessage;
}

const loadMathPlugins = () =>
  import("@web-speed-hackathon-2026/client/app/components/crok/load_math_plugins");

const hasMathSyntax = (content: string) => {
  return (
    /(^|[^\\])\$\$[\s\S]+?\$\$/m.test(content) ||
    /(^|[^\\])\$[^$\n]+\$/m.test(content) ||
    /\\\([\s\S]+?\\\)/.test(content) ||
    /\\\[[\s\S]+?\\\]/.test(content) ||
    /\\begin\{[a-zA-Z*]+\}/.test(content)
  );
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="mb-6 flex justify-end">
      <div className="bg-cax-surface-subtle text-cax-text max-w-[80%] rounded-3xl px-4 py-2">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

const AssistantMessage = ({ content }: { content: string }) => {
  const [mathPlugins, setMathPlugins] = useState<Awaited<ReturnType<typeof loadMathPlugins>> | null>(null);
  const shouldLoadMath = hasMathSyntax(content);

  useEffect(() => {
    if (!shouldLoadMath) {
      return;
    }

    let isMounted = true;
    void loadMathPlugins().then((plugins) => {
      if (isMounted) {
        setMathPlugins(plugins);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [shouldLoadMath]);

  return (
    <div className="mb-6 flex gap-4">
      <div className="h-8 w-8 shrink-0">
        <CrokLogo className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-cax-text mb-1 text-sm font-medium">Crok</div>
        <div className="markdown text-cax-text max-w-none">
          {content ? (
            <Markdown
              components={{ pre: CodeBlock }}
              rehypePlugins={shouldLoadMath && mathPlugins ? [mathPlugins.rehypeKatex] : []}
              remarkPlugins={shouldLoadMath && mathPlugins ? [mathPlugins.remarkMath, remarkGfm] : [remarkGfm]}
            >
              {content}
            </Markdown>
          ) : (
            <TypingIndicator />
          )}
        </div>
      </div>
    </div>
  );
};

export const ChatMessage = ({ message }: Props) => {
  if (message.role === "user") {
    return <UserMessage content={message.content} />;
  }
  return <AssistantMessage content={message.content} />;
};
