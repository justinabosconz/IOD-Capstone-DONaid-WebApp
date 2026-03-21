const express = require("express");
const path = require("path");

const { corsMiddleware } = require("./middleware/corsMiddleware");

const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemRoutes");
const chatRoutes = require("./routes//chatRoutes");

const app = express();

// JSON payload (increase limit for base64 images)
app.use(express.json({ limit: "8mb" }));
app.use(corsMiddleware);

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads")),
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/chat", chatRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

module.exports = { app };
