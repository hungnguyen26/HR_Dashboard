const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/database.js");
const EventEmitter = require("events");
const router = require("./routers/index.router.js");
const expressLayouts = require('express-ejs-layouts');

dotenv.config();

EventEmitter.defaultMaxListeners = 20;

const app = express();
const port = 3000;

const startServer = async () => {
  await connectDB(); 

  app.use(express.static("public"));
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(expressLayouts);
  app.set('layout', 'layouts/default');

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  router(app);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
