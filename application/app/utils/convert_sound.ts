import type { FFmpeg } from "@ffmpeg/ffmpeg";

import { extractMetadataFromSound } from "@web-speed-hackathon-2026/client/app/utils/extract_metadata_from_sound";
import { withFFmpeg } from "@web-speed-hackathon-2026/client/app/utils/load_ffmpeg";

interface Options {
  extension: string;
}

async function safeDeleteFile(ffmpeg: FFmpeg, filePath: string): Promise<void> {
  try {
    await ffmpeg.deleteFile(filePath);
  } catch {
    // Ignore cleanup failures for best-effort temp files.
  }
}

export async function convertSound(file: File, options: Options): Promise<Blob> {
  return withFFmpeg(async (ffmpeg) => {
    const jobId = crypto.randomUUID();
    const inputFile = `${jobId}-sound`;
    const exportFile = `${jobId}-export.${options.extension}`;

    try {
      await ffmpeg.writeFile(inputFile, new Uint8Array(await file.arrayBuffer()));

      // 文字化けを防ぐためにメタデータを抽出して付与し直す
      const metadata = await extractMetadataFromSound(file, ffmpeg);

      await ffmpeg.exec([
        "-i",
        inputFile,
        "-metadata",
        `artist=${metadata.artist}`,
        "-metadata",
        `title=${metadata.title}`,
        "-vn",
        exportFile,
      ]);

      const output = (await ffmpeg.readFile(exportFile)) as Uint8Array<ArrayBuffer>;
      return new Blob([output]);
    } finally {
      await Promise.all([safeDeleteFile(ffmpeg, inputFile), safeDeleteFile(ffmpeg, exportFile)]);
    }
  });
}
