import express, { Express } from 'express';
import { init } from './db/index'
import { Sequelize, Op } from 'sequelize'
import { Students } from './db'
import bodyParser from 'body-parser'
class MyApp {
    app: Express
    db?: Sequelize

    bindApp<T extends Function>(fn: T): T {
        return fn.bind(this.app)
    }

    get get() {
        return this.bindApp(this.app.get)
    }

    get listen() {
        return this.bindApp(this.app.listen)
    }

    get post() {
        return this.bindApp(this.app.post)
    }

    get put() {
        return this.bindApp(this.app.put)
    }

    get delete() {
        return this.bindApp(this.app.delete)
    }

    get use () {
        return this.bindApp(this.app.use)
    }

    constructor() {
        this.app = express()
        init(this)
    }
}

const app = new MyApp()

enum SearchType {
    ALL = 'all',
    EXISTED = 'existed',
    DELETED = 'deleted'
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req: any, res: any) {
    console.log('req = ', req, '\nres = ', res)
    res.send('Hello World')
})

app.get('/api/students', (req: any, res: any) => {
    const { query: { type = SearchType.EXISTED } } = req
    let operator = Op.eq
    console.log(type === SearchType.DELETED)

    switch (type) {
        case SearchType.ALL:
            operator = Op.gte
            break;
        case SearchType.DELETED:
            operator = Op.gt
            break;
        default:
            break;
    }

    console.log(operator)

    return Students.findAll({
                where: {
                    delete_at: {
                        [operator]: new Date(0)
                    }
                },
                paranoid: false
            })
            .then(data => data.map(item => item.toJSON()))
            .then(data => res.send(data))
})

app.get('/api/student/:id',(req, res) => {
    const { params: { id } } = req

    return Students
            .findByPk(+id)
            .then(data => {
                console.log(data)
                res.send(data?.toJSON() ?? {})
            })
})

app.post('/api/student', (req: any, res: any) => {
    const { name, age, phoneNumber, grade } = req.body

    return Students.create({
        name,
        age,
        phone_number: phoneNumber,
        grade
    }, {
        // @ts-ignore
        bindParams: false
    }).then(data => {
        res.send(data.toJSON())
    })
})

app.delete('/api/student/:id', (req, res) => {
    const { id } = req.params
    return Students.destroy({
        where: {
            id: {
                [Op.eq]: +id
            }
        }
    })
    .then(effectNumber => {
        res.send({
            status: effectNumber ? true : false
        })
    })
})

app.listen(3000, async () => {
    console.log('server is on 3000')
})