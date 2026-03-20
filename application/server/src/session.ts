import { randomUUID } from "node:crypto";

import { getCookie, setCookie } from "hono/cookie";

import type { Context, Next } from "hono";
import type { HonoEnv } from "./types";

type Session = { userId?: string };

const COOKIE_NAME = "sid";

export const sessionStore = new Map<string, Session>();

export async function sessionMiddleware(c: Context<HonoEnv>, next: Next): Promise<void> {
  let sessionId = getCookie(c, COOKIE_NAME);

  if (!sessionId || !sessionStore.has(sessionId)) {
    sessionId = randomUUID();
    sessionStore.set(sessionId, {});
    setCookie(c, COOKIE_NAME, sessionId, {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
    });
  }

  const session = sessionStore.get(sessionId)!;
  c.set("session", session);

  await next();
}
