import { FFmpeg } from "@ffmpeg/ffmpeg";

function toAssetURL(assetPath: string): string {
  return new URL(assetPath, window.location.href).toString();
}

let ffmpegAssetUrlsPromise:
  | Promise<{
      coreURL: string;
      wasmURL: string;
    }>
  | null = null;

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegAssetUrlsPromise === null) {
    ffmpegAssetUrlsPromise = Promise.all([
      import("@ffmpeg/core?url"),
      import("@ffmpeg/core/wasm?url"),
    ])
      .then(([coreModule, wasmModule]) => {
        return {
          coreURL: toAssetURL(coreModule.default),
          wasmURL: toAssetURL(wasmModule.default),
        };
      })
      .catch((error) => {
        // Allow retry on subsequent calls if the initial load fails
        ffmpegAssetUrlsPromise = null;
        throw error;
      });
  }
  const ffmpeg = new FFmpeg();
  const { coreURL, wasmURL } = await ffmpegAssetUrlsPromise;

  await ffmpeg.load({
    coreURL,
    wasmURL,
  });

  return ffmpeg;
}
