import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { getDb, schema } from "@web-speed-hackathon-2026/server/src/db";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

// Helper to format user response with profileImage (matching Sequelize's defaultScope)
async function getUserWithProfileImage(userId: string) {
  const db = getDb();
  const result = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      profileImage: true,
    },
  });

  if (!result) return null;

  // Format response to match Sequelize output (exclude profileImageId, password never returned)
  const { profileImageId, password, ...userData } = result;
  return {
    ...userData,
    profileImage: result.profileImage,
  };
}

async function getUserByUsername(username: string) {
  const db = getDb();
  const result = await db.query.users.findFirst({
    where: eq(schema.users.username, username),
    with: {
      profileImage: true,
    },
  });

  if (!result) return null;

  const { profileImageId, password, ...userData } = result;
  return {
    ...userData,
    profileImage: result.profileImage,
  };
}

router.get("/me", async (c) => {
  const userId = c.get("session").userId;
  if (userId === undefined) {
    throw new HTTPException(401);
  }
  const user = await getUserWithProfileImage(userId);
  if (user === null) {
    throw new HTTPException(404);
  }
  return c.json(user);
});

router.put("/me", async (c) => {
  const db = getDb();
  const userId = c.get("session").userId;
  if (userId === undefined) {
    throw new HTTPException(401);
  }

  const existing = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });

  if (!existing) {
    throw new HTTPException(404);
  }

  const body = await c.req.json();

  // Update only provided fields
  const updateData: Partial<typeof schema.users.$inferInsert> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.profileImageId !== undefined) updateData.profileImageId = body.profileImageId;

  if (Object.keys(updateData).length > 0) {
    await db.update(schema.users).set(updateData).where(eq(schema.users.id, userId));
  }

  const user = await getUserWithProfileImage(userId);
  return c.json(user);
});

router.get("/users/:username", async (c) => {
  const user = await getUserByUsername(c.req.param("username"));
  if (user === null) {
    throw new HTTPException(404);
  }
  return c.json(user);
});

router.get("/users/:username/posts", async (c) => {
  const db = getDb();
  const userResult = await db.query.users.findFirst({
    where: eq(schema.users.username, c.req.param("username")),
  });
  if (!userResult) {
    throw new HTTPException(404);
  }

  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const limit = limitStr != null ? Number(limitStr) : 20;
  const offset = offsetStr != null ? Number(offsetStr) : 0;

  // Fetch posts with all relations matching Sequelize's defaultScope
  const postsResult = await db.query.posts.findMany({
    where: eq(schema.posts.userId, userResult.id),
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
        orderBy: (postImagesRelation, { asc }) => [asc(postImagesRelation.imageId)],
      },
    },
    orderBy: [desc(schema.posts.id)],
    limit,
    offset,
  });

  // Format response to match Sequelize output
  const posts = postsResult.map((post) => {
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
  });

  return c.json(posts);
});

export { router as userRouter };
