import fs from "node:fs/promises";

import { Hono } from "hono";

import { initializeDatabase } from "@web-speed-hackathon-2026/server/src/db";
import { UPLOAD_PATH } from "@web-speed-hackathon-2026/server/src/paths";
import { sessionStore } from "@web-speed-hackathon-2026/server/src/session";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

const WARM_PATHS = ["/", "/posts", "/search"];

async function warmCache(origin: string): Promise<void> {
  await Promise.allSettled(WARM_PATHS.map((p) => fetch(`${origin}${p}`)));
}

router.post("/initialize", async (c) => {
  sessionStore.clear();
  await Promise.all([
    initializeDatabase(),
    fs.rm(UPLOAD_PATH, { force: true, recursive: true }),
  ]);

  // Fire-and-forget: warm SSR cache for score-critical routes
  const origin = new URL(c.req.url).origin;
  void warmCache(origin);

  return c.json({});
});

export { router as initializeRouter };
