import { useEffect, useState } from "react";

interface ReturnValues<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetch<T>(
  apiPath: string,
  fetcher: (apiPath: string, signal?: AbortSignal) => Promise<T>,
): ReturnValues<T> {
  const [result, setResult] = useState<ReturnValues<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (apiPath === "") {
      setResult(() => ({
        data: null,
        error: null,
        isLoading: false,
      }));
      return;
    }

    const controller = new AbortController();

    setResult(() => ({
      data: null,
      error: null,
      isLoading: true,
    }));

    void fetcher(apiPath, controller.signal).then(
      (data) => {
        if (controller.signal.aborted) {
          return;
        }
        setResult((cur) => ({
          ...cur,
          data,
          isLoading: false,
        }));
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
      },
    );

    return () => {
      controller.abort();
    };
  }, [apiPath, fetcher]);

  return result;
}
