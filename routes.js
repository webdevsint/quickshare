const { nanoid } = require("nanoid");
const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const KEY = process.env.KEY;

const router = express.Router();

const { formatBytes, Encryption, Decryption } = require("./utils");

router.get("/", (req, res) => {
  res.sendFile(path.resolve("./views/upload.html"));
});

router.get("/file/:id", (req, res) => {
  res.sendFile(path.resolve("./views/file.html"));
});

router.post("/upload", function (req, res) {
  const data = require("./public/data.json");
  const file = req.files.upload;

  const id = nanoid(8);

  const extension = file.name.split(".").pop();

  const fileData = {
    id: id,
    name: file.name,
    size: formatBytes(file.size),
    mimeType: file.mimetype,
    authKey: new Encryption(req.body.authKey, KEY).encrypted,
    path: `/uploads/${id}.${extension}`,
  };

  file.mv(path.resolve("./public/uploads/", `${id}.${extension}`), () => {
    data.push(fileData);

    fs.writeFileSync(path.resolve("./public/data.json"), JSON.stringify(data));

    res.send("file uploaded");
  });
});

router.post("/delete", (req, res) => {
  const data = require("./public/data.json");

  const id = req.query.id;
  const key = req.query.key;

  const index = data.findIndex((i) => i.id === id);

  const file = data.filter((f) => f.id === id)[0];
  const extension = file.name.split(".").pop();

  const authKey = new Decryption(file.authKey, KEY).decrypted;

  if (key === authKey) {
    data.splice(index, 1);

    fs.writeFileSync(path.resolve("./public/data.json"), JSON.stringify(data));
    fs.rmSync(path.resolve("./public/uploads/", `${id}.${extension}`));

    res.send("File deleted!");
  } else {
    res.send(403);
  }
});

module.exports = router;
