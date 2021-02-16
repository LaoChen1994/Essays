import { Sequelize, DataTypes, ModelCtor, Model, ModelAttributes } from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    database: 'students',
    username: 'root',
    password: '123456'
})

// class Grade extends Model {}

interface IStudentsAttribute {
    id: BigInt
    name: string
    age: number
    phoneNumber: string
    grade: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}

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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date().toString(),
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE(0),
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}

class Students extends Model {
    static attributes = studentAttributes

    static id?: BigInt
    public name?: string
    public age?: number
    public phoneNumber?: string
    public grade?: number
    static createdAt?: Date
    public updatedAt?: Date
    public deletedAt?: Date
}


// Students.init({
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     age: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     createdAt: {
//         type: DataTypes.DATE,
//         defaultValue: new Date().toString(),
//         allowNull: false
//     },
//     updatedAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         allowNull: false
//     },
//     phoneNumber: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     deleteAt: {
//         type: DataTypes.DATE(0),
//         allowNull: false,
//     },
//     grade: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     }
// }, {
//     sequelize, 
//     modelName: 'Students',
//     updatedAt: 'updateTimestamp',
// })

// interface IGrades extends Model {
//     id?: number
//     name: string
//     gradeType: number
// }

// const Grades =  sequelize.define<IGrades>('grades', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//     },
//     name: {
//         type: DataTypes.STRING(64),
//         allowNull: false,
//     },
//     gradeType: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     deletedAt: {
//         type: DataTypes.DATE(0)
//     }
// }, {
//     paranoid: true,
// })


export async function init() {

    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: false })

        // 通过build创建数据
        // const senior = Grades.build({
        //     name: '初二一班',
        //     gradeType: 8
        // })
        // await senior.save()

        // 通过create创建数据
        // const senior = await Grades.create({
        //     name: '初三一班',
        //     gradeType: 9
        // })

        // 改数据
        // const senior = await Grades.create({
        //     name: '初三一班2',
        //     gradeType: 9
        // })


        // senior.name = '初三二班'
        // 实际表现好像是新增一条
        // await senior.save()

        // 删数据
        // const senior = await Grades.create({
        //     name: '初三3班',
        //     gradeType: 9
        // })

        // senior.destroy()

        // 奇怪的新增数据的方式
        // const senior = await Grades.create({
        //     name: '初三三班',
        //     gradeType: 7
        // })

        // senior.increment('gradeType', { by: 2 })

        // 查询数据
        

        console.log('grade init ok')
        
    } catch (error) {
        console.log(error)
    }

}