import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

import type { DrizzleDB } from "@web-speed-hackathon-2026/server/src/db";
import { schema } from "@web-speed-hackathon-2026/server/src/db";
import { normalizeStoredPassword } from "@web-speed-hackathon-2026/server/src/password";
import type {
  CommentSeed,
  DirectMessageConversationSeed,
  DirectMessageSeed,
  ImageSeed,
  MovieSeed,
  PostSeed,
  PostsImagesRelationSeed,
  ProfileImageSeed,
  QaSuggestionSeed,
  SoundSeed,
  UserSeed,
} from "@web-speed-hackathon-2026/server/src/types/seed";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.resolve(__dirname, "../seeds");

const DEFAULT_BATCH_SIZE = 1000;

async function readJsonlFileBatched<T>(
  filename: string,
  callback: (batch: T[]) => Promise<void>,
  batchSize: number = DEFAULT_BATCH_SIZE,
): Promise<void> {
  const filePath = path.join(seedsDir, filename);

  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Seed file not found: ${filename}`);
  }

  const fileStream = createReadStream(filePath, { encoding: "utf8" });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let batch: T[] = [];
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    try {
      batch.push(JSON.parse(trimmedLine));

      if (batch.length >= batchSize) {
        await callback(batch);
        batch = [];
      }
    } catch {
      console.error(`Error parsing JSON in ${filename} at line ${lineNumber}`);
      throw new Error(`Invalid JSONL format in ${filename} at line ${lineNumber}`);
    }
  }

  if (batch.length > 0) {
    await callback(batch);
  }
}

export async function insertSeeds(db: DrizzleDB) {
  await readJsonlFileBatched<ProfileImageSeed>("profileImages.jsonl", async (batch) => {
    await db.insert(schema.profileImages).values(batch);
  });
  await readJsonlFileBatched<ImageSeed>("images.jsonl", async (batch) => {
    await db.insert(schema.images).values(batch);
  });
  await readJsonlFileBatched<MovieSeed>("movies.jsonl", async (batch) => {
    await db.insert(schema.movies).values(batch);
  });
  await readJsonlFileBatched<SoundSeed>("sounds.jsonl", async (batch) => {
    await db.insert(schema.sounds).values(batch);
  });
  await readJsonlFileBatched<UserSeed>("users.jsonl", async (batch) => {
    await db.insert(schema.users).values(
      batch.map((user) => ({
        ...user,
        password: normalizeStoredPassword(user.password),
      })),
    );
  });
  await readJsonlFileBatched<PostSeed>("posts.jsonl", async (batch) => {
    await db.insert(schema.posts).values(batch);
  });
  await readJsonlFileBatched<PostsImagesRelationSeed>(
    "postsImagesRelation.jsonl",
    async (batch) => {
      await db.insert(schema.postsImagesRelations).values(batch);
    },
  );
  await readJsonlFileBatched<CommentSeed>("comments.jsonl", async (batch) => {
    await db.insert(schema.comments).values(batch);
  });
  await readJsonlFileBatched<DirectMessageConversationSeed>(
    "directMessageConversations.jsonl",
    async (batch) => {
      await db.insert(schema.directMessageConversations).values(batch);
    },
  );
  await readJsonlFileBatched<DirectMessageSeed>("directMessages.jsonl", async (batch) => {
    await db.insert(schema.directMessages).values(batch);
  });
  await readJsonlFileBatched<QaSuggestionSeed>("qaSuggestions.jsonl", async (batch) => {
    await db.insert(schema.qaSuggestions).values(batch);
  });
}
