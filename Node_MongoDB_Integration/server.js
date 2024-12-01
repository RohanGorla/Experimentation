import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();

const PORT = process.env.PORT;

const client = new MongoClient(process.env.DB_URL);
client
  .connect()
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));

const db = client.db(process.env.DB_NAME);
const collection = db.collection("test1");

app.get("/", async (req, res) => {
  const result = await collection.find().toArray();
  res.json(result);
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
