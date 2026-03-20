import { serve } from "@hono/node-server";

import { initializeDatabase } from "./db";
import app, { injectWebSocket } from "./app";

await initializeDatabase();

const port = Number(process.env["PORT"]) || 3000;

const server = serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

injectWebSocket(server);

console.log(`Listening on 0.0.0.0:${port}`);
