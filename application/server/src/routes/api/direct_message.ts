import { and, count, eq, ne, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { v4 as uuidv4 } from "uuid";

import { getDb, schema } from "@web-speed-hackathon-2026/server/src/db";
import { eventhub } from "@web-speed-hackathon-2026/server/src/eventhub";

import type { NodeWebSocket } from "@hono/node-ws";
import type { Context } from "hono";
import type { WSContext } from "hono/ws";
import type { HonoEnv } from "../../types";

type UpgradeWS = NodeWebSocket["upgradeWebSocket"];

// Helper to format user for response
function formatUser(user: {
  id: string;
  username: string;
  name: string;
  description: string;
  password: string;
  profileImageId: string;
  createdAt: string;
  profileImage: { id: string; alt: string } | null;
}) {
  const { profileImageId, password, ...userData } = user;
  return {
    ...userData,
    profileImage: user.profileImage,
  };
}

// Helper to format direct message for response
function formatDirectMessage(message: {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    username: string;
    name: string;
    description: string;
    password: string;
    profileImageId: string;
    createdAt: string;
    profileImage: { id: string; alt: string } | null;
  };
}) {
  const { senderId, conversationId, sender, ...msgData } = message;
  return {
    ...msgData,
    sender: formatUser(sender),
  };
}

// Helper to format conversation for response
function formatConversation(conv: {
  id: string;
  initiatorId: string;
  memberId: string;
  initiator: {
    id: string;
    username: string;
    name: string;
    description: string;
    password: string;
    profileImageId: string;
    createdAt: string;
    profileImage: { id: string; alt: string } | null;
  };
  member: {
    id: string;
    username: string;
    name: string;
    description: string;
    password: string;
    profileImageId: string;
    createdAt: string;
    profileImage: { id: string; alt: string } | null;
  };
  messages: Array<{
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    sender: {
      id: string;
      username: string;
      name: string;
      description: string;
      password: string;
      profileImageId: string;
      createdAt: string;
      profileImage: { id: string; alt: string } | null;
    };
  }>;
}) {
  return {
    id: conv.id,
    initiator: formatUser(conv.initiator),
    member: formatUser(conv.member),
    messages: conv.messages.map(formatDirectMessage),
  };
}

function formatConversationSummary(conv: {
  id: string;
  initiator: {
    id: string;
    username: string;
    name: string;
    description: string;
    password: string;
    profileImageId: string;
    createdAt: string;
    profileImage: { id: string; alt: string } | null;
  };
  member: {
    id: string;
    username: string;
    name: string;
    description: string;
    password: string;
    profileImageId: string;
    createdAt: string;
    profileImage: { id: string; alt: string } | null;
  };
  lastMessage: {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    sender: {
      id: string;
      username: string;
      name: string;
      description: string;
      password: string;
      profileImageId: string;
      createdAt: string;
      profileImage: { id: string; alt: string } | null;
    };
  };
  hasUnread: boolean;
}) {
  return {
    id: conv.id,
    initiator: formatUser(conv.initiator),
    member: formatUser(conv.member),
    lastMessage: formatDirectMessage(conv.lastMessage),
    hasUnread: conv.hasUnread,
  };
}

async function getUnreadCount(userId: string): Promise<number> {
  const db = getDb();

  // Get all conversation IDs where the user is a participant
  const userConversations = await db.query.directMessageConversations.findMany({
    where: or(
      eq(schema.directMessageConversations.initiatorId, userId),
      eq(schema.directMessageConversations.memberId, userId),
    ),
    columns: { id: true },
  });

  const conversationIds = userConversations.map((c) => c.id);

  if (conversationIds.length === 0) return 0;

  // Count unread messages not sent by the user in those conversations
  const result = await db
    .select({ count: count() })
    .from(schema.directMessages)
    .where(
      and(
        sql`${schema.directMessages.conversationId} IN (${sql.join(
          conversationIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
        ne(schema.directMessages.senderId, userId),
        eq(schema.directMessages.isRead, false),
      ),
    );

  return result[0]?.count ?? 0;
}

async function emitDmEvents(messageId: string) {
  const db = getDb();

  const directMessage = await db.query.directMessages.findFirst({
    where: eq(schema.directMessages.id, messageId),
    with: {
      sender: {
        with: {
          profileImage: true,
        },
      },
    },
  });

  if (!directMessage) return;

  const conversation = await db.query.directMessageConversations.findFirst({
    where: eq(schema.directMessageConversations.id, directMessage.conversationId),
  });

  if (!conversation) return;

  const receiverId =
    conversation.initiatorId === directMessage.senderId
      ? conversation.memberId
      : conversation.initiatorId;

  const unreadCount = await getUnreadCount(receiverId);

  eventhub.emit(`dm:conversation/${conversation.id}:message`, formatDirectMessage(directMessage));
  eventhub.emit(`dm:unread/${receiverId}`, { unreadCount });
}

export function createDirectMessageRouter(upgradeWebSocket: UpgradeWS) {
  const router = new Hono<HonoEnv>();

  router.get("/dm", async (c) => {
    const db = getDb();
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    // Get conversations where user is participant and has messages
    const conversations = await db.query.directMessageConversations.findMany({
      where: or(
        eq(schema.directMessageConversations.initiatorId, userId),
        eq(schema.directMessageConversations.memberId, userId),
      ),
      with: {
        initiator: {
          with: {
            profileImage: true,
          },
        },
        member: {
          with: {
            profileImage: true,
          },
        },
      },
    });

    const summaries = await Promise.all(
      conversations.map(async (conversation) => {
        const peerId =
          conversation.initiatorId !== userId
            ? conversation.initiatorId
            : conversation.memberId;

        const [lastMessage, unreadMessage] = await Promise.all([
          db.query.directMessages.findFirst({
            where: eq(schema.directMessages.conversationId, conversation.id),
            with: {
              sender: {
                with: {
                  profileImage: true,
                },
              },
            },
            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
          }),
          db.query.directMessages.findFirst({
            where: and(
              eq(schema.directMessages.conversationId, conversation.id),
              eq(schema.directMessages.senderId, peerId),
              eq(schema.directMessages.isRead, false),
            ),
            columns: { id: true },
          }),
        ]);

        if (lastMessage === undefined) {
          return null;
        }

        return formatConversationSummary({
          id: conversation.id,
          initiator: conversation.initiator,
          member: conversation.member,
          lastMessage,
          hasUnread: unreadMessage !== undefined,
        });
      }),
    );

    const result = summaries
      .filter((summary): summary is NonNullable<typeof summary> => summary !== null)
      .sort((a, b) => b.lastMessage.createdAt.localeCompare(a.lastMessage.createdAt));

    return c.json(result);
  });

  router.post("/dm", async (c) => {
    const db = getDb();
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const body = await c.req.json();
    const peerId = body?.peerId;

    const peer = await db.query.users.findFirst({
      where: eq(schema.users.id, peerId),
    });
    if (!peer) {
      throw new HTTPException(404);
    }

    // FindOrCreate semantics with conflict-safe logic
    let conversation = await db.query.directMessageConversations.findFirst({
      where: or(
        and(
          eq(schema.directMessageConversations.initiatorId, userId),
          eq(schema.directMessageConversations.memberId, peerId),
        ),
        and(
          eq(schema.directMessageConversations.initiatorId, peerId),
          eq(schema.directMessageConversations.memberId, userId),
        ),
      ),
      with: {
        initiator: {
          with: {
            profileImage: true,
          },
        },
        member: {
          with: {
            profileImage: true,
          },
        },
        messages: {
          with: {
            sender: {
              with: {
                profileImage: true,
              },
            },
          },
          orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        },
      },
    });

    if (!conversation) {
      const conversationId = uuidv4();
      await db.insert(schema.directMessageConversations).values({
        id: conversationId,
        initiatorId: userId,
        memberId: peerId,
      });

      conversation = await db.query.directMessageConversations.findFirst({
        where: eq(schema.directMessageConversations.id, conversationId),
        with: {
          initiator: {
            with: {
              profileImage: true,
            },
          },
          member: {
            with: {
              profileImage: true,
            },
          },
          messages: {
            with: {
              sender: {
                with: {
                  profileImage: true,
                },
              },
            },
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
      });
    }

    if (conversation === undefined) {
      throw new HTTPException(500);
    }
    return c.json(formatConversation(conversation));
  });

  router.get(
    "/dm/unread",
    upgradeWebSocket((c: Context<HonoEnv>) => {
      const userId = c.get("session").userId;

      return {
        async onOpen(_evt: Event, ws: WSContext<unknown>) {
          if (!userId) {
            ws.close();
            return;
          }

          const handler = (payload: unknown) => {
            ws.send(JSON.stringify({ type: "dm:unread", payload }));
          };

          eventhub.on(`dm:unread/${userId}`, handler);

          (ws.raw as { on?: (event: string, handler: () => void) => void } | undefined)?.on?.("close", () => {
            eventhub.off(`dm:unread/${userId}`, handler);
          });

          const unreadCount = await getUnreadCount(userId);

          eventhub.emit(`dm:unread/${userId}`, { unreadCount });
        },
      };
    }),
  );

  router.get("/dm/:conversationId", async (c) => {
    const db = getDb();
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversationId = c.req.param("conversationId");

    const conversation = await db.query.directMessageConversations.findFirst({
      where: and(
        eq(schema.directMessageConversations.id, conversationId),
        or(
          eq(schema.directMessageConversations.initiatorId, userId),
          eq(schema.directMessageConversations.memberId, userId),
        ),
      ),
      with: {
        initiator: {
          with: {
            profileImage: true,
          },
        },
        member: {
          with: {
            profileImage: true,
          },
        },
        messages: {
          with: {
            sender: {
              with: {
                profileImage: true,
              },
            },
          },
          orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        },
      },
    });

    if (!conversation) {
      throw new HTTPException(404);
    }

    return c.json(formatConversation(conversation));
  });

  router.get(
    "/dm/:conversationId/ws",
    upgradeWebSocket((c: Context<HonoEnv>) => {
      const userId = c.get("session").userId;
      const conversationId = c.req.param("conversationId");

      return {
        async onOpen(_evt: Event, ws: WSContext<unknown>) {
          if (!userId) {
            ws.close();
            return;
          }

          const db = getDb();
          const conversation = await db.query.directMessageConversations.findFirst({
            where: and(
              eq(schema.directMessageConversations.id, conversationId),
              or(
                eq(schema.directMessageConversations.initiatorId, userId),
                eq(schema.directMessageConversations.memberId, userId),
              ),
            ),
          });

          if (!conversation) {
            ws.close();
            return;
          }

          const peerId =
            conversation.initiatorId !== userId
              ? conversation.initiatorId
              : conversation.memberId;

          const handleMessageUpdated = (payload: unknown) => {
            ws.send(JSON.stringify({ type: "dm:conversation:message", payload }));
          };
          eventhub.on(`dm:conversation/${conversation.id}:message`, handleMessageUpdated);

          const handleTyping = (payload: unknown) => {
            ws.send(JSON.stringify({ type: "dm:conversation:typing", payload }));
          };
          eventhub.on(`dm:conversation/${conversation.id}:typing/${peerId}`, handleTyping);

          (ws.raw as { on?: (event: string, handler: () => void) => void } | undefined)?.on?.("close", () => {
            eventhub.off(
              `dm:conversation/${conversation.id}:message`,
              handleMessageUpdated,
            );
            eventhub.off(
              `dm:conversation/${conversation.id}:typing/${peerId}`,
              handleTyping,
            );
          });
        },
      };
    }),
  );

  router.post("/dm/:conversationId/messages", async (c) => {
    const db = getDb();
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const body = await c.req.json();
    const bodyText: unknown = body?.body;
    if (typeof bodyText !== "string" || bodyText.trim().length === 0) {
      throw new HTTPException(400);
    }

    const conversationId = c.req.param("conversationId");

    const conversation = await db.query.directMessageConversations.findFirst({
      where: and(
        eq(schema.directMessageConversations.id, conversationId),
        or(
          eq(schema.directMessageConversations.initiatorId, userId),
          eq(schema.directMessageConversations.memberId, userId),
        ),
      ),
    });

    if (!conversation) {
      throw new HTTPException(404);
    }

    const messageId = uuidv4();
    const now = new Date().toISOString();

    await db.insert(schema.directMessages).values({
      id: messageId,
      body: bodyText.trim(),
      conversationId: conversation.id,
      senderId: userId,
      isRead: false,
      createdAt: now,
      updatedAt: now,
    });

    // Emit events after message creation (replaces Sequelize hook)
    await emitDmEvents(messageId);

    const message = await db.query.directMessages.findFirst({
      where: eq(schema.directMessages.id, messageId),
      with: {
        sender: {
          with: {
            profileImage: true,
          },
        },
      },
    });

    if (message === undefined) {
      throw new HTTPException(500);
    }
    return c.json(formatDirectMessage(message), 201);
  });

  router.post("/dm/:conversationId/read", async (c) => {
    const db = getDb();
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversationId = c.req.param("conversationId");

    const conversation = await db.query.directMessageConversations.findFirst({
      where: and(
        eq(schema.directMessageConversations.id, conversationId),
        or(
          eq(schema.directMessageConversations.initiatorId, userId),
          eq(schema.directMessageConversations.memberId, userId),
        ),
      ),
    });

    if (!conversation) {
      throw new HTTPException(404);
    }

    const peerId =
      conversation.initiatorId !== userId
        ? conversation.initiatorId
        : conversation.memberId;

    // Get IDs of messages to update
    const messagesToUpdate = await db.query.directMessages.findMany({
      where: and(
        eq(schema.directMessages.conversationId, conversation.id),
        eq(schema.directMessages.senderId, peerId),
        eq(schema.directMessages.isRead, false),
      ),
      columns: { id: true },
    });

    const now = new Date().toISOString();

    // Update messages
    await db
      .update(schema.directMessages)
      .set({ isRead: true, updatedAt: now })
      .where(
        and(
          eq(schema.directMessages.conversationId, conversation.id),
          eq(schema.directMessages.senderId, peerId),
          eq(schema.directMessages.isRead, false),
        ),
      );

    // Emit events for each updated message (replaces Sequelize individualHooks)
    for (const msg of messagesToUpdate) {
      await emitDmEvents(msg.id);
    }

    return c.json({});
  });

  router.post("/dm/:conversationId/typing", async (c) => {
    const db = getDb();
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversation = await db.query.directMessageConversations.findFirst({
      where: eq(schema.directMessageConversations.id, c.req.param("conversationId")),
    });

    if (!conversation) {
      throw new HTTPException(404);
    }

    eventhub.emit(`dm:conversation/${conversation.id}:typing/${userId}`, {});

    return c.json({});
  });

  return router;
}
