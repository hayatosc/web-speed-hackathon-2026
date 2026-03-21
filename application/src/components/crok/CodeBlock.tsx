import { ComponentProps, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import type SyntaxHighlighterComponent from "react-syntax-highlighter/dist/esm/light";

type HighlightStyle = NonNullable<SyntaxHighlighterProps["style"]>;

interface LoadedHighlighter {
  SyntaxHighlighter: typeof SyntaxHighlighterComponent;
  style: HighlightStyle;
}

const CUSTOM_STYLE = {
  fontSize: "14px",
  padding: "24px 16px",
  borderRadius: "8px",
  border: "1px solid var(--color-cax-border)",
};

let highlighterPromise: Promise<LoadedHighlighter> | null = null;

const normalizeLanguage = (language: string) => {
  switch (language) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "jsx":
      return "jsx";
    case "sh":
      return "bash";
    case "html":
      return "xml";
    case "md":
      return "markdown";
    case "yml":
      return "yaml";
    default:
      return language;
  }
};

const loadHighlighter = () => {
  highlighterPromise ??= Promise.all([
    import("react-syntax-highlighter/dist/esm/light"),
    import("react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/bash"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/css"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/diff"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/javascript"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/json"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/markdown"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/plaintext"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/python"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/sql"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/typescript"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/xml"),
    import("react-syntax-highlighter/dist/esm/languages/hljs/yaml"),
  ]).then(
    ([
      { default: LightSyntaxHighlighter },
      { default: atomOneLight },
      { default: bash },
      { default: css },
      { default: diff },
      { default: javascript },
      { default: json },
      { default: markdown },
      { default: plaintext },
      { default: python },
      { default: sql },
      { default: typescript },
      { default: xml },
      { default: yaml },
    ]) => {
      LightSyntaxHighlighter.registerLanguage("bash", bash);
      LightSyntaxHighlighter.registerLanguage("css", css);
      LightSyntaxHighlighter.registerLanguage("diff", diff);
      LightSyntaxHighlighter.registerLanguage("javascript", javascript);
      LightSyntaxHighlighter.registerLanguage("json", json);
      LightSyntaxHighlighter.registerLanguage("jsx", javascript);
      LightSyntaxHighlighter.registerLanguage("markdown", markdown);
      LightSyntaxHighlighter.registerLanguage("plaintext", plaintext);
      LightSyntaxHighlighter.registerLanguage("python", python);
      LightSyntaxHighlighter.registerLanguage("sql", sql);
      LightSyntaxHighlighter.registerLanguage("typescript", typescript);
      LightSyntaxHighlighter.registerLanguage("tsx", typescript);
      LightSyntaxHighlighter.registerLanguage("xml", xml);
      LightSyntaxHighlighter.registerLanguage("yaml", yaml);

      return {
        SyntaxHighlighter: LightSyntaxHighlighter,
        style: atomOneLight,
      };
    },
  );

  return highlighterPromise;
};

const getLanguage = (children: ReactElement<ComponentProps<"code">>) => {
  const className = children.props.className;
  if (typeof className === "string") {
    const match = className.match(/language-(\w+)/);
    return normalizeLanguage(match?.[1] ?? "javascript");
  }
  return "javascript";
};

const isCodeElement = (children: ReactNode): children is ReactElement<ComponentProps<"code">> =>
  isValidElement(children) && children.type === "code";

export const CodeBlock = ({ children }: ComponentProps<"pre">) => {
  if (!isCodeElement(children)) return <>{children}</>;
  const language = getLanguage(children);
  const code = children.props.children?.toString() ?? "";
  const [loadedHighlighter, setLoadedHighlighter] = useState<LoadedHighlighter | null>(null);

  useEffect(() => {
    let isMounted = true;
    void loadHighlighter().then((highlighter) => {
      if (isMounted) {
        setLoadedHighlighter(highlighter);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadedHighlighter == null) {
    return (
      <pre style={CUSTOM_STYLE}>
        <code>{code}</code>
      </pre>
    );
  }

  const { SyntaxHighlighter, style } = loadedHighlighter;

  return (
    <SyntaxHighlighter
      customStyle={CUSTOM_STYLE}
      language={language}
      style={style}
    >
      {code}
    </SyntaxHighlighter>
  );
};
