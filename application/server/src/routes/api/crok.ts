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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get("/crok/suggestions", async (c) => {
  const q = c.req.query("q");

  if (!q || !q.trim()) {
    return c.json({ suggestions: [] });
  }

  const db = getDb();
  const rows = await db.select().from(schema.qaSuggestions);
  const candidates = rows.map((s) => s.question);

  const tokenizer = await getKuromojiTokenizer();
  const queryTokens = extractTokens(tokenizer.tokenize(q));
  const suggestions = filterSuggestionsBM25(tokenizer, candidates, queryTokens);

  return c.json({ suggestions });
});

router.get("/crok", async (c) => {
  if (c.get("session").userId === undefined) {
    throw new HTTPException(401);
  }

  return streamSSE(c, async (stream) => {
    let messageId = 0;

    // TTFT (Time to First Token)
    await sleep(3000);

    for (const char of response as string) {
      if (stream.aborted) break;

      await stream.writeSSE({
        data: JSON.stringify({ text: char, done: false }),
        event: "message",
        id: String(messageId++),
      });

      await sleep(10);
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
