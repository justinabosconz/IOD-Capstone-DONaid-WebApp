const http = require("http");
require("dotenv").config();

const { Server } = require("socket.io");
const { app } = require("./app");

// Sequelize
const { sequelize, Session, User, ChatMessage } = require("./models");

const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

function isExpired(expiresAt) {
  return new Date(expiresAt).getTime() < Date.now();
}

async function start() {
  try {
    // Connecting database
    await sequelize.authenticate();
    console.log("✅ DB authenticated");

    // Syncing tables
    await sequelize.sync();
    console.log("✅ DB synced");

    // Creating server
    const server = http.createServer(app);

    // Attaching socket.io
    const io = new Server(server, {
      cors: {
        origin: CLIENT_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token;

        if (!token) return next(new Error("Missing token"));

        const session = await Session.findOne({
          where: { token },
          include: [{ model: User }],
        });

        if (!session) return next(new Error("Invalid token"));

        if (isExpired(session.expiresAt)) {
          await session.destroy().catch(() => {});
          return next(new Error("Session expired"));
        }

        socket.user = session.User;
        socket.sessionToken = token;

        return next();
      } catch (err) {
        return next(new Error("Socket auth error: " + err.message));
      }
    });

    io.on("connection", (socket) => {
      console.log(
        `🟢 Socket connected: ${socket.id} user=${socket.user?.email}`,
      );

      // Joining room for chat
      socket.on("joinItemRoom", ({ itemId }) => {
        if (!itemId) return;
        const room = `item:${itemId}`;
        socket.join(room);
        socket.emit("joinedRoom", { room });
      });

      // Leaving room
      socket.on("leaveItemRoom", ({ itemId }) => {
        if (!itemId) return;
        const room = `item:${itemId}`;
        socket.leave(room);
        socket.emit("leftRoom", { room });
      });

      // Broadcasting new message
      socket.on("sendMessage", async ({ itemId, body }) => {
        try {
          if (!itemId) return;
          if (!body || !String(body).trim()) return;

          const cleanBody = String(body).trim();

          const msg = await ChatMessage.create({
            itemId,
            fromUserId: socket.user.id,
            body: cleanBody,
          });

          // Broadcasting to all
          io.to(`item:${itemId}`).emit("newMessage", {
            id: msg.id,
            itemId: Number(itemId),
            body: msg.body,
            createdAt: msg.createdAt,
            fromUser: {
              id: socket.user.id,
              displayName: socket.user.displayName,
              email: socket.user.email,
            },
          });
        } catch (err) {
          // Emit error back
          socket.emit("messageError", { message: err.message });
        }
      });

      socket.on("disconnect", (reason) => {
        console.log(`🔴 Socket disconnected: ${socket.id} reason=${reason}`);
      });

      socket.on("error", (err) => {
        console.log(`⚠️ Socket error (${socket.id}):`, err.message || err);
      });
    });

    // listening
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Socket.IO enabled (origin: ${CLIENT_ORIGIN})`);
    });

    // shutdown
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down...`);
      try {
        await sequelize.close();
        console.log("✅ DB connection closed");
      } catch (e) {
        console.log("⚠️ Error closing DB:", e.message);
      }
      server.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });

      // Force exit
      setTimeout(() => process.exit(1), 5000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
