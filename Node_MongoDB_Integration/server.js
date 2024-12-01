import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();

const client = new MongoClient("mongodb://localhost:27017");
client
  .connect()
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err));
