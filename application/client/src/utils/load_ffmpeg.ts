import { FFmpeg } from "@ffmpeg/ffmpeg";

function toAssetURL(assetPath: string): string {
  return new URL(assetPath, window.location.href).toString();
}

const ffmpegAssetUrlsPromise = Promise.all([
  import("@ffmpeg/core?url"),
  import("@ffmpeg/core/wasm?url"),
]).then(([coreModule, wasmModule]) => {
  return {
    coreURL: toAssetURL(coreModule.default),
    wasmURL: toAssetURL(wasmModule.default),
  };
});

export async function loadFFmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
  const { coreURL, wasmURL } = await ffmpegAssetUrlsPromise;

  await ffmpeg.load({
    coreURL,
    wasmURL,
  });

  return ffmpeg;
}
