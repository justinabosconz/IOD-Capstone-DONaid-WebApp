const bcrypt = require("bcrypt");
const { User } = require("../models");
const { createSession, deleteSession } = require("../services/sessionService");

const SALT_ROUNDS = 10;

exports.register = async (req, res, next) => {
  try {
    const { displayName, email, password } = req.body;
    if (!displayName || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ displayName, email, passwordHash });

    const session = await createSession(user.id);
    res.status(201).json({
      user: { id: user.id, displayName: user.displayName, email: user.email },
      sessionId: session.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const session = await createSession(user.id);
    res.json({
      user: { id: user.id, displayName: user.displayName, email: user.email },
      sessionId: session.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const sessionId = req.header("X-Session-Id");
    await deleteSession(sessionId);
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
