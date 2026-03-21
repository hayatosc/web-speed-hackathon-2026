import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

import { AspectRatioBox } from "@web-speed-hackathon-2026/client/app/components/foundation/AspectRatioBox";
import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/app/components/foundation/FontAwesomeIcon";
import { useNearScreen } from "@web-speed-hackathon-2026/client/app/hooks/use_near_screen";

interface Props {
  src: string;
}

/**
 * クリックすると再生・一時停止を切り替えます。
 */
export const PausableMovie = ({ src }: Props) => {
  const { isNearScreen, ref: containerRef } = useNearScreen<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  const syncPlayback = useCallback(async (shouldPlay: boolean) => {
    const video = videoRef.current;
    if (video === null) {
      return;
    }

    if (shouldPlay) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isNearScreen !== true || isReady !== true) {
      void syncPlayback(false);
      return;
    }

    void syncPlayback(prefersReducedMotion !== true);
  }, [isNearScreen, isReady, prefersReducedMotion, syncPlayback]);

  useEffect(() => {
    setIsReady(false);
  }, [src]);

  const handleClick = useCallback(() => {
    void syncPlayback(isPlaying !== true);
  }, [isPlaying, syncPlayback]);

  const handleLoadedMetadata = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <AspectRatioBox aspectHeight={1} aspectWidth={1}>
        <button
          aria-label="動画プレイヤー"
          className="group relative block h-full w-full"
          onClick={handleClick}
          type="button"
          data-prevent-post-navigation="true"
        >
          {!isReady && <div aria-hidden="true" className="bg-cax-surface-subtle h-full w-full" />}
          {isNearScreen ? (
            <video
              ref={videoRef}
              className={classNames("absolute inset-0 h-full w-full object-cover", {
                "opacity-0": isReady !== true,
              })}
              loop
              muted
              onLoadedMetadata={handleLoadedMetadata}
              playsInline
              preload="metadata"
              src={src}
            />
          ) : null}
          <div
            className={classNames(
              "absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cax-overlay/50 text-3xl text-cax-surface-raised",
              {
                "opacity-0 group-hover:opacity-100": isPlaying,
              },
            )}
          >
            <FontAwesomeIcon iconType={isPlaying ? "pause" : "play"} styleType="solid" />
          </div>
        </button>
      </AspectRatioBox>
    </div>
  );
};
