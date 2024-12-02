import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const client = new MongoClient(process.env.DB_URL);
client
  .connect()
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

const db = client.db(process.env.DB_NAME);
const collection = db.collection("chatapptest");

app.get("/", async (req, res) => {
  res.json("connected...");
});

io.on("connection", async (socket) => {
  console.log("A connection has been made!");
  const result = await collection.find().toArray();
  io.emit("all_chat", result);
  socket.on("message_input", (payload) => {
    console.log("Payload is: ", payload);
    io.emit("message_output", payload);
  });
});

server.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
