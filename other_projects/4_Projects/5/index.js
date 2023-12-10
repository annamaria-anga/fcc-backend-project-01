var express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();
const fs = require("fs");

var app = express();

const upload = multer({ dest: "./public/data/uploads/" });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use("/", bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), function (req, res) {
  console.log(req.file, req.body);
  // fs.writeFile("./files", req.file);
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

const port = process.env.PORT || 80;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
