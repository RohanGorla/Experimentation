import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs";
import multer from "multer";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());

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

async function uploadFiles(file, imageName, mimetype) {
  const auth = await authorizeUser();
  const drive = google.drive({ version: "v3", auth: auth });

  //   const getResponse = await drive.files.list({});
  //   console.log("Get response -> ", getResponse.data);

  //   getResponse.data.files.map(async (file) => {
  //     if (file.mimeType.split("/")[0] == "image") {
  //       await drive.files.delete({
  //         fileId: file.id,
  //       });
  //     }
  //   });

  //   const response = await drive.files.list({});
  //   if (response.data.files.length) {
  //     console.log(response.data.files.length);
  //     response.data.files.map(async (file) => {
  //       console.log(file);
  //       const response = await drive.files.delete({});
  //     });
  //   }

  console.log("data -> ", file, imageName, mimetype);

  const fileMetaData = {
    name: imageName,
    parents: [process.env.ID],
  };

  const media = {
    body: fs.createReadStream(`./uploads/${file}`),
    mimeType: mimetype,
  };
  const response = await drive.files.create({
    resource: fileMetaData,
    media: media,
    fields: "id",
  });
  return response.data.id;
}

// uploadFiles();

app.get("/", (req, res) => {
  res.json("Listening...");
});

app.get("/getphotos", async (req, res) => {
  const auth = await authorizeUser();
  const drive = google.drive({ version: "v3", auth: auth });
  const getResponse = await drive.files.list({});
  let urls = [];
  for (let i = 0; i < getResponse.data.files.length; i++) {
    if (getResponse.data.files[i].mimeType.split("/")[0] == "image") {
      drive.permissions.create({
        fileId: getResponse.data.files[i].id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const result = await drive.files.get({
        fileId: getResponse.data.files[i].id,
        fields: "webViewLink, webContentLink",
      });
      let data = {
        view: result.data.webViewLink,
        download: result.data.webContentLink,
        id: getResponse.data.files[i].id,
      };
      urls.push(data);
    }
  }
  res.send(urls);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const name = req.headers.name;
    const path = `uploads/${name}`;
    if (fs.existsSync(path)) {
      cb(null, path);
    } else {
      fs.mkdirSync(path);
      cb(null, path);
    }
  },
  filename: function (req, file, callback) {
    const extension = file.originalname.split(".")[1];
    const fileName = file.originalname.split(".")[0];
    callback(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const upload = multer({ storage: storage });

app.post("/sendphotos", upload.array("photos"), async (req, res) => {
  const actualFiles = req.files;
  console.log(actualFiles);
  const files = fs.readdirSync(`uploads/${req.headers.name}`);
  for (let i = 0; i < actualFiles.length; i++) {
    const imageName = `${req.headers.name}-${files[i]}`;
    const path = `${req.headers.name}/${files[i]}`;
    let response = await uploadFiles(path, imageName, actualFiles[i].mimetype);
    fs.rmSync(`uploads/${req.headers.name}/${files[i]}`);
  }
  fs.rmSync(`uploads/${req.headers.name}`, { recursive: true, force: true });
  res.send({ access: true });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
