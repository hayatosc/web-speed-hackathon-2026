import classNames from "classnames";
import { RefCallback, useCallback, useEffect, useRef, useState } from "react";

import { AspectRatioBox } from "@web-speed-hackathon-2026/client/app/components/foundation/AspectRatioBox";
import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/app/components/foundation/FontAwesomeIcon";
import { useFetch } from "@web-speed-hackathon-2026/client/app/hooks/use_fetch";
import { useNearScreen } from "@web-speed-hackathon-2026/client/app/hooks/use_near_screen";
import { fetchBinary } from "@web-speed-hackathon-2026/client/app/utils/fetchers";

interface Props {
  src: string;
}

interface MovieAnimator {
  animateInCanvas: (canvas: HTMLCanvasElement) => void;
  onFrame: (frame: unknown) => void;
  start: () => void;
  stop: () => void;
}

/**
 * クリックすると再生・一時停止を切り替えます。
 */
export const PausableMovie = ({ src }: Props) => {
  const { isNearScreen, ref: containerRef } = useNearScreen<HTMLDivElement>();
  const { data, isLoading } = useFetch(isNearScreen ? src : "", fetchBinary);

  const animatorRef = useRef<MovieAnimator | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCallbackRef = useCallback<RefCallback<HTMLCanvasElement>>((el) => {
    canvasElementRef.current = el;
  }, []);

  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let isDisposed = false;
    const canvas = canvasElementRef.current;
    animatorRef.current?.stop();
    animatorRef.current = null;

    if (canvas === null || data === null) {
      return;
    }

    void Promise.all([import("gifler"), import("omggif")]).then(
      ([{ Animator, Decoder }, { GifReader }]) => {
        if (isDisposed || canvasElementRef.current !== canvas) {
          return;
        }

        const reader = new GifReader(new Uint8Array(data));
        const frames = Decoder.decodeFramesSync(reader);
        const animator = new Animator(reader, frames) as MovieAnimator;
        animator.animateInCanvas(canvas);
        animator.onFrame(frames[0]!);

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setIsPlaying(false);
          animator.stop();
        } else {
          setIsPlaying(true);
          animator.start();
        }

        animatorRef.current = animator;
      },
    );

    return () => {
      isDisposed = true;
      animatorRef.current?.stop();
      animatorRef.current = null;
    };
  }, [data]);

  const handleClick = useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        animatorRef.current?.stop();
      } else {
        animatorRef.current?.start();
      }
      return !isPlaying;
    });
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <AspectRatioBox aspectHeight={1} aspectWidth={1}>
        {isLoading || data === null ? (
          <div aria-hidden="true" className="bg-cax-surface-subtle h-full w-full" />
        ) : (
          <button
            aria-label="動画プレイヤー"
            className="group relative block h-full w-full"
            onClick={handleClick}
            type="button"
            data-prevent-post-navigation="true"
          >
            <canvas ref={canvasCallbackRef} className="w-full" />
            <div
              className={classNames(
                "absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-cax-surface-raised text-3xl bg-cax-overlay/50 rounded-full -translate-x-1/2 -translate-y-1/2",
                {
                  "opacity-0 group-hover:opacity-100": isPlaying,
                },
              )}
            >
              <FontAwesomeIcon iconType={isPlaying ? "pause" : "play"} styleType="solid" />
            </div>
          </button>
        )}
      </AspectRatioBox>
    </div>
  );
};
