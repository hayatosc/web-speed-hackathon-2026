import history from "connect-history-api-fallback";
import { Router } from "express";
import expressStaticGzip from "express-static-gzip";
import serveStatic from "serve-static";

import {
  CLIENT_DIST_PATH,
  PUBLIC_PATH,
  UPLOAD_PATH,
} from "@web-speed-hackathon-2026/server/src/paths";

export const staticRouter = Router();

// SPA 対応のため、ファイルが存在しないときに index.html を返す
staticRouter.use(history());

staticRouter.use(
  serveStatic(UPLOAD_PATH, {
    etag: false,
    lastModified: false,
  }),
);

staticRouter.use(
  serveStatic(PUBLIC_PATH, {
    etag: false,
    lastModified: false,
  }),
);

staticRouter.use(
  expressStaticGzip(CLIENT_DIST_PATH, {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    serveStatic: {
      etag: false,
      lastModified: false,
    },
  }),
);
