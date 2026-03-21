import { desc, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { randomUUID } from 'node:crypto';

import { getDb, schema } from '@web-speed-hackathon-2026/server/src/db';

import type { HonoEnv } from '../../types';

const router = new Hono<HonoEnv>();

interface PostImagePayload {
  id: string;
  alt?: string;
  height?: number;
  width?: number;
}

interface PostPayload {
  images?: unknown;
  movie?: {
    id?: unknown;
  };
  sound?: {
    id?: unknown;
    title?: unknown;
    artist?: unknown;
    durationMs?: unknown;
    waveformPeaks?: unknown;
  };
  text?: string;
}

function isPostImagePayload(value: unknown): value is PostImagePayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  if (typeof payload['id'] !== 'string' || payload['id'].length === 0) {
    return false;
  }

  if (payload['alt'] !== undefined && typeof payload['alt'] !== 'string') {
    return false;
  }
  if (payload['width'] !== undefined && !Number.isFinite(payload['width'])) {
    return false;
  }
  if (payload['height'] !== undefined && !Number.isFinite(payload['height'])) {
    return false;
  }

  return true;
}

function isWaveformPeaks(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((peak) => Number.isFinite(peak));
}

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

router.get('/posts', async (c) => {
  const db = getDb();
  const limitStr = c.req.query('limit');
  const offsetStr = c.req.query('offset');
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

router.get('/posts/:postId', async (c) => {
  const post = await fetchPostById(c.req.param('postId'));
  if (post === null) {
    throw new HTTPException(404);
  }
  return c.json(post);
});

router.get('/posts/:postId/comments', async (c) => {
  const db = getDb();
  const limitStr = c.req.query('limit');
  const offsetStr = c.req.query('offset');
  const limit = limitStr != null ? Number(limitStr) : undefined;
  const offset = offsetStr != null ? Number(offsetStr) : 0;

  const commentsResult = await db.query.comments.findMany({
    where: eq(schema.comments.postId, c.req.param('postId')),
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

router.post('/posts', async (c) => {
  const db = getDb();
  const userId = c.get('session').userId;
  if (userId === undefined) {
    throw new HTTPException(401);
  }

  const body = await c.req.json<PostPayload>();
  const postId = randomUUID();
  const now = new Date().toISOString();

  // Create post with optional movie and sound
  let movieId: string | null = null;
  let soundId: string | null = null;

  // better-sqlite3 transactions must stay synchronous; keep the write flow explicit here.
  const bodyMovieId = typeof body?.movie?.id === 'string' && body.movie.id.length > 0 ? body.movie.id : undefined;
  if (bodyMovieId !== undefined) {
    movieId = bodyMovieId;
    const existingMovie = await db.query.movies.findFirst({
      where: eq(schema.movies.id, bodyMovieId),
    });
    if (!existingMovie) {
      await db.insert(schema.movies).values({ id: bodyMovieId });
    }
  }

  const bodySoundId = typeof body?.sound?.id === 'string' && body.sound.id.length > 0 ? body.sound.id : undefined;
  const bodySoundTitle = typeof body?.sound?.title === 'string' ? body.sound.title : undefined;
  const bodySoundArtist = typeof body?.sound?.artist === 'string' ? body.sound.artist : undefined;
  const bodySoundDurationMs =
    typeof body?.sound?.durationMs === 'number' && Number.isFinite(body.sound.durationMs)
      ? Math.max(0, Math.round(body.sound.durationMs))
      : undefined;
  const bodySoundWaveformPeaks = isWaveformPeaks(body?.sound?.waveformPeaks)
    ? body.sound.waveformPeaks
    : undefined;
  if (bodySoundId !== undefined) {
    soundId = bodySoundId;
    const existingSound = await db.query.sounds.findFirst({
      where: eq(schema.sounds.id, bodySoundId),
    });
    if (!existingSound) {
      await db.insert(schema.sounds).values({
        id: bodySoundId,
        title: bodySoundTitle ?? 'Unknown',
        artist: bodySoundArtist ?? 'Unknown',
        durationMs: bodySoundDurationMs ?? 0,
        waveformPeaks: bodySoundWaveformPeaks ?? [],
      });
    }
  }

  await db.insert(schema.posts).values({
    id: postId,
    userId,
    text: body?.text ?? '',
    movieId,
    soundId,
    createdAt: now,
  });

  if (Array.isArray(body.images)) {
    const uniqueImages = Array.from(
      new Map(body.images.filter((img): img is PostImagePayload => isPostImagePayload(img)).map((img) => [img.id, img])).values(),
    );

    if (uniqueImages.length > 0) {
      const imageIds = uniqueImages.map((img) => img.id);
      const existingImages = await db.query.images.findMany({
        where: inArray(schema.images.id, imageIds),
        columns: { id: true },
      });
      const existingImageIds = new Set(existingImages.map((image) => image.id));

      const imagesToInsert = uniqueImages
        .filter((img) => !existingImageIds.has(img.id))
        .map((img) => ({
          id: img.id,
          alt: img.alt ?? '',
          createdAt: now,
          height:
            typeof img.height === 'number' && Number.isFinite(img.height)
              ? Math.max(1, Math.round(img.height))
              : 1,
          width:
            typeof img.width === 'number' && Number.isFinite(img.width)
              ? Math.max(1, Math.round(img.width))
              : 1,
        }));

      if (imagesToInsert.length > 0) {
        await db.insert(schema.images).values(imagesToInsert);
      }

      await db.insert(schema.postsImagesRelations).values(
        uniqueImages.map((img) => ({
          postId,
          imageId: img.id,
        })),
      );
    }
  }

  const post = await fetchPostById(postId);
  return c.json(post);
});

export { router as postRouter };
