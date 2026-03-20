import { http } from "./http";

export const chatApi = {
  createOrGet: ({ itemId, otherUserId }, sessionId) =>
    http("/chats", {
      method: "POST",
      body: { itemId, otherUserId },
      sessionId,
    }),

  listMine: (sessionId) => http("/chats", { sessionId }),

  getMessages: (chatId, sessionId) =>
    http(`/chats/${chatId}/messages`, { sessionId }),
};
