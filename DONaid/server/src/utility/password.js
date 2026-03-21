const crypto = require("crypto");

const ITERATIONS = 120000;
const KEYLEN = 64;
const DIGEST = "sha512";

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto
    .pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");
  return `pbkdf2$${DIGEST}$${ITERATIONS}$${salt}$${derived}`;
}

function verifyPassword(plain, stored) {
  const [algo, digest, itStr, salt, derived] = stored.split("$");
  if (algo !== "pbkdf2") return false;
  const iterations = Number(itStr);
  const check = crypto
    .pbkdf2Sync(plain, salt, iterations, KEYLEN, digest)
    .toString("hex");
  // timing-safe compare
  return crypto.timingSafeEqual(Buffer.from(check), Buffer.from(derived));
}

module.exports = { hashPassword, verifyPassword };
