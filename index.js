const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const routes = require("./routes.js");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload());

app.use("/", routes);

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}/`)
);
