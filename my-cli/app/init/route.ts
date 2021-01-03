const Router = require("koa-router");
import { importAllFile } from '../utils'
import path from 'path'

interface IRoutesItem {
    path: string
    method: 'get' | 'post' | 'delete' | 'put',
    controller: any
}

interface IRouteDefault {
    default: IRoutesItem[]
}

const router = new Router();

importAllFile<IRouteDefault>(path.resolve(__dirname, '../routes/')).then(routes => {
    routes.map(async route => {
        const r = await (await route).default

        r.map(item => {
            router[item.method](item.path, item.controller)
        })
        
    })
})



export { router };
