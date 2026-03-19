const { Session } = require("../models");

function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function createSession(userId) {
  const ttl = Number(process.env.SESSION_TTL_HOURS || 24);
  return Session.create({ userId, expiresAt: hoursFromNow(ttl) });
}

async function getValidSession(sessionId) {
  if (!sessionId) return null;
  const session = await Session.findByPk(sessionId);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  return session;
}

async function deleteSession(sessionId) {
  if (!sessionId) return;
  await Session.destroy({ where: { id: sessionId } });
}

module.exports = { createSession, getValidSession, deleteSession };
