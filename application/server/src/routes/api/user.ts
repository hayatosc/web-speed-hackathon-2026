import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { Post, User } from "@web-speed-hackathon-2026/server/src/models";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

router.get("/me", async (c) => {
  if (c.get("session").userId === undefined) {
    throw new HTTPException(401);
  }
  const user = await User.findByPk(c.get("session").userId);
  if (user === null) {
    throw new HTTPException(404);
  }
  return c.json(user);
});

router.put("/me", async (c) => {
  if (c.get("session").userId === undefined) {
    throw new HTTPException(401);
  }
  const user = await User.findByPk(c.get("session").userId);
  if (user === null) {
    throw new HTTPException(404);
  }
  const body = await c.req.json();
  Object.assign(user, body);
  await user.save();
  return c.json(user);
});

router.get("/users/:username", async (c) => {
  const user = await User.findOne({
    where: { username: c.req.param("username") },
  });
  if (user === null) {
    throw new HTTPException(404);
  }
  return c.json(user);
});

router.get("/users/:username/posts", async (c) => {
  const user = await User.findOne({
    where: { username: c.req.param("username") },
  });
  if (user === null) {
    throw new HTTPException(404);
  }
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const posts = await Post.findAll({
    limit: limitStr != null ? Number(limitStr) : undefined,
    offset: offsetStr != null ? Number(offsetStr) : undefined,
    where: { userId: user.id },
  });
  return c.json(posts);
});

export { router as userRouter };
