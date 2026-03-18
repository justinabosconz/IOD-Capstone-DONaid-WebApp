const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const app = express();
require("dotenv").config();
let dbConnect = require("./dbConnect");

// parse requests of content-type - application/json

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("./uploads", express.static(path.join(_dirname, "uploads")));

// routes

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my DONaid Application." });
});
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// setting port, listening for requests
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
