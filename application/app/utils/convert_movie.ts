import type { FFmpeg } from "@ffmpeg/ffmpeg";

import { withFFmpeg } from "@web-speed-hackathon-2026/client/app/utils/load_ffmpeg";

interface Options {
  extension: string;
  size?: number | undefined;
}

async function safeDeleteFile(ffmpeg: FFmpeg, filePath: string): Promise<void> {
  try {
    await ffmpeg.deleteFile(filePath);
  } catch {
    // Ignore cleanup failures for best-effort temp files.
  }
}

/**
 * 先頭 5 秒のみ、正方形にくり抜かれた無音動画を作成します
 */
export async function convertMovie(file: File, options: Options): Promise<Blob> {
  return withFFmpeg(async (ffmpeg) => {
    const jobId = crypto.randomUUID();
    const inputFile = `${jobId}-movie`;
    const exportFile = `${jobId}-export.${options.extension}`;
    const cropOptions = [
      "'min(iw,ih)':'min(iw,ih)'",
      options.size ? `scale=${options.size}:${options.size}` : undefined,
    ]
      .filter(Boolean)
      .join(",");

    try {
      await ffmpeg.writeFile(inputFile, new Uint8Array(await file.arrayBuffer()));

      await ffmpeg.exec([
        "-i",
        inputFile,
        "-t",
        "5",
        "-vf",
        `fps=10,crop=${cropOptions}`,
        "-an",
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        "34",
        "-pix_fmt",
        "yuv420p",
        exportFile,
      ]);

      const output = (await ffmpeg.readFile(exportFile)) as Uint8Array<ArrayBuffer>;
      return new Blob([output], { type: "video/webm" });
    } finally {
      await Promise.all([safeDeleteFile(ffmpeg, inputFile), safeDeleteFile(ffmpeg, exportFile)]);
    }
  });
}
