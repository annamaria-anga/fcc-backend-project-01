require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 80;

app.use(cors());
app.use("/", bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.use(express.json());

let urls = [];
app.post("/api/shorturl", function (req, res) {
  try {
    let url = req.body.url;
    if (validUrl.isUri(url)) {
      urls.push(url);
      res.json({ original_url: url, short_url: urls.length - 1 });
    } else {
      res.json({ error: "invalid url" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid JSON format" });
  }
});

app.get("/api/shorturl/:index", function (req, res) {
  res.redirect(urls[req.params.index]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
