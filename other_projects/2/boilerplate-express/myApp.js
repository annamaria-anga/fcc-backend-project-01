require("dotenv").config();
let express = require("express");
let bodyParser = require("body-parser");

let app = express();

absolutePath1 = __dirname + "/views/index.html";

app.get("/", (req, res) => {
  res.sendFile(absolutePath1);
});

absolutePath2 = __dirname + "/public";

app.use("/public", express.static(absolutePath2));

app.use(function middleware(req, res, next) {
  let message = `${req.method} ${req.path} - ${req.ip}`;
  console.log(message);
  next();
});

app.get("/json", (req, response) => {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    response.send({ message: "Hello json".toUpperCase() });
  } else {
    response.send({ message: "Hello json" });
  }
});

app.get(
  "/now",
  function (req, res, next) {
    req.time = new Date().toString();
    next();
  },
  function (req, res) {
    res.send({ time: req.time });
  }
);

app.get("/:word/echo", function (req, res) {
  res.json({ echo: req.params.word });
});

app.use(bodyParser.urlencoded({ extended: false }));

const handler = function (req, res) {
  console.log(req.body);
  let firstName = req.query.first;
  let lastName = req.query.last;
  res.json({ name: `${firstName} ${lastName}` });
};

const postHandler = function (req, res) {
  console.log(req.body);
  let firstName = req.body.first;
  let lastName = req.body.last;
  res.json({ name: `${firstName} ${lastName}` });
};

app.route("/name").get(handler).post(postHandler);

module.exports = app;
