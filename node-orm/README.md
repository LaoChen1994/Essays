## Node ORM: TypeORM学习及实践

### 参考资料

[TypeORM 实践笔记](https://typeorm.io/#/)



# Sequlize 学习笔记及实践

## 1. 如何使用Typescript兼容的模型

和公司大佬学到了一招

+ 1. 定义model的attribute定义

```typescript
// 模型参数的定义
interface IStudentsAttribute {
    id: BigInt
    name: string
    age: number
    phone_number: string
    grade: number
    create_at: Date
    update_at: Date
    delete_at: Date
}

// attributes定义
let studentAttributes: ModelAttributes<Model<any, IStudentsAttribute>, IStudentsAttribute> = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    create_at: {
        type: DataTypes.DATE,
        defaultValue: new Date().toString(),
        allowNull: false
    },
    update_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delete_at: {
        type: DataTypes.DATE(0),
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}

```

+ 2. 定义对应的表名，并作为创建时的options

```typescript
let studentOptions: any = {
    tableName: 'gx_students',
}

const defaultCreationOptions = {
    paranoid: true,
    createdAt: 'create_at',
    updatedAt: 'update_at',
    deletedAt: 'delete_at',
}

```

+ 3. 将attributes和options作为静态属性挂到定义的Model类上, 并定义对应的表内变量作为public变量暴露出去

```typescript
export class Students extends Model {
    static attributes = studentAttributes
    static options = studentOptions

    public id?: BigInt
    public name?: string
    public age?: number
    public phone_number?: string
    public grade?: number
    public create_at?: Date
    public update_at?: Date
    public delete_at?: Date
}
```

+ 4. 通过Model init将对应的sequlize和Model初始化绑定

```typescript
    Students.init(attributes, {
        ...options,
        ...defaultCreationOptions,
        sequelize: sequelize
    })
```
+ 5. 使用方法

```typescript
import { Students } from './db'

// 此时的data已经是Student[]类型，我们定义的类型已经能和我们查表得到的typescript推断定义相吻合了
app.get('/api/students', (req: any, res: any) => {
    return Students.findAll()
            .then(data => data.map(item => item.toJSON()))
            .then(data => res.send(data))
})
```

## 2. 简单的web api搭建

### 2.1 依赖安装

我们选择的是 express + sequlize的方式进行搭建，先不接入redis

```bash
npm install express sequelize
```

### 2.2 封装一层Application

+ 再接入db后我们希望db的应用application实体能结合再一起，因此，我们简单的将二者封装在一起

```typescript
import express, { Express } from 'express';
import { init } from './db/index'
import { Sequelize } from 'sequelize'
import { Students } from './db'

class MyApp {
    app: Express
    db?: Sequelize

    bindApp(fn: Function): Function {
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

    constructor() {
        this.app = express()
        init(this)
    }
}

const app = new MyApp()

app.get('/', function (req: any, res: any) {
    console.log('req = ', req, '\nres = ', res)
    res.send('Hello World')
})

app.get('/api/students', (req: any, res: any) => {
    return Students.findAll()
            .then(data => data.map(item => item.toJSON()))
            .then(data => res.send(data))
})

app.listen(3000, async () => {
    console.log('server is on 3000')
})

```

+ 这里的init方法是一个初始化数据库的方法

```typescript
// Students的定义参考上面的文章内容
export async function init(application) {

    try {
        const { options, attributes } = Students

        Students.init(attributes, {
            ...options,
            ...defaultCreationOptions,
            sequelize: sequelize
        })

        await sequelize.authenticate()
        await sequelize.sync({ force: false })

        application && (application.db = sequelize)
        console.log('grade init ok')
        
    } catch (error) {
        console.log(error)
    }

}

```

## 3. 如何对nodejs的rest接口写单测

### 2.1 参考文章
[让你的 Node.js 应用接口稳如狗](https://log.zvz.im/2016/06/07/Make-your-Nodejs-API-robust/)
[nodejs实战心得](https://wiki.jikexueyuan.com/project/node-lessons/supertest.html)

### 2.2 依赖工具

+ Mocha：一个javascript的异步测试框架，可以同时在浏览器和nodejs中运行，当测试api时，我们需要发送一些数据到终端然后利用返回的数据做后续的请求调用，很合适
+ Chai：是一个断言库，可以选择喜欢的断言接口例如assert,except,should
+ SuperTest: 是SuperAgent的扩展，轻量级的http ajax请求库，除了测验 JSON 对象的内容外，我们还想测验终端响应的其它数据，包括头信息类型和响应状态码。SuperTest 还有一个漂亮直观的接口。只需要简单地将接口终端需要的数据发送过去，就可以检验响应了

### 2.3 依赖安装

```bash
    npm install mocha chai supertest --save-dev
```

### 2.4 测试文件创建


1. 我们在目录下创建名为__test__的文件夹，然后创建一个test.js
2. 引入对应的库函数






