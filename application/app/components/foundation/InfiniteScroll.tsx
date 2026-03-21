import { ReactNode, useCallback, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  items: any[];
  fetchMore: () => void;
}

export const InfiniteScroll = ({ children, fetchMore, items }: Props) => {
  const latestItem = items[items.length - 1];
  const lastRequestedItemRef = useRef<Props["items"][number] | undefined>(undefined);

  const requestMore = useCallback(() => {
    if (latestItem === undefined || lastRequestedItemRef.current === latestItem) {
      return;
    }

    lastRequestedItemRef.current = latestItem;
    fetchMore();
  }, [fetchMore, latestItem]);

  useEffect(() => {
    let frameId = 0;

    const checkReachedBottom = () => {
      frameId = 0;
      const viewportBottom = window.innerHeight + window.scrollY;
      const documentBottom = document.documentElement.scrollHeight;
      if (viewportBottom >= documentBottom - 240) {
        requestMore();
      }
    };

    const scheduleCheck = () => {
      if (frameId !== 0) {
        return;
      }
      frameId = window.requestAnimationFrame(checkReachedBottom);
    };

    scheduleCheck();

    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [requestMore]);

  useEffect(() => {
    if (latestItem === undefined) {
      lastRequestedItemRef.current = undefined;
    }
  }, [latestItem]);

  return <>{children}</>;
};
