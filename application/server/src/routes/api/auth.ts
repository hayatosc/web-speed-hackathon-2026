import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';

import { getDb, schema } from '@web-speed-hackathon-2026/server/src/db';
import { hashPassword, verifyPassword } from '@web-speed-hackathon-2026/server/src/password';

import type { HonoEnv } from '../../types';

const router = new Hono<HonoEnv>();

// Username validation regex
const USERNAME_REGEX = /^[a-z0-9_-]+$/i;

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

router.post('/signup', async (c) => {
  const db = getDb();
  const body = await c.req.json();

  // Validate username format
  if (typeof body.username !== 'string' || !USERNAME_REGEX.test(body.username)) {
    return c.json({ code: 'INVALID_USERNAME' }, 400);
  }

  // Check if username already exists
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.username, body.username),
  });

  if (existing) {
    return c.json({ code: 'USERNAME_TAKEN' }, 400);
  }

  const userId = randomUUID();
  const now = new Date().toISOString();

  await db.insert(schema.users).values({
    id: userId,
    username: body.username,
    name: body.name ?? '',
    description: body.description ?? '',
    password: await hashPassword(body.password),
    profileImageId: body.profileImageId ?? '396fe4ce-aa36-4d96-b54e-6db40bae2eed',
    createdAt: now,
  });

  const user = await getUserWithProfileImage(userId);
  c.get('session').userId = userId;
  return c.json(user);
});

router.post('/signin', async (c) => {
  const db = getDb();
  const body = await c.req.json();

  const user = await db.query.users.findFirst({
    where: eq(schema.users.username, body.username),
    with: {
      profileImage: true,
    },
  });

  if (user === undefined) {
    return c.json({ message: 'Bad Request' }, 400);
  }
  if (!await verifyPassword(body.password, user.password)) {
    return c.json({ message: 'Bad Request' }, 400);
  }

  c.get('session').userId = user.id;

  // Format response to match Sequelize output
  const { profileImageId, password, ...userData } = user;
  return c.json({
    ...userData,
    profileImage: user.profileImage,
  });
});

router.post('/signout', async (c) => {
  c.get('session').userId = undefined;
  return c.json({});
});

export { router as authRouter };
