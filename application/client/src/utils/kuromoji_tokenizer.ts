import kuromoji, { type IpadicFeatures, type Tokenizer } from "kuromoji";

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

export async function getKuromojiTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  tokenizerPromise ??= new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
    kuromoji.builder({ dicPath: "/dicts" }).build((err, tokenizer) => {
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
