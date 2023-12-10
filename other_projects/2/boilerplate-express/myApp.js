require("dotenv").config();
let express = require("express");
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
  },
  function (req, res) {
    res.send({ time: req.time });
  }
);

module.exports = app;
