import fs from "node:fs/promises";
import path from "node:path";

import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import {
  CLIENT_DIST_PATH,
  PUBLIC_PATH,
  UPLOAD_PATH,
} from "@web-speed-hackathon-2026/server/src/paths";

const MIME_TYPES: Record<string, string> = {
  css: "text/css",
  html: "text/html",
  js: "text/javascript",
  json: "application/json",
  svg: "image/svg+xml",
  wasm: "application/wasm",
};

const router = new Hono();

// Pre-compressed ファイル配信（クライアントビルド成果物向け）
router.use("*", async (c, next) => {
  const reqPath = new URL(c.req.url).pathname;
  const acceptEncoding = c.req.header("accept-encoding") ?? "";

  const tryServe = async (
    compPath: string,
    encoding: string,
    origPath: string,
  ): Promise<Response | null> => {
    try {
      await fs.access(compPath);
      const content = await fs.readFile(compPath);
      const ext = path.extname(origPath).slice(1);
      const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
      return new Response(content as unknown as BodyInit, {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Encoding": encoding,
          "Content-Type": contentType,
        },
      });
    } catch {
      return null;
    }
  };

  const origPath = path.resolve(CLIENT_DIST_PATH, reqPath.slice(1));
  if (!origPath.startsWith(CLIENT_DIST_PATH)) {
    await next();
    return;
  }

  if (acceptEncoding.includes("br")) {
    const res = await tryServe(`${origPath}.br`, "br", origPath);
    if (res) return res;
  }
  if (acceptEncoding.includes("gzip")) {
    const res = await tryServe(`${origPath}.gz`, "gzip", origPath);
    if (res) return res;
  }

  await next();
  return;
});

// メディアファイルにキャッシュヘッダーを付与するミドルウェア
router.use("*", async (c, next) => {
  await next();
  const pathname = new URL(c.req.url).pathname;
  if (
    c.res.status === 200 &&
    /\.(avif|jpg|jpeg|png|gif|webp|mp3|webm|mp4)$/.test(pathname)
  ) {
    const newHeaders = new Headers(c.res.headers);
    newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    c.res = new Response(c.res.body, {
      status: c.res.status,
      headers: newHeaders,
    });
  }
});

// アップロードファイル配信
router.use(
  "*",
  serveStatic({
    root: path.relative(process.cwd(), UPLOAD_PATH),
  }),
);

// パブリックファイル配信
router.use(
  "*",
  serveStatic({
    root: path.relative(process.cwd(), PUBLIC_PATH),
  }),
);

// クライアントビルド成果物配信
router.use(
  "*",
  serveStatic({
    root: path.relative(process.cwd(), CLIENT_DIST_PATH),
  }),
);

export { router as staticRouter };
