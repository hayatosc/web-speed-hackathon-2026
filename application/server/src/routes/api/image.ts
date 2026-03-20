import { promises as fs } from "fs";
import path from "path";

import { fileTypeFromBuffer } from "file-type";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { v4 as uuidv4 } from "uuid";

import { UPLOAD_PATH } from "@web-speed-hackathon-2026/server/src/paths";

import type { HonoEnv } from "../../types";

const EXTENSION = "jpg";

const router = new Hono<HonoEnv>();

router.post("/images", async (c) => {
  if (c.get("session").userId === undefined) {
    throw new HTTPException(401);
  }

  const buffer = Buffer.from(await c.req.arrayBuffer());
  if (buffer.length === 0) {
    throw new HTTPException(400);
  }

  const type = await fileTypeFromBuffer(buffer);
  if (type === undefined || type.ext !== EXTENSION) {
    throw new HTTPException(400, { message: "Invalid file type" });
  }

  const imageId = uuidv4();
  const filePath = path.resolve(UPLOAD_PATH, `./images/${imageId}.${EXTENSION}`);
  await fs.mkdir(path.resolve(UPLOAD_PATH, "images"), { recursive: true });
  await fs.writeFile(filePath, buffer);

  return c.json({ id: imageId });
});

export { router as imageRouter };
