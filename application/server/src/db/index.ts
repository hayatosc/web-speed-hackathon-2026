import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { isBcryptHash, normalizeStoredPassword } from '@web-speed-hackathon-2026/server/src/password';
import { DATABASE_PATH } from '@web-speed-hackathon-2026/server/src/paths';

import * as schema from './schema';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDB | null = null;
let _sqlite: Database.Database | null = null;

function ensureIndexes(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS "idx_posts_user_id_id"
      ON "Posts" ("userId", "id");
    CREATE INDEX IF NOT EXISTS "idx_comments_post_id_created_at"
      ON "Comments" ("postId", "createdAt");
    CREATE INDEX IF NOT EXISTS "idx_direct_message_conversations_initiator_id"
      ON "DirectMessageConversations" ("initiatorId");
    CREATE INDEX IF NOT EXISTS "idx_direct_message_conversations_member_id"
      ON "DirectMessageConversations" ("memberId");
    CREATE INDEX IF NOT EXISTS "idx_direct_message_conversations_initiator_member"
      ON "DirectMessageConversations" ("initiatorId", "memberId");
    CREATE INDEX IF NOT EXISTS "idx_direct_message_conversations_member_initiator"
      ON "DirectMessageConversations" ("memberId", "initiatorId");
    CREATE INDEX IF NOT EXISTS "idx_direct_messages_conversation_created_at"
      ON "DirectMessages" ("conversationId", "createdAt");
    CREATE INDEX IF NOT EXISTS "idx_direct_messages_conversation_sender_is_read"
      ON "DirectMessages" ("conversationId", "senderId", "isRead");
    CREATE INDEX IF NOT EXISTS "idx_posts_created_at"
      ON "Posts" ("createdAt");
    CREATE INDEX IF NOT EXISTS "idx_posts_text"
      ON "Posts" ("text");
  `);
}

async function normalizeUserPasswords(sqlite: Database.Database): Promise<void> {
  const users = sqlite.prepare('SELECT id, password FROM Users').all() as Array<{ id: string; password: string }>;
  const usersToUpdate = users.filter((user) => !isBcryptHash(user.password));

  if (usersToUpdate.length === 0) {
    return;
  }

  const updates: Array<{ id: string; password: string }> = [];
  for (const user of usersToUpdate) {
    const newPassword = await normalizeStoredPassword(user.password);
    updates.push({ id: user.id, password: newPassword });
  }

  const updatePassword = sqlite.prepare('UPDATE "Users" SET "password" = ? WHERE "id" = ?');
  const transaction = sqlite.transaction((targetUsers: Array<{ id: string; password: string }>) => {
    for (const user of targetUsers) {
      updatePassword.run(user.password, user.id);
    }
  });

  transaction(updates);
}

export function getDb(): DrizzleDB {
  if (_db === null) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
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
  const tempDir = await fs.mkdtemp(path.resolve(os.tmpdir(), './wsh-'));
  const tempPath = path.resolve(tempDir, './database.sqlite');
  await fs.copyFile(DATABASE_PATH, tempPath);

  // Initialize better-sqlite3 and drizzle
  _sqlite = new Database(tempPath);
  _sqlite.pragma('journal_mode = WAL');
  ensureIndexes(_sqlite);
  await normalizeUserPasswords(_sqlite);
  _db = drizzle(_sqlite, { schema });
}

// For direct database access (e.g., in seed scripts)
export function createDirectDb(dbPath: string): DrizzleDB {
  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
}

export { schema };
