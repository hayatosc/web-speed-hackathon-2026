import { execFileSync, execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appUrl: string =
  process.argv[2] ??
  (() => {
    throw new Error("Usage: node --experimental-strip-types scripts/run-scoring.ts <app-url>");
  })();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cwd = path.join(root, "scoring-tool");

execSync("pnpm install --frozen-lockfile", { cwd, stdio: "inherit" });

// GITHUB_ACTIONS を除いた環境で実行（GitHubWriter は Issue 向けのため CLIWriter を使う）
// execFileSync で引数を配列渡しし、コマンドインジェクションを防ぐ
const { GITHUB_ACTIONS: _ignored, ...envWithoutGHActions } = process.env;
execFileSync("pnpm", ["start", "--applicationUrl", appUrl], {
  cwd,
  env: envWithoutGHActions,
  stdio: "inherit",
});
