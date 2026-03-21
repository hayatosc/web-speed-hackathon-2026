import { useEffect, useRef, useState } from "react";

interface Options {
  once?: boolean;
  rootMargin?: string;
}

export function useNearScreen<T extends Element>({
  once = true,
  rootMargin = "240px",
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [isNearScreen, setIsNearScreen] = useState(false);

  useEffect(() => {
    if (once && isNearScreen) {
      return;
    }

    const element = ref.current;
    if (element == null) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsNearScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries.some((entry) => entry.isIntersecting);
        if (isIntersecting) {
          setIsNearScreen(true);
          if (once) {
            observer.disconnect();
          }
          return;
        }

        if (!once) {
          setIsNearScreen(false);
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [isNearScreen, once, rootMargin]);

  return {
    isNearScreen,
    ref,
  };
}
