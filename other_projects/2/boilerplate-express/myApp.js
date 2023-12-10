let express = require("express");
let app = express();

absolutePath1 = __dirname + "/views/index.html";

app.get("/", (req, res) => {
  res.sendFile(absolutePath1);
});

app.use("/public", express.static(__dirname + "/public"));

module.exports = app;
