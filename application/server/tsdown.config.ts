import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "node20",
  outDir: "dist",
  platform: "node",
  alias: {
    "@web-speed-hackathon-2026/server": path.resolve("."),
  },
  plugins: [
    {
      name: "raw-loader",
      resolveId(id: string, importer?: string) {
        if (id.endsWith("?raw")) {
          const base = id.slice(0, -4);
          const resolved = importer
            ? path.resolve(path.dirname(importer), base)
            : path.resolve(base);
          return `\0raw:${resolved}`;
        }
      },
      load(id: string) {
        if (id.startsWith("\0raw:")) {
          const content = readFileSync(id.slice(5), "utf-8");
          return `export default ${JSON.stringify(content)}`;
        }
      },
    },
  ],
});
