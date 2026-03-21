import { ComponentPropsWithoutRef, forwardRef, SyntheticEvent, useEffect, useState } from "react";

interface Props extends Omit<ComponentPropsWithoutRef<"img">, "src"> {
  avifSrc?: string;
  fallbackSrc: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, Props>(
  ({ avifSrc, fallbackSrc, onError, ...props }, ref) => {
    const [currentSrc, setCurrentSrc] = useState(avifSrc ?? fallbackSrc);

    useEffect(() => {
      setCurrentSrc(avifSrc ?? fallbackSrc);
    }, [avifSrc, fallbackSrc]);

    const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }

      onError?.(event);
    };

    return <img {...props} onError={handleError} ref={ref} src={currentSrc} />;
  },
);

OptimizedImage.displayName = "OptimizedImage";
