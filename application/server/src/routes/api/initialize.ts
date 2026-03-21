import fs from "node:fs/promises";

import { Hono } from "hono";

import { initializeDatabase } from "@web-speed-hackathon-2026/server/src/db";
import { UPLOAD_PATH } from "@web-speed-hackathon-2026/server/src/paths";
import { sessionStore } from "@web-speed-hackathon-2026/server/src/session";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

router.post("/initialize", async (c) => {
  sessionStore.clear();
  await Promise.all([
    initializeDatabase(),
    fs.rm(UPLOAD_PATH, { force: true, recursive: true }),
  ]);
  return c.json({});
});

export { router as initializeRouter };
