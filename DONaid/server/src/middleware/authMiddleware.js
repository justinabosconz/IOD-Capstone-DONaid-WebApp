const { Session, User } = require("../models");

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;
    if (!token) return res.status(401).json({ message: "Missing auth token" });

    const session = await Session.findOne({ where: { token }, include: User });
    if (!session) return res.status(401).json({ message: "Invalid token" });

    if (new Date(session.expiresAt) < new Date()) {
      await session.destroy();
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = session.User;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ message: "Auth error", error: err.message });
  }
}

module.exports = { requireAuth };
