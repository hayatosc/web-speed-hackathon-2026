import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { col, Op, where } from "sequelize";

import { eventhub } from "@web-speed-hackathon-2026/server/src/eventhub";
import {
  DirectMessage,
  DirectMessageConversation,
  User,
} from "@web-speed-hackathon-2026/server/src/models";

import type { NodeWebSocket } from "@hono/node-ws";
import type { Context } from "hono";
import type { WSContext } from "hono/ws";
import type { HonoEnv } from "../../types";

type UpgradeWS = NodeWebSocket["upgradeWebSocket"];

export function createDirectMessageRouter(upgradeWebSocket: UpgradeWS) {
  const router = new Hono<HonoEnv>();

  router.get("/dm", async (c) => {
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversations = await DirectMessageConversation.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ initiatorId: userId }, { memberId: userId }],
          },
          where(col("messages.id"), { [Op.not]: null }),
        ],
      },
      order: [[col("messages.createdAt"), "DESC"]],
    });

    const sorted = conversations.map((conv) => ({
      ...conv.toJSON(),
      messages: conv.messages?.reverse(),
    }));

    return c.json(sorted);
  });

  router.post("/dm", async (c) => {
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const body = await c.req.json();
    const peer = await User.findByPk(body?.peerId);
    if (peer === null) {
      throw new HTTPException(404);
    }

    const [conversation] = await DirectMessageConversation.findOrCreate({
      where: {
        [Op.or]: [
          { initiatorId: userId, memberId: peer.id },
          { initiatorId: peer.id, memberId: userId },
        ],
      },
      defaults: {
        initiatorId: userId,
        memberId: peer.id,
      },
    });
    await conversation.reload();

    return c.json(conversation);
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

          const unreadCount = await DirectMessage.count({
            distinct: true,
            where: {
              senderId: { [Op.ne]: userId },
              isRead: false,
            },
            include: [
              {
                association: "conversation",
                where: {
                  [Op.or]: [{ initiatorId: userId }, { memberId: userId }],
                },
                required: true,
              },
            ],
          });

          eventhub.emit(`dm:unread/${userId}`, { unreadCount });
        },
      };
    }),
  );

  router.get("/dm/:conversationId", async (c) => {
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversation = await DirectMessageConversation.findOne({
      where: {
        id: c.req.param("conversationId"),
        [Op.or]: [{ initiatorId: userId }, { memberId: userId }],
      },
    });
    if (conversation === null) {
      throw new HTTPException(404);
    }

    return c.json(conversation);
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

          const conversation = await DirectMessageConversation.findOne({
            where: {
              id: conversationId,
              [Op.or]: [{ initiatorId: userId }, { memberId: userId }],
            },
          });
          if (conversation == null) {
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
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const body = await c.req.json();
    const bodyText: unknown = body?.body;
    if (typeof bodyText !== "string" || bodyText.trim().length === 0) {
      throw new HTTPException(400);
    }

    const conversation = await DirectMessageConversation.findOne({
      where: {
        id: c.req.param("conversationId"),
        [Op.or]: [{ initiatorId: userId }, { memberId: userId }],
      },
    });
    if (conversation === null) {
      throw new HTTPException(404);
    }

    const message = await DirectMessage.create({
      body: bodyText.trim(),
      conversationId: conversation.id,
      senderId: userId,
    });
    await message.reload();

    return c.json(message, 201);
  });

  router.post("/dm/:conversationId/read", async (c) => {
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversation = await DirectMessageConversation.findOne({
      where: {
        id: c.req.param("conversationId"),
        [Op.or]: [{ initiatorId: userId }, { memberId: userId }],
      },
    });
    if (conversation === null) {
      throw new HTTPException(404);
    }

    const peerId =
      conversation.initiatorId !== userId
        ? conversation.initiatorId
        : conversation.memberId;

    await DirectMessage.update(
      { isRead: true },
      {
        where: {
          conversationId: conversation.id,
          senderId: peerId,
          isRead: false,
        },
        individualHooks: true,
      },
    );

    return c.json({});
  });

  router.post("/dm/:conversationId/typing", async (c) => {
    const userId = c.get("session").userId;
    if (userId === undefined) {
      throw new HTTPException(401);
    }

    const conversation = await DirectMessageConversation.findByPk(
      c.req.param("conversationId"),
    );
    if (conversation === null) {
      throw new HTTPException(404);
    }

    eventhub.emit(`dm:conversation/${conversation.id}:typing/${userId}`, {});

    return c.json({});
  });

  return router;
}
