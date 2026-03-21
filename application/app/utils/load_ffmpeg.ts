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
let ffmpegPromise: Promise<FFmpeg> | null = null;
let ffmpegOperationQueue: Promise<void> = Promise.resolve();

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegPromise !== null) {
    return ffmpegPromise;
  }

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

  ffmpegPromise = (async () => {
    const ffmpeg = new FFmpeg();
    const { coreURL, wasmURL } = await ffmpegAssetUrlsPromise;

    await ffmpeg.load({
      coreURL,
      wasmURL,
    });

    return ffmpeg;
  })().catch((error) => {
    ffmpegPromise = null;
    throw error;
  });

  return ffmpegPromise;
}

export async function withFFmpeg<T>(operation: (ffmpeg: FFmpeg) => Promise<T>): Promise<T> {
  const run = async () => {
    const ffmpeg = await loadFFmpeg();
    return operation(ffmpeg);
  };

  const result = ffmpegOperationQueue.then(run, run);
  ffmpegOperationQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}
