import { Buffer } from 'node:buffer';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { imageSize } from 'image-size';
import * as MusicMetadata from 'music-metadata';
import piexif from 'piexifjs';

const UNKNOWN_ARTIST = 'Unknown';
const UNKNOWN_TITLE = 'Unknown';
const WAVEFORM_BUCKET_COUNT = 100;

export interface ImageDetails {
  alt: string;
  height: number;
  width: number;
}

export interface SoundDetails {
  artist: string;
  durationMs: number;
  title: string;
  waveformPeaks: number[];
}

export function extractImageDetails(data: Buffer): ImageDetails {
  const dimensions = imageSize(data);

  if (dimensions.width == null || dimensions.height == null) {
    throw new Error('Failed to extract image dimensions');
  }

  return {
    alt: extractImageAlt(data),
    height: dimensions.height,
    width: dimensions.width,
  };
}

export async function extractImageDetailsFromFile(filePath: string): Promise<ImageDetails> {
  const sidecarPath = filePath.replace(path.extname(filePath), '.json');

  try {
    const raw = await fs.readFile(sidecarPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<ImageDetails>;

    if (
      typeof parsed.alt === 'string' &&
      typeof parsed.width === 'number' &&
      Number.isFinite(parsed.width) &&
      typeof parsed.height === 'number' &&
      Number.isFinite(parsed.height)
    ) {
      return {
        alt: parsed.alt,
        height: Math.max(1, Math.round(parsed.height)),
        width: Math.max(1, Math.round(parsed.width)),
      };
    }
  } catch {
    // Fall back to binary metadata extraction when no sidecar is available.
  }

  return extractImageDetails(await fs.readFile(filePath));
}

export async function extractSoundDetails(data: Buffer): Promise<SoundDetails> {
  try {
    const metadata = await MusicMetadata.parseBuffer(data);

    return {
      artist: metadata.common.artist ?? UNKNOWN_ARTIST,
      durationMs: Math.max(0, Math.round((metadata.format.duration ?? 0) * 1000)),
      title: metadata.common.title ?? UNKNOWN_TITLE,
      waveformPeaks: createWaveformPeaks(data),
    };
  } catch {
    return {
      artist: UNKNOWN_ARTIST,
      durationMs: 0,
      title: UNKNOWN_TITLE,
      waveformPeaks: createWaveformPeaks(data),
    };
  }
}

function extractImageAlt(data: Buffer): string {
  try {
    const exif = piexif.load(data.toString('binary'));
    const raw = exif?.['0th']?.[piexif.ImageIFD.ImageDescription];

    if (typeof raw !== 'string' || raw.length === 0) {
      return '';
    }

    return new TextDecoder().decode(Buffer.from(raw, 'binary'));
  } catch {
    return '';
  }
}

function createWaveformPeaks(data: Buffer): number[] {
  const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

  if (bytes.length === 0) {
    return Array.from({ length: WAVEFORM_BUCKET_COUNT }, () => 0);
  }

  const chunkSize = Math.max(1, Math.ceil(bytes.length / WAVEFORM_BUCKET_COUNT));
  const peaks: number[] = [];
  let max = 0;

  for (let start = 0; start < bytes.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, bytes.length);
    let total = 0;

    for (let index = start; index < end; index += 1) {
      total += Math.abs((bytes[index] ?? 128) - 128);
    }

    const peak = end === start ? 0 : total / ((end - start) * 128);
    peaks.push(peak);
    max = Math.max(max, peak);
  }

  if (max === 0) {
    return peaks.map(() => 0);
  }

  return peaks.map((peak) => Number((peak / max).toFixed(4)));
}
