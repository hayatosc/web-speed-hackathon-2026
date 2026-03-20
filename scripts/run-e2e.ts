import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appUrl: string =
  process.argv[2] ??
  (() => {
    throw new Error("Usage: node --experimental-strip-types scripts/run-e2e.ts <app-url>");
  })();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cwd = path.join(root, "application", "e2e");

execSync("pnpm install --frozen-lockfile", { cwd, stdio: "inherit" });

if (process.env["CI"]) {
  execSync("pnpm exec playwright install chrome --with-deps", { cwd, stdio: "inherit" });
}

execSync("pnpm test:e2e", {
  cwd,
  env: {
    ...process.env,
    E2E_BASE_URL: appUrl,
    E2E_WORKERS: process.env["E2E_WORKERS"] ?? "1",
  },
  stdio: "inherit",
});
