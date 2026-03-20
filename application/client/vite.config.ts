import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * ?binary サフィックス付きインポートをファイルの Uint8Array として提供するプラグイン。
 * webpack の `resourceQuery: /binary/, type: "asset/bytes"` と同等の動作。
 */
function binaryPlugin(): Plugin {
  return {
    name: "binary-loader",
    enforce: "pre",
    async resolveId(id, importer) {
      if (!id.includes("?binary")) return null;
      const base = id.split("?")[0]!;
      const resolved = await this.resolve(base, importer, { skipSelf: true });
      if (!resolved) return null;
      // Strip \0 (virtual module prefix) and any internal query params (e.g. ?commonjs-es-import)
      // to obtain the actual file path on disk.
      let filePath = resolved.id;
      if (filePath.startsWith("\0")) filePath = filePath.slice(1);
      filePath = filePath.split("?")[0]!;
      return filePath + "?binary";
    },
    load(id) {
      if (!id.endsWith("?binary")) return null;
      const filePath = id.slice(0, -"?binary".length);
      const buffer = readFileSync(filePath);
      const base64 = buffer.toString("base64");
      return `const b=atob("${base64}");const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);export default u;`;
    },
  };
}

export default defineConfig(async () => {
  const { visualizer } = await import("rollup-plugin-visualizer");

  return {
    plugins: [
      binaryPlugin(),
      react(),
      visualizer({
        filename: resolve(__dirname, "../dist/stats.html"),
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
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
