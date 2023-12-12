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

const handler = function (req, res) {
  let input;
  let date;

  try {
    if (!req.params.date) {
      date = new Date();
    } else {
      if (Number(req.params.date) == req.params.date) {
        input = Number(req.params.date);
      } else {
        input = String(req.params.date);
      }

      date = new Date(input);
    }
    // if (req.params.date.toString().includes("-")) {
    //   input = Number(dateConverter(req.params.date));
    // } else {
    //   input = Number(req.params.date);
    // }
    const output = date.toUTCString();
    if (output === "Invalid Date") {
      throw new Error(output);
    }
    res.json({
      unix: date.getTime(),
      utc: date.toUTCString(),
    });
  } catch (error) {
    res.json({
      error: "Invalid Date",
    });
  }
};

app.get("/api/:date", handler);
app.get("/api", handler);

// listen for requests :)
var listener = app.listen(process.env.PORT || 80, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
