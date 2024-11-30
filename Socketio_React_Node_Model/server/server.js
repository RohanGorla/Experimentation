import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server({
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("A connection has been made!");
});

server.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
