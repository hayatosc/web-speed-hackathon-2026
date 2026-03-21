import { ComponentPropsWithoutRef, useMemo } from "react";
import { useNavigate } from "react-router";

import { Timeline } from "@web-speed-hackathon-2026/client/app/components/timeline/Timeline";
import { useForm } from "@web-speed-hackathon-2026/client/app/hooks/use_form";
import {
  parseSearchQuery,
  sanitizeSearchText,
} from "@web-speed-hackathon-2026/client/app/search/services";
import { SearchFormData } from "@web-speed-hackathon-2026/client/app/search/types";
import { validate } from "@web-speed-hackathon-2026/client/app/search/validation";

import { Button } from "../foundation/Button";

interface Props {
  query: string;
  results: Models.Post[];
  sentiment: Models.Sentiment | null;
}

interface SearchInputProps extends Omit<ComponentPropsWithoutRef<"input">, "children"> {
  error?: string;
}

const SearchInput = ({ error, ...props }: SearchInputProps) => {
  const shouldShowError = Boolean(error);

  return (
    <div className="flex flex-1 flex-col">
      <input
        {...props}
        aria-label="検索 (例: キーワード since:2025-01-01 until:2025-12-31)"
        className={`flex-1 rounded border px-4 py-2 focus:outline-none ${
          shouldShowError
            ? "border-cax-danger focus:border-cax-danger"
            : "border-cax-border focus:border-cax-brand-strong"
        }`}
        placeholder="検索 (例: キーワード since:2025-01-01 until:2025-12-31)"
        type="text"
      />
      {shouldShowError && <span className="text-cax-danger mt-1 text-xs">{error}</span>}
    </div>
  );
};

export const SearchPage = ({ query, results, sentiment }: Props) => {
  const navigate = useNavigate();
  const { getFieldError, getInputProps, handleSubmit } = useForm<SearchFormData>({
    initialValues: {
      searchText: query,
    },
    onSubmit: (values) => {
      const sanitizedText = sanitizeSearchText(values.searchText.trim());
      navigate(`/search?q=${encodeURIComponent(sanitizedText)}`);
    },
    validate,
  });

  const parsed = parseSearchQuery(query);
  const isNegative = sentiment?.label === "negative";

  const searchConditionText = useMemo(() => {
    const parts: string[] = [];
    if (parsed.keywords) {
      parts.push(`「${parsed.keywords}」`);
    }
    if (parsed.sinceDate) {
      parts.push(`${parsed.sinceDate} 以降`);
    }
    if (parsed.untilDate) {
      parts.push(`${parsed.untilDate} 以前`);
    }
    return parts.join(" ");
  }, [parsed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-cax-surface p-4 shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <SearchInput {...getInputProps("searchText")} error={getFieldError("searchText")} />
            <Button variant="primary" type="submit">
              検索
            </Button>
          </div>
        </form>
        <p className="text-cax-text-muted mt-2 text-xs">
          since:YYYY-MM-DD で開始日、until:YYYY-MM-DD で終了日を指定できます
        </p>
      </div>

      {query && (
        <div className="px-4">
          <h2 className="text-lg font-bold">
            {searchConditionText} の検索結果 ({results.length} 件)
          </h2>
        </div>
      )}

      {isNegative && (
        <article className="hover:bg-cax-surface-subtle px-1 sm:px-4">
          <div className="border-cax-border flex border-b px-2 pt-2 pb-4 sm:px-4">
            <div>
              <p className="text-cax-text text-lg font-bold">どしたん話聞こうか?</p>
              <p className="text-cax-text-muted">言わなくてもいいけど、言ってもいいよ。</p>
            </div>
          </div>
        </article>
      )}

      {query && results.length === 0 ? (
        <div className="text-cax-text-muted flex items-center justify-center p-8">
          検索結果が見つかりませんでした
        </div>
      ) : (
        <Timeline timeline={results} />
      )}
    </div>
  );
};
