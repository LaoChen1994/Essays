import Koa from "koa";
//@ts-ignore
import koaViews from "koa-nunjucks-2";
import { router } from "./init/route";
import path from "path";
import LoadUtil from './init/load'
import mime from 'mime'
import fs from 'fs'

const app = new Koa();

app.use(
  koaViews({
    ext: "njk",
    path: path.resolve(__dirname, "./views"),
    nunjucksConfig: {
      trimBlocks: true,
    },  
  })
);

app.use(async (ctx, next) => {
  const render = ctx.render
  ctx._renderState = {}

  ctx.setState = function(state: Record<string, any>) {
    ctx._renderState = Object.assign({}, ctx._renderState, state)
  }

  ctx.setHeader = (opts: Record<string, string>) => {
    Object.keys(opts).map(key => {
      ctx.set(key, opts[key])
    })
  }


  ctx.render = async (path: string, state?: Record<string, any>)  => {
    const renderState = ctx._renderState
    ctx._renderState = Object.assign({})

    render(path, state || renderState)
  }

  ctx.setState({ loadJs: LoadUtil.loadJs })

  await next()
})

app.use(async (ctx, next) => {
  const urlPath = ctx.path
  const type = mime.getType('js')
  const regx = /\/public\/(\w+)\/(.*)/

  if (regx.test(urlPath)) {
    const [_, dir, filename] = urlPath.match(regx)!
    ctx.body = fs.createReadStream(path.resolve(__dirname, `../local/${filename}`))
  }

  await next()
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("server is on 3000");
});
