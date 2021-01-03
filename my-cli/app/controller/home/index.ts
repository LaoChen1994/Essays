import { IControllerCtx } from '../interface'
import fs from 'fs'
import path from 'path'

export default {
    async getIndexHtml(ctx: IControllerCtx) {
        ctx.setState({ name: 'Jack' })
        ctx.setState({ age: 18 })
        ctx.setState({ price: function(price: number) { return price / 100 } })
        return await ctx.render('./index/index')
    },
    async getDownloadFile(ctx: IControllerCtx) {
        ctx.setHeader({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment;filename="content.txt"'
        })
        const fileReader = fs.createReadStream(path.resolve(__dirname, '../../../public/test.txt'))
        ctx.response.body = fileReader
    }
}