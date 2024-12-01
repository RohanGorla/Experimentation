import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json("connected");
});

io.on("connection", (socket) => {
  console.log("A connection has been made!");
  socket.on("message_input", (payload) => {
    console.log("Payload is: ", payload);
    io.emit("message_output", payload);
  });
});

server.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
