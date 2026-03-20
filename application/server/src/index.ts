import { serve } from "@hono/node-server";

import { initializeDatabase } from "./db";
import app, { injectWebSocket } from "./app";

await initializeDatabase();

const server = serve({
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
});

injectWebSocket(server);

console.log("Listening on 0.0.0.0:3000");
