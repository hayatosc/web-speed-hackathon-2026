import { useEffect, useRef, useState } from "react";

interface ParsedData {
  max: number;
  peaks: number[];
}

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
};

const chunk = <T,>(values: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
};

async function calculate(data: ArrayBuffer): Promise<ParsedData> {
  const AudioContextImpl =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (AudioContextImpl === undefined) {
    return { max: 0, peaks: [] };
  }

  const audioCtx = new AudioContextImpl();

  try {
    const buffer = await audioCtx.decodeAudioData(data.slice(0));
    const leftData = buffer.getChannelData(0);
    const rightData = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : leftData;
    const chunkSize = Math.max(1, Math.ceil(leftData.length / 100));

    let max = 0;
    const peaks: number[] = [];

    for (let start = 0; start < leftData.length; start += chunkSize) {
      const end = Math.min(start + chunkSize, leftData.length);
      let total = 0;

      for (let index = start; index < end; index += 1) {
        total += (Math.abs(leftData[index] ?? 0) + Math.abs(rightData[index] ?? 0)) / 2;
      }

      const peak = total / (end - start);
      peaks.push(peak);
      max = Math.max(max, peak);
    }

    return { max, peaks };
  } finally {
    void audioCtx.close().catch(() => {});
  }
}

interface Props {
  soundData: ArrayBuffer;
}

export const SoundWaveSVG = ({ soundData }: Props) => {
  const uniqueIdRef = useRef(Math.random().toString(16));
  const [{ max, peaks }, setPeaks] = useState<ParsedData>({
    max: 0,
    peaks: [],
  });

  useEffect(() => {
    calculate(soundData).then(({ max, peaks }) => {
      setPeaks({ max, peaks });
    });
  }, [soundData]);

  return (
    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect
            key={`${uniqueIdRef.current}#${idx}`}
            fill="var(--color-cax-accent)"
            height={ratio}
            width="1"
            x={idx}
            y={1 - ratio}
          />
        );
      })}
    </svg>
  );
};
