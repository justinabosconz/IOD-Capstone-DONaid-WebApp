require("dotenv").config();
const http = require("http");
const sequelize = require("./config/db");
const app = require("./app");

const { initSockets } = require("./sockets/socketHandler");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // dev-friendly; for capstone you can mention migrations as future improvement

    const server = http.createServer(app);
    initSockets(server);

    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
})();
