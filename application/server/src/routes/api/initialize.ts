import fs from "node:fs/promises";

import { Hono } from "hono";

import { UPLOAD_PATH } from "@web-speed-hackathon-2026/server/src/paths";
import { sessionStore } from "@web-speed-hackathon-2026/server/src/session";

import { initializeSequelize } from "../../sequelize";
import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

router.post("/initialize", async (c) => {
  await initializeSequelize();
  sessionStore.clear();
  await fs.rm(UPLOAD_PATH, { force: true, recursive: true });
  return c.json({});
});

export { router as initializeRouter };
