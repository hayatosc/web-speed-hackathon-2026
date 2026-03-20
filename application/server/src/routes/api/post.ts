import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { v4 as uuidv4 } from "uuid";

import { getDb, schema } from "@web-speed-hackathon-2026/server/src/db";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

// Helper to format post response to match Sequelize's defaultScope
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

async function fetchPostById(postId: string) {
  const db = getDb();
  const result = await db.query.posts.findFirst({
    where: eq(schema.posts.id, postId),
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
  });

  if (!result) return null;
  return formatPost(result);
}

router.get("/posts", async (c) => {
  const db = getDb();
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const limit = limitStr != null ? Number(limitStr) : undefined;
  const offset = offsetStr != null ? Number(offsetStr) : 0;

  const postsResult = await db.query.posts.findMany({
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
  });

  const posts = postsResult.map(formatPost);
  return c.json(posts);
});

router.get("/posts/:postId", async (c) => {
  const post = await fetchPostById(c.req.param("postId"));
  if (post === null) {
    throw new HTTPException(404);
  }
  return c.json(post);
});

router.get("/posts/:postId/comments", async (c) => {
  const db = getDb();
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const limit = limitStr != null ? Number(limitStr) : undefined;
  const offset = offsetStr != null ? Number(offsetStr) : 0;

  const commentsResult = await db.query.comments.findMany({
    where: eq(schema.comments.postId, c.req.param("postId")),
    with: {
      user: {
        with: {
          profileImage: true,
        },
      },
    },
    orderBy: (comments, { asc }) => [asc(comments.createdAt)],
    limit,
    offset,
  });

  // Format response to match Sequelize output
  const comments = commentsResult.map((comment) => {
    const { userId, postId, user, ...commentData } = comment;
    const { profileImageId, password, ...userData } = user;
    return {
      ...commentData,
      user: {
        ...userData,
        profileImage: user.profileImage,
      },
    };
  });

  return c.json(comments);
});

router.post("/posts", async (c) => {
  const db = getDb();
  const userId = c.get("session").userId;
  if (userId === undefined) {
    throw new HTTPException(401);
  }

  const body = await c.req.json();
  const postId = uuidv4();
  const now = new Date().toISOString();

  // Create post with optional movie and sound
  let movieId: string | null = null;
  let soundId: string | null = null;

  // Handle movie creation if provided
  const bodyMovieId =
    typeof body?.movie?.id === "string" && body.movie.id.length > 0 ? body.movie.id : undefined;
  if (bodyMovieId !== undefined) {
    movieId = bodyMovieId;
    const existingMovie = await db.query.movies.findFirst({
      where: eq(schema.movies.id, bodyMovieId),
    });
    if (!existingMovie) {
      await db.insert(schema.movies).values({ id: bodyMovieId });
    }
  }

  // Handle sound creation if provided
  const bodySoundId =
    typeof body?.sound?.id === "string" && body.sound.id.length > 0 ? body.sound.id : undefined;
  if (bodySoundId !== undefined) {
    soundId = bodySoundId;
    const existingSound = await db.query.sounds.findFirst({
      where: eq(schema.sounds.id, bodySoundId),
    });
    if (!existingSound) {
      await db.insert(schema.sounds).values({
        id: bodySoundId,
        title: body.sound.title ?? "Unknown",
        artist: body.sound.artist ?? "Unknown",
      });
    }
  }

  // Create post
  await db.insert(schema.posts).values({
    id: postId,
    userId,
    text: typeof body?.text === "string" ? body.text : "",
    movieId,
    soundId,
    createdAt: now,
  });

  // Handle images if provided
  if (body.images && Array.isArray(body.images)) {
    for (const img of body.images) {
      if (img?.id) {
        // Check if image exists, if not create it
        const existingImage = await db.query.images.findFirst({
          where: eq(schema.images.id, img.id),
        });
        if (!existingImage) {
          await db.insert(schema.images).values({
            id: img.id,
            alt: img.alt ?? "",
            createdAt: now,
          });
        }
        // Create relation
        await db.insert(schema.postsImagesRelations).values({
          postId,
          imageId: img.id,
        });
      }
    }
  }

  const post = await fetchPostById(postId);
  return c.json(post);
});

export { router as postRouter };
