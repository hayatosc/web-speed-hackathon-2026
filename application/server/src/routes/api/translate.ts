import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { translateText } from "@web-speed-hackathon-2026/server/src/utils/translate_text.js";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

router.post("/translate", async (c) => {
  const body = await c.req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text || body?.sourceLanguage !== "ja" || body?.targetLanguage !== "en") {
    throw new HTTPException(400);
  }

  try {
    const result = await translateText(text, "ja", "en");
    return c.json({ result });
  } catch (error) {
    console.error(error);
    throw new HTTPException(502, { message: "Translation failed." });
  }
});

export { router as translateRouter };
