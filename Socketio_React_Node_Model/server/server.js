import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";

const app = express();
const PORT = process.env.PORT || 3000;

/* SOCKET SERVER CREATION AND CONNECTION */
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* MONGODB CLIENT CREATION AND CONNECTION */
const client = new MongoClient(process.env.DB_URL);
client
  .connect()
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

const db = client.db(process.env.DB_NAME);
const collection = db.collection("chatapptest");

async function deleteRecords() {
  await collection.deleteMany({ name: "Rohan" });
}

// deleteRecords()

/* BASIC GET ROUTE */
app.get("/", async (req, res) => {
  res.json("connected...");
});

/* FOR POSTMAN TESTING */
app.get("/getallchat", async (req, res) => {
  const result = await collection.find().toArray();
  res.json(result);
});

/* SOCKET CONNECTION */
io.on("connection", async (socket) => {
  console.log("A connection has been made!");
  /* GET ALL CHATS DATA AND SEND IT TO CLIENT */
  const result = await collection.find().toArray();
  io.emit("all_chat", result);
  /* CATCH INPUT MESSAGE AND STORE THEM IN DB */
  socket.on("message_input", async (payload) => {
    console.log("Payload is: ", payload);
    await collection.insertOne({ name: payload.name, msg: payload.message });
    io.emit("message_output", payload);
  });
  /* JOIN A SPECIFIC ROOM IN SOCKET */
  socket.on("join room", (roomName) => {
    socket.join(roomName);
    console.log(`Joined room: ${roomName}`);
  });
  /* RECEIVE AND SEND MESSAGES TO A ROOM */
  socket.on("message_input_room", (payload) => {
    io.to(payload.room).emit("message_output_room", payload);
  });
});

/* SERVER CONNECTION */
server.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
