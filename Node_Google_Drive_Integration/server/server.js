import express from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 8008;
const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorizeUser() {
  const jwtClient = new google.auth.JWT(
    process.env.CE,
    null,
    process.env.PK,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFiles() {
  const auth = await authorizeUser();
  const drive = google.drive({ version: "v3", auth: auth });

  const fileMetaData = {
    name: "test_image.jpeg",
    parents: [process.env.ID],
  };

  const media = {
    body: fs.createReadStream("./affiliate_mobile_image.jpeg"),
    mimeType: "image/jpeg",
  };
  const response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: "id",
  });
  console.log(response.data.id);
  return response.data.id;
}

uploadFiles();

app.get("/", (req, res) => {
  res.json("Listening...");
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
