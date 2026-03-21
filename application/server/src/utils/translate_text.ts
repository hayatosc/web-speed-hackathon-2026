const TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const CACHE_LIMIT = 512;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  result: string;
};

const translationCache = new Map<string, CacheEntry>();

function getCacheKey(text: string, sourceLanguage: string, targetLanguage: string): string {
  return `${sourceLanguage}:${targetLanguage}:${text}`;
}

function getCachedTranslation(key: string): string | null {
  const cached = translationCache.get(key);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    translationCache.delete(key);
    return null;
  }

  translationCache.delete(key);
  translationCache.set(key, cached);
  return cached.result;
}

function setCachedTranslation(key: string, result: string): void {
  translationCache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    result,
  });

  if (translationCache.size <= CACHE_LIMIT) {
    return;
  }

  const oldestKey = translationCache.keys().next().value;
  if (oldestKey) {
    translationCache.delete(oldestKey);
  }
}

function extractTranslatedText(payload: unknown): string {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    throw new Error("Unexpected translation payload.");
  }

  const translated = payload[0]
    .map((part) => {
      if (!Array.isArray(part) || typeof part[0] !== "string") {
        return "";
      }

      return part[0];
    })
    .join("")
    .trim();

  if (!translated) {
    throw new Error("Translation result is empty.");
  }

  return translated;
}

export async function translateText(
  text: string,
  sourceLanguage: "ja",
  targetLanguage: "en",
): Promise<string> {
  const key = getCacheKey(text, sourceLanguage, targetLanguage);
  const cached = getCachedTranslation(key);
  if (cached) {
    return cached;
  }

  const url = new URL(TRANSLATE_ENDPOINT);
  url.search = new URLSearchParams({
    client: "gtx",
    sl: sourceLanguage,
    tl: targetLanguage,
    dt: "t",
    q: text,
  }).toString();

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Translation upstream returned ${response.status}.`);
  }

  const payload = (await response.json()) as unknown;
  const translated = extractTranslatedText(payload);
  setCachedTranslation(key, translated);
  return translated;
}
