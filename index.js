const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();

// cors
app.use(cors());

// body parser
app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(bodyParser.json());

// frontend
app.set("view engine", "ejs");
app.use(express.static("./uploads/"));

// routes
app.use("/", require("./routes"));

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}/`);
});
