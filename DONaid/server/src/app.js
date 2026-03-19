const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    exposedHeaders: ["X-Session-Id"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/chats", chatRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

module.exports = app;
