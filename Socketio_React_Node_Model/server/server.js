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
  await collection.deleteMany({ name: 'Rohan' });
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
  const result = await collection.find().toArray();
  io.emit("all_chat", result);
  socket.on("message_input", async (payload) => {
    console.log("Payload is: ", payload);
    await collection.insertOne({ name: payload.name, msg: payload.message });
    io.emit("message_output", payload);
  });
});

/* SERVER CONNECTION */
server.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
