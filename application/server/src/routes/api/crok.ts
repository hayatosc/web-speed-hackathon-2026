import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { streamSSE } from "hono/streaming";

import { getDb, schema } from "@web-speed-hackathon-2026/server/src/db";
import { extractTokens, filterSuggestionsBM25 } from "@web-speed-hackathon-2026/server/src/utils/bm25_search.js";
import { getKuromojiTokenizer } from "@web-speed-hackathon-2026/server/src/utils/kuromoji_tokenizer.js";

import type { HonoEnv } from "../../types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import response from "./crok-response.md?raw";

const router = new Hono<HonoEnv>();

const INITIAL_TTFT_MS = 300;
const RESPONSE_CHUNK_SIZE = 64;
const STREAM_CHUNK_DELAY_MS = 4;
let cachedSuggestions: string[] | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function splitIntoChunks(value: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += chunkSize) {
    chunks.push(value.slice(i, i + chunkSize));
  }
  return chunks;
}

router.get("/crok/suggestions", async (c) => {
  const q = c.req.query("q");

  if (!q || !q.trim()) {
    return c.json({ suggestions: [] });
  }

  if (cachedSuggestions === null) {
    const db = getDb();
    const rows = await db.select().from(schema.qaSuggestions);
    cachedSuggestions = rows.map((s) => s.question);
  }

  const tokenizer = await getKuromojiTokenizer();
  const queryTokens = extractTokens(tokenizer.tokenize(q));
  const suggestions = filterSuggestionsBM25(tokenizer, cachedSuggestions, queryTokens);

  return c.json({ suggestions });
});

router.get("/crok", async (c) => {
  if (c.get("session").userId === undefined) {
    throw new HTTPException(401);
  }

  return streamSSE(c, async (stream) => {
    let messageId = 0;
    await sleep(INITIAL_TTFT_MS);

    for (const chunk of splitIntoChunks(response as string, RESPONSE_CHUNK_SIZE)) {
      if (stream.aborted) break;

      await stream.writeSSE({
        data: JSON.stringify({ text: chunk, done: false }),
        event: "message",
        id: String(messageId++),
      });

      await sleep(STREAM_CHUNK_DELAY_MS);
    }

    if (!stream.aborted) {
      await stream.writeSSE({
        data: JSON.stringify({ text: "", done: true }),
        event: "message",
        id: String(messageId),
      });
    }
  });
});

export { router as crokRouter };
