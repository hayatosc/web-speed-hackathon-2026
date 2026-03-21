import { BM25 } from "bayesian-bm25";
import type { IpadicFeatures, Tokenizer } from "kuromoji";

const STOP_POS = new Set(["助詞", "助動詞", "記号"]);

export function extractTokens(tokens: IpadicFeatures[]): string[] {
  return tokens
    .filter((t) => t.surface_form !== "" && t.pos !== "" && !STOP_POS.has(t.pos))
    .map((t) => t.surface_form.toLowerCase());
}

let cachedBm25: BM25 | null = null;
let cachedCandidatesKey: string[] | null = null;

export function filterSuggestionsBM25(
  tokenizer: Tokenizer<IpadicFeatures>,
  candidates: string[],
  queryTokens: string[],
): string[] {
  if (queryTokens.length === 0) return [];

  // Rebuild the index only when the corpus changes
  if (cachedCandidatesKey !== candidates) {
    const bm25 = new BM25({ k1: 1.2, b: 0.75 });
    const tokenizedCandidates = candidates.map((c) => extractTokens(tokenizer.tokenize(c)));
    bm25.index(tokenizedCandidates);
    cachedBm25 = bm25;
    cachedCandidatesKey = candidates;
  }

  const scores = cachedBm25!.getScores(queryTokens);
  const results = candidates.map((text, index) => ({
    text,
    score: scores[index] ?? 0,
  }));

  return results
    .filter((result) => result.score > 0)
    .sort((left, right) => left.score - right.score)
    .slice(-10)
    .map((result) => result.text);
}
