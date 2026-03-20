import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ValidationError } from "sequelize";

import { authRouter } from "@web-speed-hackathon-2026/server/src/routes/api/auth";
import { crokRouter } from "@web-speed-hackathon-2026/server/src/routes/api/crok";
import { createDirectMessageRouter } from "@web-speed-hackathon-2026/server/src/routes/api/direct_message";
import { imageRouter } from "@web-speed-hackathon-2026/server/src/routes/api/image";
import { initializeRouter } from "@web-speed-hackathon-2026/server/src/routes/api/initialize";
import { movieRouter } from "@web-speed-hackathon-2026/server/src/routes/api/movie";
import { postRouter } from "@web-speed-hackathon-2026/server/src/routes/api/post";
import { searchRouter } from "@web-speed-hackathon-2026/server/src/routes/api/search";
import { soundRouter } from "@web-speed-hackathon-2026/server/src/routes/api/sound";
import { userRouter } from "@web-speed-hackathon-2026/server/src/routes/api/user";

import type { NodeWebSocket } from "@hono/node-ws";
import type { HonoEnv } from "../types";

export function createApiRouter(upgradeWebSocket: NodeWebSocket["upgradeWebSocket"]) {
  const router = new Hono<HonoEnv>();

  router.route("/", initializeRouter);
  router.route("/", userRouter);
  router.route("/", postRouter);
  router.route("/", createDirectMessageRouter(upgradeWebSocket));
  router.route("/", searchRouter);
  router.route("/", movieRouter);
  router.route("/", imageRouter);
  router.route("/", soundRouter);
  router.route("/", authRouter);
  router.route("/", crokRouter);

  router.onError((err, c) => {
    if (err instanceof ValidationError) {
      return c.json({ message: "Bad Request" }, 400);
    }
    if (err instanceof HTTPException) {
      return c.json({ message: err.message }, err.status);
    }
    console.error(err);
    return c.json({ message: "Internal Server Error" }, 500);
  });

  return router;
}
