import { useCallback, useEffect, useRef, useState } from "react";

const LIMIT = 30;

interface ReturnValues<T> {
  data: Array<T>;
  error: Error | null;
  isLoading: boolean;
  fetchMore: () => void;
}

interface InternalState {
  controller: AbortController | null;
  hasMore: boolean;
  isLoading: boolean;
  offset: number;
}

function buildPaginatedApiPath(apiPath: string, limit: number, offset: number): string {
  const url = new URL(apiPath, window.location.origin);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  return `${url.pathname}${url.search}`;
}

export function useInfiniteFetch<T>(
  apiPath: string,
  fetcher: (apiPath: string, signal?: AbortSignal) => Promise<T[]>,
  initialData?: T[],
): ReturnValues<T> {
  const skipFirstFetch = useRef(initialData !== undefined);

  const internalRef = useRef<InternalState>({
    controller: null,
    hasMore: apiPath !== "" && (initialData === undefined || initialData.length === LIMIT),
    isLoading: false,
    offset: initialData?.length ?? 0,
  });

  const [result, setResult] = useState<Omit<ReturnValues<T>, "fetchMore">>(() => ({
    data: initialData ?? [],
    error: null,
    isLoading: apiPath !== "" && initialData === undefined,
  }));

  const fetchMore = useCallback(() => {
    const { hasMore, isLoading, offset } = internalRef.current;
    if (apiPath === "" || !hasMore || isLoading) {
      return;
    }

    const controller = new AbortController();
    setResult((cur) => ({
      ...cur,
      error: null,
      isLoading: true,
    }));
    internalRef.current = {
      controller,
      hasMore,
      isLoading: true,
      offset,
    };

    void fetcher(buildPaginatedApiPath(apiPath, LIMIT, offset), controller.signal).then(
      (pageData) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult((cur) => ({
          ...cur,
          data: [...cur.data, ...pageData],
          isLoading: false,
        }));
        internalRef.current = {
          controller: null,
          hasMore: pageData.length === LIMIT,
          isLoading: false,
          offset: offset + pageData.length,
        };
      },
      (error) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult((cur) => ({
          ...cur,
          error,
          isLoading: false,
        }));
        internalRef.current = {
          controller: null,
          hasMore,
          isLoading: false,
          offset,
        };
      },
    );
  }, [apiPath, fetcher]);

  useEffect(() => {
    internalRef.current.controller?.abort();

    if (apiPath === "") {
      setResult(() => ({
        data: [],
        error: null,
        isLoading: false,
      }));
      internalRef.current = {
        controller: null,
        hasMore: false,
        isLoading: false,
        offset: 0,
      };
      return;
    }

    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return () => {
        internalRef.current.controller?.abort();
      };
    }

    setResult(() => ({
      data: [],
      error: null,
      isLoading: true,
    }));
    internalRef.current = {
      controller: null,
      hasMore: true,
      isLoading: false,
      offset: 0,
    };

    fetchMore();

    return () => {
      internalRef.current.controller?.abort();
    };
  }, [fetchMore]);

  return {
    ...result,
    fetchMore,
  };
}
