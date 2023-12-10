// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

function unixConverter(unixDate) {
  return new Date(unixDate).toUTCString();
}

function dateConverter(yyyymmdd) {
  return new Date(yyyymmdd).getTime();
}

app.get("/api/:date", function (req, res) {
  let input;

  if (req.params.date.toString().includes("-")) {
    input = Number(dateConverter(req.params.date));
  } else {
    input = Number(req.params.date);
    console.log(input);
  }

  res.json({
    unix: input,
    utc: unixConverter(input),
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 80, function () {
  console.log("Your app is listening on port " + listener.address().port);
});