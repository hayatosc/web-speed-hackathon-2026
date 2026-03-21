import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { compress } from "hono/compress";

import { createApiRouter } from "@web-speed-hackathon-2026/server/src/routes/api";
import { sessionMiddleware } from "@web-speed-hackathon-2026/server/src/session";

import type { HonoEnv } from "./types";

const app = new Hono<HonoEnv>();

const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app });

app.use(compress());
app.use(sessionMiddleware);
app.route("/api/v1", createApiRouter(upgradeWebSocket));

export { injectWebSocket };
export default app;
