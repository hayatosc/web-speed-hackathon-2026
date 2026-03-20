import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(async () => {
  const plugins = [react()];

  if (process.env["ANALYZE"]) {
    const { visualizer } = await import("rollup-plugin-visualizer");
    plugins.push(
      visualizer({
        filename: resolve(__dirname, "../dist/stats.html"),
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: [
        {
          find: "@web-speed-hackathon-2026/client",
          replacement: resolve(__dirname, "."),
        },
        {
          find: /^bayesian-bm25$/,
          replacement: resolve(__dirname, "node_modules/bayesian-bm25/dist/index.js"),
        },
        {
          find: /^kuromoji$/,
          replacement: resolve(__dirname, "node_modules/kuromoji/build/kuromoji.js"),
        },
        {
          find: /^@ffmpeg\/ffmpeg$/,
          replacement: resolve(__dirname, "node_modules/@ffmpeg/ffmpeg/dist/esm/index.js"),
        },
        {
          find: /^@ffmpeg\/core$/,
          replacement: resolve(__dirname, "node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js"),
        },
        {
          find: /^@ffmpeg\/core\/wasm$/,
          replacement: resolve(__dirname, "node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm"),
        },
        {
          find: /^@imagemagick\/magick-wasm\/magick\.wasm$/,
          replacement: resolve(__dirname, "node_modules/@imagemagick/magick-wasm/dist/magick.wasm"),
        },
      ],
    },
    define: {
      "process.env": JSON.stringify({
        BUILD_DATE: process.env["BUILD_DATE"] ?? new Date().toISOString(),
        COMMIT_HASH: process.env["COMMIT_HASH"] ?? process.env["SOURCE_VERSION"] ?? "",
        NODE_ENV: process.env["NODE_ENV"] ?? "development",
      }),
    },
    server: {
      port: 8080,
      proxy: {
        "/api": "http://localhost:3000",
      },
    },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
  };
});
