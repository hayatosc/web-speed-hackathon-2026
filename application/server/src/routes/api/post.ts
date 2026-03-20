import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { Comment, Post } from "@web-speed-hackathon-2026/server/src/models";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

router.get("/posts", async (c) => {
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const posts = await Post.findAll({
    limit: limitStr != null ? Number(limitStr) : undefined,
    offset: offsetStr != null ? Number(offsetStr) : undefined,
  });
  return c.json(posts);
});

router.get("/posts/:postId", async (c) => {
  const post = await Post.findByPk(c.req.param("postId"));
  if (post === null) {
    throw new HTTPException(404);
  }
  return c.json(post);
});

router.get("/posts/:postId/comments", async (c) => {
  const limitStr = c.req.query("limit");
  const offsetStr = c.req.query("offset");
  const posts = await Comment.findAll({
    limit: limitStr != null ? Number(limitStr) : undefined,
    offset: offsetStr != null ? Number(offsetStr) : undefined,
    where: { postId: c.req.param("postId") },
  });
  return c.json(posts);
});

router.post("/posts", async (c) => {
  if (c.get("session").userId === undefined) {
    throw new HTTPException(401);
  }
  const body = await c.req.json();
  const post = await Post.create(
    { ...body, userId: c.get("session").userId },
    {
      include: [
        { association: "images", through: { attributes: [] } },
        { association: "movie" },
        { association: "sound" },
      ],
    },
  );
  return c.json(post);
});

export { router as postRouter };
