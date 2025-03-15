import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";
import { EventEmitter } from "events";

dotenv.config();

// Tăng giới hạn listeners để tránh cảnh báo
EventEmitter.defaultMaxListeners = 20;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Kết nối database
await connectDB();

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/admin", (req, res) => {
  res.send("Hello admin!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
