import { pathToFileURL } from "node:url";

import { serve } from "@hono/node-server";
import handle from "hono-react-router-adapter/node";

import { initializeDatabase } from "./db";
import app, { injectWebSocket } from "./app";
import { SERVER_BUILD_PATH } from "./paths";

await initializeDatabase();

const build = await import(pathToFileURL(SERVER_BUILD_PATH).href);
const handler = handle(build, app);

const port = Number(process.env["PORT"]) || 3000;
const server = serve({
  fetch: handler.fetch,
  port,
  hostname: "0.0.0.0",
});

injectWebSocket(server);

console.log(`Listening on 0.0.0.0:${port}`);
