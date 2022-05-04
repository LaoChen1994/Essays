const fs = require("fs");
const path = require("path");
const express = require("express");

const Game = require("../2.3-commonjs/game");

const app = express();

app.get("/", (req, res) => {
  console.log('in express server~')
  res.writeHead(200);
  res.send(fs.readFileSync(path.resolve(__dirname, "./index.html")))
});

app.get("/game", (req, res) => {
  const query = req.query
  const { key } = query
  const rlt = Game.game(key)

  res.status(200).json({ data: rlt })
})

app.listen(3000, () => {
  console.log("server is on 3000");
});
