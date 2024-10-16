import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 8008;

app.get("/", (req, res) => {
  res.json("Listening...");
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
