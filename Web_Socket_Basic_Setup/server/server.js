import express from "express";
import { createServer } from "node:http";
import "dotenv/config";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8008;

app.get("/", (req, res) => {
  res.send("<h1>Web Sockets</h1>");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
