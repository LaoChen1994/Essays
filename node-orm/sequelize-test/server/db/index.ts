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
    phone_number: string
    grade: number
    create_at: Date
    update_at: Date
    delete_at: Date
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
        defaultValue: new Date(0),
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}

let studentOptions: any = {
    tableName: 'gx_students',
}

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

const defaultCreationOptions = {
    paranoid: true,
    createdAt: 'create_at',
    updatedAt: 'update_at',
    deletedAt: 'delete_at',
}

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