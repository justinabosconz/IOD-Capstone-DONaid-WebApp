const crypto = require("crypto");
const { User, Session } = require("../models");
const { hashPassword, verifyPassword } = require("../utility/password");

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function register(req, res) {
  try {
    const { email, displayName, password } = req.body;

    if (!email || !displayName || !password) {
      return res
        .status(400)
        .json({ message: "email, displayName, password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = hashPassword(password);
    const user = await User.create({ email, displayName, passwordHash });

    res
      .status(201)
      .json({ id: user.id, email: user.email, displayName: user.displayName });
  } catch (err) {
    res.status(500).json({ message: "Register failed", error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = makeToken();
    const days = Number(process.env.SESSION_DAYS || 7);
    const expiresAt = addDays(new Date(), days);

    await Session.create({ token, userId: user.id, expiresAt });

    res.json({
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
      expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

async function me(req, res) {
  res.json({
    id: req.user.id,
    email: req.user.email,
    displayName: req.user.displayName,
  });
}

async function logout(req, res) {
  try {
    await Session.destroy({ where: { token: req.token } });
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
}

module.exports = { register, login, me, logout };
