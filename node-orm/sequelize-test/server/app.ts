import express from 'express';
import { init } from './db/index'

const app = express()

init()

app.get('/', function (req: any, res: any) {
    console.log('req = ', req, '\nres = ', res)
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('server is on 3000')
})