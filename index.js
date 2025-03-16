const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/database.js");
const EventEmitter = require("events");

dotenv.config();

EventEmitter.defaultMaxListeners = 20;

const app = express();
const port = 3000;

const startServer = async () => {
  await connectDB(); 

  app.use(express.static("public"));
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
