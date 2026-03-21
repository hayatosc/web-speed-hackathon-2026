import { useEffect, useMemo, useState } from "react";

import { SearchPage } from "@web-speed-hackathon-2026/client/app/components/application/SearchPage";
import { InfiniteScroll } from "@web-speed-hackathon-2026/client/app/components/foundation/InfiniteScroll";
import { useSearchParams } from "@web-speed-hackathon-2026/client/app/hooks/use_search_params";
import { fetchJSON } from "@web-speed-hackathon-2026/client/app/utils/fetchers";

const LIMIT = 30;

export const SearchContainer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResult, setSearchResult] = useState<Models.SearchResponse>({
    posts: [],
    sentiment: null,
  });
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!query) {
      setSearchResult({
        posts: [],
        sentiment: null,
      });
      setVisibleCount(0);
      return;
    }

    const controller = new AbortController();

    setSearchResult({
      posts: [],
      sentiment: null,
    });
    setVisibleCount(0);

    void fetchJSON<Models.SearchResponse>(
      `/api/v1/search?q=${encodeURIComponent(query)}`,
      controller.signal,
    ).then(
      (result) => {
        if (controller.signal.aborted) {
          return;
        }

        setSearchResult(result);
        setVisibleCount(Math.min(LIMIT, result.posts.length));
      },
      () => {
        if (controller.signal.aborted) {
          return;
        }

        setSearchResult({
          posts: [],
          sentiment: null,
        });
        setVisibleCount(0);
      },
    );

    return () => {
      controller.abort();
    };
  }, [query]);

  const posts = useMemo(() => searchResult.posts.slice(0, visibleCount), [searchResult.posts, visibleCount]);
  const fetchMore = () => {
    setVisibleCount((current) => {
      if (current >= searchResult.posts.length) {
        return current;
      }

      return Math.min(current + LIMIT, searchResult.posts.length);
    });
  };

  return (
    <InfiniteScroll fetchMore={fetchMore} items={posts}>
      <SearchPage query={query} results={posts} sentiment={searchResult.sentiment} />
    </InfiniteScroll>
  );
};
