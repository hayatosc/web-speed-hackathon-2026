import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { DATABASE_PATH } from "@web-speed-hackathon-2026/server/src/paths";

import * as schema from "./schema";

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDB | null = null;
let _sqlite: Database.Database | null = null;

export function getDb(): DrizzleDB {
  if (_db === null) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return _db;
}

export async function initializeDatabase(): Promise<void> {
  // Close previous connection if exists
  if (_sqlite !== null) {
    _sqlite.close();
    _sqlite = null;
    _db = null;
  }

  // Create temp directory and copy database
  const tempDir = await fs.mkdtemp(path.resolve(os.tmpdir(), "./wsh-"));
  const tempPath = path.resolve(tempDir, "./database.sqlite");
  await fs.copyFile(DATABASE_PATH, tempPath);

  // Initialize better-sqlite3 and drizzle
  _sqlite = new Database(tempPath);
  _db = drizzle(_sqlite, { schema });
}

// For direct database access (e.g., in seed scripts)
export function createDirectDb(dbPath: string): DrizzleDB {
  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
}

export { schema };
