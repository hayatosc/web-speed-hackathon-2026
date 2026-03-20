import { Hono } from "hono";
import { UniqueConstraintError, ValidationError } from "sequelize";

import { User } from "@web-speed-hackathon-2026/server/src/models";

import type { HonoEnv } from "../../types";

const router = new Hono<HonoEnv>();

router.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { id: userId } = await User.create(body);
    const user = await User.findByPk(userId);

    c.get("session").userId = userId;
    return c.json(user);
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return c.json({ code: "USERNAME_TAKEN" }, 400);
    }
    if (err instanceof ValidationError) {
      return c.json({ code: "INVALID_USERNAME" }, 400);
    }
    throw err;
  }
});

router.post("/signin", async (c) => {
  const body = await c.req.json();
  const user = await User.findOne({
    where: { username: body.username },
  });

  if (user === null) {
    return c.json({ message: "Bad Request" }, 400);
  }
  if (!user.validPassword(body.password)) {
    return c.json({ message: "Bad Request" }, 400);
  }

  c.get("session").userId = user.id;
  return c.json(user);
});

router.post("/signout", async (c) => {
  c.get("session").userId = undefined;
  return c.json({});
});

export { router as authRouter };
