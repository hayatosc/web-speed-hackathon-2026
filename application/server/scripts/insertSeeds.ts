import * as fs from "node:fs/promises";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";

import { DATABASE_PATH } from "@web-speed-hackathon-2026/server/src/paths";
import { insertSeeds } from "@web-speed-hackathon-2026/server/src/seeds";
import * as schema from "@web-speed-hackathon-2026/server/src/db/schema";

await fs.rm(DATABASE_PATH, { force: true, recursive: true });
const sqlite = new Database(DATABASE_PATH);
const db = drizzle(sqlite, { schema });

// Create tables
db.run(sql`
  CREATE TABLE IF NOT EXISTS "ProfileImages" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "Users" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "profileImageId" TEXT NOT NULL DEFAULT '396fe4ce-aa36-4d96-b54e-6db40bae2eed' REFERENCES "ProfileImages"("id"),
    "createdAt" TEXT NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "Images" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "createdAt" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "Movies" (
    "id" TEXT PRIMARY KEY NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "Sounds" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Unknown',
    "artist" TEXT NOT NULL DEFAULT 'Unknown',
    "durationMs" INTEGER NOT NULL,
    "waveformPeaks" TEXT NOT NULL DEFAULT '[]'
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "Posts" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "Users"("id"),
    "movieId" TEXT REFERENCES "Movies"("id"),
    "soundId" TEXT REFERENCES "Sounds"("id"),
    "text" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "PostsImagesRelations" (
    "postId" TEXT NOT NULL REFERENCES "Posts"("id"),
    "imageId" TEXT NOT NULL REFERENCES "Images"("id"),
    PRIMARY KEY ("postId", "imageId")
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "Comments" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "Users"("id"),
    "postId" TEXT NOT NULL REFERENCES "Posts"("id"),
    "text" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "DirectMessageConversations" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "initiatorId" TEXT NOT NULL REFERENCES "Users"("id"),
    "memberId" TEXT NOT NULL REFERENCES "Users"("id")
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "DirectMessages" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "conversationId" TEXT NOT NULL REFERENCES "DirectMessageConversations"("id"),
    "senderId" TEXT NOT NULL REFERENCES "Users"("id"),
    "body" TEXT NOT NULL,
    "isRead" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS "qa_suggestions" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "question" TEXT NOT NULL
  )
`);

await insertSeeds(db);

sqlite.close();
