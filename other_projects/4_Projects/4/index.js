const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use("/", bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

let id = 0;
let users = [];
let log = [];
app.post("/api/users", function (req, res) {
  id++;
  users.push({ username: req.body.username, _id: String(id) });
  res.json({ username: req.body.username, _id: id });
});

app.get("/api/users", function (req, res) {
  res.json(users);
});

function getUserIndex(array, id) {
  return array.findIndex((user) => user["_id"] == Number(id));
}

app.post("/api/users/:_id/exercises", function (req, res) {
  const userIndex = getUserIndex(users, req.params._id);

  const currentLog = {
    date: req.body.date
      ? req.body.date
      : new Date().toISOString().split("T")[0],
    duration: Number(req.body.duration),
    description: req.body.description,
  };

  if (log.findIndex((user) => user["_id"] == Number(req.params._id)) < 0) {
    log.push({
      _id: req.params._id,
      username: users[userIndex]["username"],
      log: [currentLog],
    });
  } else {
    log[userIndex].log.push(currentLog);
  }

  res.json({
    _id: req.params._id,
    username: users[userIndex]["username"],
    date: new Date(currentLog.date).toDateString(),
    duration: currentLog.duration,
    description: currentLog.description,
  });
});

app.get("/api/users/:_id/logs", function (req, res) {
  const userIndex = getUserIndex(users, req.params._id);
  const userLogIndex = log.findIndex(
    (user) => user["_id"] == Number(req.params._id)
  );

  console.log(JSON.stringify(log));

  let exercises = log[userLogIndex].log;

  if (req.query.from) {
    exercises = exercises.filter((ex) => ex.date >= req.query.from);
  }

  if (req.query.to) {
    exercises = exercises.filter((ex) => ex.date <= req.query.to);
  }

  if (req.query.limit) {
    exercises = exercises.slice(req.query.limit);
  }

  res.json({
    _id: req.params._id,
    count: exercises.length,
    username: users[userIndex]["username"],
    log: exercises.map((_ex) => {
      ex = {
        ..._ex,
      };
      ex.date = new Date(ex.date).toDateString();

      return ex;
    }),
  });
});

const listener = app.listen(process.env.PORT || 80, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
