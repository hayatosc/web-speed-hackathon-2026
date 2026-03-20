import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

function stubPlugin(ids: string[]): Plugin {
  const stubSet = new Set(ids);
  return {
    name: "stub-missing-modules",
    resolveId(id) {
      if (stubSet.has(id)) return `\0stub:${id}`;
    },
    load(id) {
      if (id.startsWith("\0stub:")) return "export default {};";
    },
  };
}

export default defineConfig({
  build: {
    target: "node20",
  },
  plugins: [
    stubPlugin(["pg-hstore"]),
    build({
      entry: "./src/index.ts",
      outputDir: "dist",
    }),
    devServer({
      entry: "./src/index.ts",
    }),
  ],
});
