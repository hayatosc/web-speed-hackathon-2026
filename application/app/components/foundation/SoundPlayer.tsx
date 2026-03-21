import { ReactEventHandler, useCallback, useEffect, useRef, useState } from "react";

import { AspectRatioBox } from "@web-speed-hackathon-2026/client/app/components/foundation/AspectRatioBox";
import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/app/components/foundation/FontAwesomeIcon";
import { SoundWaveSVG } from "@web-speed-hackathon-2026/client/app/components/foundation/SoundWaveSVG";
import { useNearScreen } from "@web-speed-hackathon-2026/client/app/hooks/use_near_screen";
import { getSoundPath } from "@web-speed-hackathon-2026/client/app/utils/get_path";

interface Props {
  sound: Models.Sound;
}

export const SoundPlayer = ({ sound }: Props) => {
  const { isNearScreen, ref: containerRef } = useNearScreen<HTMLDivElement>();
  const [hasLoadedMetadata, setHasLoadedMetadata] = useState(false);

  const [currentTimeRatio, setCurrentTimeRatio] = useState(0);
  const handleTimeUpdate = useCallback<ReactEventHandler<HTMLAudioElement>>((ev) => {
    const el = ev.currentTarget;
    const durationSeconds = el.duration || sound.durationMs / 1000;

    setCurrentTimeRatio(durationSeconds > 0 ? el.currentTime / durationSeconds : 0);
  }, [sound.durationMs]);

  const handleLoadedMetadata = useCallback<ReactEventHandler<HTMLAudioElement>>(() => {
    setHasLoadedMetadata(true);
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handleTogglePlaying = useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        void audioRef.current?.play();
      }
      return !isPlaying;
    });
  }, []);

  useEffect(() => {
    if (!isNearScreen) {
      setHasLoadedMetadata(false);
      setCurrentTimeRatio(0);
      setIsPlaying(false);
      return;
    }

    const audioElement = audioRef.current;

    return () => {
      audioElement?.pause();
    };
  }, [isNearScreen]);

  return (
    <div ref={containerRef} className="bg-cax-surface-subtle flex h-full w-full items-center justify-center">
      {isNearScreen ? (
        <audio
          ref={audioRef}
          loop={true}
          onLoadedMetadata={handleLoadedMetadata}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={handleTimeUpdate}
          preload="metadata"
          src={getSoundPath(sound.id)}
        />
      ) : null}
      <div className="p-2">
        {!isNearScreen ? (
          <div aria-hidden="true" className="bg-cax-text-subtle/20 h-8 w-8 rounded-full" />
        ) : (
          <button
            className="bg-cax-accent text-cax-surface-raised flex h-8 w-8 items-center justify-center rounded-full text-sm hover:opacity-75"
            data-prevent-post-navigation="true"
            onClick={handleTogglePlaying}
            type="button"
          >
            <FontAwesomeIcon iconType={isPlaying ? "pause" : "play"} styleType="solid" />
          </button>
        )}
      </div>
      <div className="flex h-full min-w-0 shrink grow flex-col pt-2">
        <p className="overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
          {sound.title}
        </p>
        <p className="text-cax-text-muted overflow-hidden text-sm text-ellipsis whitespace-nowrap">
          {sound.artist}
        </p>
        <div className="pt-2">
          <AspectRatioBox aspectHeight={1} aspectWidth={10}>
            {!isNearScreen ? (
              <div aria-hidden="true" className="bg-cax-text-subtle/10 h-full w-full rounded" />
            ) : (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 h-full w-full">
                  <SoundWaveSVG peaks={sound.waveformPeaks ?? []} />
                </div>
                <div
                  className="bg-cax-surface-subtle absolute inset-0 h-full w-full opacity-75"
                  style={{ left: `${currentTimeRatio * 100}%` }}
                ></div>
              </div>
            )}
          </AspectRatioBox>
        </div>
        {hasLoadedMetadata ? null : <span className="sr-only">音声メタデータを読み込み中</span>}
      </div>
    </div>
  );
};
