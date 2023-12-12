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

const defaultDate = () => new Date().toISOString().slice(0, 10);

let id = 0;
let users = {};
let logger = {};
app.post("/api/users", function (req, res) {
  id++;
  users[id] = {
    username: req.body.username,
    _id: String(id),
  };

  res.json(users[id]);
});

app.get("/api/users", function (req, res) {
  res.json(Object.values(users));
});

function getUserIndex(array, id) {
  return array.findIndex((user) => user["_id"] == Number(id));
}

app.post("/api/users/:_id/exercises", function (req, res) {
  const userId = req.params._id || req.body._id; // userId from URL or from body
  console.log(users);
  console.log(userId);
  const exObj = {
    description: req.body.description,
    duration: +req.body.duration,
    date: req.body.date || defaultDate(),
  }; // exrecise object to add

  console.log(req.body);
  const user = users[userId];

  if (logger[userId] === undefined) {
    logger[userId] = {
      _id: userId,
      username: user["username"],
      log: [],
    };
  }

  logger[userId].log.push(exObj);

  // if (logger.findIndex((user) => user["_id"] == Number(req.params._id)) < 0) {
  //   logger.push({
  //     _id: req.params._id,
  //     username: users[userIndex]["username"],
  //     log: [currentLog],
  //   });
  // } else {
  //   logger[userIndex].log.push(currentLog);
  // }

  res.json({
    username: user["username"],
    description: exObj.description,
    duration: exObj.duration,
    _id: userId,
    date: new Date(exObj.date).toDateString(),
  });
});

app.get("/api/users/:_id/logs", function (req, res) {
  const userId = req.params._id;
  // const userIndex = getUserIndex(users, req.params._id);
  // const userLogIndex = logger.findIndex(
  //   (user) => user["_id"] == Number(req.params._id)
  // );

  // console.log(JSON.stringify(log));

  let exercises = logger[req.params._id].log || [];
  let additionalField = "";

  const response = {
    _id: req.params._id,
    count: exercises.length,
    username: users[userId]["username"],
    log: exercises.map((_ex) => {
      ex = {
        ..._ex,
      };
      ex.date = new Date(ex.date).toDateString();

      return ex;
    }),
  };

  if (req.query.from) {
    exercises = exercises.filter((ex) => ex.date >= req.query.from);
    response.from = new Date(req.query.from).toDateString();
  }

  if (req.query.to) {
    additionalField = new Date(req.query.from).toDateString();
    exercises = exercises.filter((ex) => ex.date <= req.query.to);
    response.to = new Date(req.query.from).toDateString();
  }

  if (req.query.limit) {
    exercises = exercises.slice(req.query.limit);
  }

  // const response = {
  //   _id: req.params._id,
  //   count: exercises.length,
  //   username: users[userId]["username"],
  //   log: exercises.map((_ex) => {
  //     ex = {
  //       ..._ex,
  //     };
  //     ex.date = new Date(ex.date).toDateString();

  //     return ex;
  //   }),
  // };

  res.json(response);
});

const listener = app.listen(process.env.PORT || 80, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
