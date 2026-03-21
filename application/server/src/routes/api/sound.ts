import { promises as fs } from 'fs';
import path from 'path';

import { fileTypeFromBuffer } from 'file-type';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { randomUUID } from 'node:crypto';

import { UPLOAD_PATH } from '@web-speed-hackathon-2026/server/src/paths';
import { extractSoundDetails } from '@web-speed-hackathon-2026/server/src/utils/media_metadata';

import type { HonoEnv } from '../../types';

const EXTENSION = 'mp3';

const router = new Hono<HonoEnv>();

router.post('/sounds', async (c) => {
  if (c.get('session').userId === undefined) {
    throw new HTTPException(401);
  }

  const buffer = Buffer.from(await c.req.arrayBuffer());
  if (buffer.length === 0) {
    throw new HTTPException(400);
  }

  const type = await fileTypeFromBuffer(buffer);
  if (type === undefined || type.ext !== EXTENSION) {
    throw new HTTPException(400, { message: 'Invalid file type' });
  }

  const soundId = randomUUID();
  const { artist, durationMs, title, waveformPeaks } = await extractSoundDetails(buffer);
  const filePath = path.resolve(UPLOAD_PATH, `./sounds/${soundId}.${EXTENSION}`);
  await fs.mkdir(path.resolve(UPLOAD_PATH, 'sounds'), { recursive: true });
  await fs.writeFile(filePath, buffer);

  return c.json({ artist, durationMs, id: soundId, title, waveformPeaks });
});

export { router as soundRouter };
