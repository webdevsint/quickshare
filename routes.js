const axios = require("axios").default;
const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const formatBytes = require("./utils/formatter");

const database = process.env.CONNECTION_URI; // mango-v2 database

const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  res.redirect("/upload");
});

// handling uploads
router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/upload", upload.single("uploadFile"), (req, res, next) => {
  const file = req.file;

  const extension = file.originalname.split(".").reverse()[0];

  fs.rename(file.path, `${file.path}.${extension}`, (err) => {
    if (err) res.status(500).json(err);
  });

  file.filename = `${file.filename}.${extension}`;
  file.path = `${file.path}.${extension}`;

  const payload = {
    name: file.filename,
    type: file.mimetype,
    size: formatBytes(file.size),
    key: req.body.key,
  };

  axios
    .post(database, payload)
    .then((response) => res.status(200).json(req.file))
    .catch((err) => res.status(500).json(err));
});

// fetching files
router.get("/files", (req, res) => {
  const id = req.params.id;

  axios
    .get(database)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => res.status(500).json(err));
});

router.get("/file/:id", (req, res) => {
  const id = req.params.id;

  axios
    .get(database)
    .then((response) => {
      const file = response.data.filter((item) => item.id === id);

      if (file.length === 0) res.status(400).json({ error: "file not found" });
      else res.send(file[0]);
    })
    .catch((err) => res.status(500).json(err));
});

router.get("/get/:id", (req, res) => {
  const id = req.params.id;

  axios
    .get(database)
    .then((response) => {
      const file = response.data.filter((item) => item.id === id);

      if (file.length === 0) res.status(400).json({ error: "file not found" });
      else {
        const filePath = path.resolve("./uploads", file[0].name);
        res.download(filePath);
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
