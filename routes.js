const { nanoid } = require("nanoid");
const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const KEY = process.env.KEY;

const router = express.Router();

const { formatBytes, Encryption, Decryption } = require("./utils");

router.get("/", (req, res) => {
  res.sendFile(path.resolve("./views/index.html"));
});

// client side
router.get("/new/upload", (req, res) => {
  res.sendFile(path.resolve("./views/file_upload.html"));
});

router.get("/new/folder", (req, res) => {
  res.sendFile(path.resolve("./views/folder_upload.html"));
});

// single
router.get("/file/:id", (req, res) => {
  res.sendFile(path.resolve("./views/file.html"));
});

router.get("/folder/:name", (req, res) => {
  res.sendFile(path.resolve("./views/folder.html"));
});

// upload
router.post("/upload-file", function (req, res) {
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

    res.redirect(`/file/${id}`);
  });
});

router.post("/create-folder", (req, res) => {
  const folderName = req.body.name;

  const folders = fs.readdirSync(path.resolve("./public/uploads/folders/"));

  if (folders.includes(folderName)) {
    res.status(403).send("Folder already exists! Try another name.");
  } else {
    fs.mkdirSync(path.resolve("./public/uploads/folders/", folderName));

    const folderData = {
      name: folderName,
      files: [],
      authKey: new Encryption(req.body.authKey, KEY).encrypted,
    };

    req.files.upload.forEach((file) => {
      const id = nanoid(8);

      const extension = file.name.split(".").pop();

      const fileData = {
        id: id,
        name: file.name,
        size: formatBytes(file.size),
        mimeType: file.mimetype,
        path: `/uploads/folders/${folderName}/${id}.${extension}`,
      };

      file.mv(
        path.resolve(
          "./public/uploads/folders/",
          folderName,
          `${id}.${extension}`
        )
      );

      folderData.files.push(fileData);
    });

    fs.writeFileSync(
      path.resolve("./public/uploads/folders/", folderName, "data.json"),
      JSON.stringify(folderData)
    );

    res.redirect(`/folder/${folderName}`);
  }
});

// delete
router.post("/delete/file", (req, res) => {
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

router.post("/delete/folder", (req, res) => {
  const folderName = req.query.name;
  const key = req.query.key;

  const folders = fs.readdirSync(path.resolve("./public/uploads/folders/"));

  if (folders.includes(folderName)) {
    const data = require(`./public/uploads/folders/${folderName}/data.json`);
    const authKey = new Decryption(data.authKey, KEY).decrypted;

    if (key === authKey) {
      fs.rmSync(path.resolve(`./public/uploads/folders/${folderName}`), {
        recursive: true,
        force: true,
      });

      res.send("Folder deleted!");
    } else {
      res.send(403);
    }
  } else {
    res.status(403).send("This folder doesn't exist!");
  }
});

module.exports = router;
