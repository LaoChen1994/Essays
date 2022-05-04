const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");

const Game = require("../2.3-commonjs/game");

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  console.log('in koa server~')
  ctx.status = 200;
  ctx.set("Content-Type", "text/html");
  ctx.body = fs.readFileSync(path.resolve(__dirname, "./index.html"));
});

router.get(
  "/game",
  async (ctx, next) => {
    console.log("start timer ->", new Date().toString());
    await next();
    console.log("end time ->", new Date().toString());
  },
  async (ctx) => {
    const query = ctx.query;
    const { key } = query;
    const rlt = Game.game(key);

    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 3000)
    })

    ctx.status = 200;
    ctx.body = rlt;
  }
);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(10001, () => {
  console.log("server is on 10001");
});
