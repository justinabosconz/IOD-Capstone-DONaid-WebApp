const { Server } = require("socket.io");
const { getValidSession } = require("../services/sessionService");
const { Message } = require("../models");

function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN },
  });

  io.use(async (socket, next) => {
    try {
      const sessionId = socket.handshake.auth?.sessionId;
      const session = await getValidSession(sessionId);
      if (!session) return next(new Error("Unauthorized"));
      socket.userId = session.userId;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ chatId }) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, content }) => {
      if (!content || !content.trim()) return;

      const message = await Message.create({
        chatId,
        senderUserId: socket.userId,
        content: content.trim(),
      });

      io.to(`chat:${chatId}`).emit("newMessage", {
        id: message.id,
        chatId: message.chatId,
        senderUserId: message.senderUserId,
        content: message.content,
        createdAt: message.createdAt,
      });
    });
  });
}

module.exports = { initSockets };
