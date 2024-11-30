import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import "dotenv/config";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8008;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
