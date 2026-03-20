import { and, desc, gte, like, lte, or } from "drizzle-orm";
import { Hono } from "hono";

import { getDb, schema } from "@web-speed-hackathon-2026/server/src/db";
import { parseSearchQuery } from "@web-speed-hackathon-2026/server/src/utils/parse_search_query.js";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

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
    profileImage: { id: string; alt: string } | null;
  };
  movie: { id: string } | null;
  sound: { id: string; title: string; artist: string } | null;
  postImages: Array<{ postId: string; imageId: string; image: { id: string; alt: string; createdAt: string } }>;
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
    return c.json([]);
  }

  const { keywords, sinceDate, untilDate } = parseSearchQuery(query);

  if (!keywords && !sinceDate && !untilDate) {
    return c.json([]);
  }

  const searchTerm = keywords ? `%${keywords}%` : null;
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const limit = limitStr != null ? Number(limitStr) : undefined;
  const offset = offsetStr != null ? Number(offsetStr) : 0;

  // Build date conditions
  const dateConditions: ReturnType<typeof and>[] = [];
  if (sinceDate) dateConditions.push(gte(schema.posts.createdAt, sinceDate.toISOString()));
  if (untilDate) dateConditions.push(lte(schema.posts.createdAt, untilDate.toISOString()));

  // Search by text
  const textConditions = searchTerm
    ? [like(schema.posts.text, searchTerm), ...dateConditions]
    : dateConditions;

  const postsByText =
    textConditions.length > 0
      ? await db.query.posts.findMany({
          where: textConditions.length === 1 ? textConditions[0] : and(...textConditions),
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
          orderBy: [desc(schema.posts.id)],
          limit,
          offset,
        })
      : [];

  // Search by username/name
  let postsByUser: typeof postsByText = [];
  if (searchTerm) {
    // Get users matching the search term
    const matchingUsers = await db.query.users.findMany({
      where: or(like(schema.users.username, searchTerm), like(schema.users.name, searchTerm)),
      columns: { id: true },
    });

    const userIds = matchingUsers.map((u) => u.id);

    if (userIds.length > 0) {
      // Get posts from those users
      const userConditions = dateConditions.length > 0 ? and(...dateConditions) : undefined;

      const allUserPosts = await db.query.posts.findMany({
        where: userConditions,
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
        orderBy: [desc(schema.posts.id)],
      });

      postsByUser = allUserPosts.filter((post) => userIds.includes(post.userId));
      if (limit) {
        postsByUser = postsByUser.slice(offset, offset + limit);
      }
    }
  }

  // Merge and deduplicate results
  const postIdSet = new Set<string>();
  const mergedPosts: typeof postsByText = [];
  for (const post of [...postsByText, ...postsByUser]) {
    if (!postIdSet.has(post.id)) {
      postIdSet.add(post.id);
      mergedPosts.push(post);
    }
  }

  // Sort by createdAt descending
  mergedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  const result = mergedPosts.slice(offset || 0, (offset || 0) + (limit || mergedPosts.length));

  return c.json(result.map(formatPost));
});

export { router as searchRouter };
