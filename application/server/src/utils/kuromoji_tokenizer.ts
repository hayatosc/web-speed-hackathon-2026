import path from "node:path";

import kuromoji, { type IpadicFeatures, type Tokenizer } from "kuromoji";

import { PUBLIC_PATH } from "@web-speed-hackathon-2026/server/src/paths";

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

export async function getKuromojiTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  tokenizerPromise ??= new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
    kuromoji.builder({ dicPath: path.resolve(PUBLIC_PATH, "dicts") }).build((err, tokenizer) => {
      if (err) {
        tokenizerPromise = null;
        reject(err);
        return;
      }

      if (!tokenizer) {
        tokenizerPromise = null;
        reject(new Error("Failed to initialize the tokenizer."));
        return;
      }

      resolve(tokenizer);
    });
  });

  return await tokenizerPromise;
}
