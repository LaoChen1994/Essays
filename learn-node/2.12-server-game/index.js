const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require('qs')

const Game = require('../2.3-commonjs/game')

http
  .createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === "/") {
      console.log('server is on game~')
      res.writeHead(200);
      fs.createReadStream(path.resolve(__dirname, "./index.html")).pipe(res);
    }

    if (req.url.includes('game')) {
      const { key } = qs.parse(req.url.split('?')[1]) || {}

      if (!key) {
        res.writeHead(500)
        res.end('请输入有效的石头剪刀布')
      }
      
      res.writeHead(200)
      const rlt = Game.game(key)
      console.log('rlt -> ', rlt)
      res.end(rlt.toString())
    }
  })
  .listen(3000, () => {
    console.log("server is on 3000");
  });
