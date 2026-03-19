const { getValidSession } = require("../services/sessionService");
const { User } = require("../models");

module.exports = async function requireSession(req, res, next) {
  try {
    const sessionId = req.header("X-Session-Id");
    const session = await getValidSession(sessionId);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(session.userId, {
      attributes: ["id", "displayName", "email"],
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    req.sessionId = sessionId;
    next();
  } catch (err) {
    next(err);
  }
};
