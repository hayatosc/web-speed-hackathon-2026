import { and, desc, gte, inArray, like, lte, or } from "drizzle-orm";
import { Hono } from "hono";

import { getDb, schema } from "@web-speed-hackathon-2026/server/src/db";
import { parseSearchQuery } from "@web-speed-hackathon-2026/server/src/utils/parse_search_query.js";
import { analyzeSentiment } from "@web-speed-hackathon-2026/server/src/utils/analyze_sentiment.js";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

export type SearchResponse = {
  posts: ReturnType<typeof formatPost>[];
  sentiment: {
    score: number;
    label: "positive" | "negative" | "neutral";
  } | null;
};

// Helper to format post response
function formatPost(post: {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  movieId: string | null;
  soundId: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    description: string;
    password: string;
    profileImageId: string;
    createdAt: string;
    profileImage: { id: string; alt: string; width: number; height: number } | null;
  };
  movie: { id: string } | null;
  sound: { id: string; title: string; artist: string; durationMs: number; waveformPeaks: number[] } | null;
  postImages: Array<{
    postId: string;
    imageId: string;
    image: { id: string; alt: string; createdAt: string; width: number; height: number };
  }>;
}) {
  const { userId, movieId, soundId, postImages, user, ...postData } = post;
  const { profileImageId, password, ...userData } = user;

  // Sort images by createdAt
  const sortedImages = [...postImages]
    .sort((a, b) => new Date(a.image.createdAt).getTime() - new Date(b.image.createdAt).getTime())
    .map((pi) => pi.image);

  return {
    ...postData,
    user: {
      ...userData,
      profileImage: user.profileImage,
    },
    images: sortedImages,
    movie: post.movie ?? null,
    sound: post.sound ?? null,
  };
}

router.get("/search", async (c) => {
  const db = getDb();
  const query = c.req.query("q");

  if (typeof query !== "string" || query.trim() === "") {
    return c.json<SearchResponse>({
      posts: [],
      sentiment: null,
    });
  }

  const { keywords, sinceDate, untilDate } = parseSearchQuery(query);

  if (!keywords && !sinceDate && !untilDate) {
    return c.json<SearchResponse>({
      posts: [],
      sentiment: null,
    });
  }

  const searchTerm = keywords ? `%${keywords}%` : null;
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const limit = limitStr != null ? Number(limitStr) : 20;
  const offset = offsetStr != null ? Number(offsetStr) : 0;

  // Build date conditions
  const dateConditions: ReturnType<typeof and>[] = [];
  if (sinceDate) dateConditions.push(gte(schema.posts.createdAt, sinceDate.toISOString()));
  if (untilDate) dateConditions.push(lte(schema.posts.createdAt, untilDate.toISOString()));

  let searchCondition: ReturnType<typeof or> | ReturnType<typeof like> | undefined;
  if (searchTerm) {
    const matchingUsers = await db.query.users.findMany({
      where: or(like(schema.users.username, searchTerm), like(schema.users.name, searchTerm)),
      columns: { id: true },
    });
    const userIds = matchingUsers.map((user) => user.id);

    searchCondition =
      userIds.length > 0
        ? or(like(schema.posts.text, searchTerm), inArray(schema.posts.userId, userIds))
        : like(schema.posts.text, searchTerm);
  }

  const where =
    searchCondition != null && dateConditions.length > 0
      ? and(searchCondition, ...dateConditions)
      : searchCondition ?? (dateConditions.length === 1 ? dateConditions[0] : and(...dateConditions));

  const result = await db.query.posts.findMany({
    where,
    with: {
      user: {
        with: {
          profileImage: true,
        },
      },
      movie: true,
      sound: true,
      postImages: {
        with: {
          image: true,
        },
      },
    },
    orderBy: [desc(schema.posts.createdAt), desc(schema.posts.id)],
    limit,
    offset,
  });

  const posts = result.map(formatPost);
  const sentiment = keywords ? await analyzeSentiment(keywords) : null;

  return c.json<SearchResponse>({
    posts,
    sentiment,
  });
});

export { router as searchRouter };
