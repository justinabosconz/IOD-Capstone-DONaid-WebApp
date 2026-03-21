function corsMiddleware(req, res, next) {
  const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
}

module.exports = { corsMiddleware };
