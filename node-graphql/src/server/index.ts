import express from "express";
import {
  buildSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLInputObjectType,
} from "graphql";
import { graphqlHTTP } from "express-graphql";
// @ts-ignore
import nunjucks from "nunjucks";
import path from "path";

const app = express();

app.set("view engine", "njk");
nunjucks.configure(path.resolve(__dirname, "./view/"), {
  autoescape: true,
  express: app,
});

class RandomDir {
  numberSides: number;
  constructor(numberSides: number) {
    this.numberSides = numberSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numberSides);
  }

  roll({ numRolls = -1 }) {
    var ouput: number[] = Array.from({ length: numRolls });
    return ouput.map(() => this.rollOnce());
  }
}

class Student {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class CommonRep {
  isSuccess: boolean;
  msg: string;

  constructor(isSuccess: boolean, msg: string) {
    this.isSuccess = isSuccess;
    this.msg = msg;
  }
}

var schema = buildSchema(`
  type RandomDir {
    numberSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Student {
    name: String!
    age: Int!
  }

  type Query {
    hello: String
    rollDise(numDice: Int!, numSides: Int): Int
    multiRoll(numberSides: Int): RandomDir
    studentInfo: Student
    getStudentById(id: Int!): Student
    getAllStudents: [Student]
  }

  type Mutation {
    addStudent(name: String!, age: Int!): [Student]
    updateStudent(id: Int!, newName: String, newAge: Int!): Student
  }
`);

const studentType = new GraphQLObjectType({
  name: "Student",
  fields: {
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  },
});

const studentList = [
  new Student("张三", 14),
  new Student("李四", 14),
  new Student("王五", 20),
];

var root = {
  hello: () => {
    return "get value";
  },
  rollDise: (param: any) => {
    console.log("numDice = ", param);
    return param.numDice * param.numSides;
  },
  multiRoll: (param: any) => {
    return new RandomDir(param.numberSides);
  },
  studentInfo: () => {
    return new Student("张三", 14);
  },
  getStudentById: (params: any) => {
    if (studentList[params.id]) {
      return studentList[params.id];
    } else {
      return null;
    }
  },
  getAllStudents: () => {
    return studentList;
  },
  addStudent: ({ name = "", age = -1 }) => {
    const newStu = new Student(name, age);
    studentList.push(newStu);
    return studentList;
  },
  updateStudent: ({ id = -1, newName = "", newAge = -1 }) => {
    newName && (studentList[id].name = newName);
    newAge && (studentList[id].age = newAge);

    return studentList[id];
  },
};

const commonResType = new GraphQLObjectType({
  name: "Common",
  fields: {
    isSuccess: {
      type: GraphQLBoolean,
    },
    msg: {
      type: GraphQLString,
    },
  },
});

const queryString = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      args: {},
      resolve: () => {
        return "Hello";
      },
    },
    studentInfo: {
      type: studentType,
      resolve: () => {
        return new Student("张三-新", 20);
      },
    },
    getStudentById: {
      type: studentType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, { id }) => {
        return studentList[id];
      },
    },
    studentInfoList: {
      type: new GraphQLList(studentType),
      resolve: () => {
        return studentList;
      },
    },
  },
});

// const addStudentInputType = new GraphQLInputObjectType({
//   name: "addStudentInput",
//   fields: {
//     name: { type: GraphQLString },
//     age: { type: GraphQLInt },
//   },
// });

const mutationString = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addStudent: {
      type: new GraphQLList(studentType),
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: (_, param): Student[] => {
        console.log(123);
        const { name, age } = param;
        try {
          studentList.push(new Student(name, age));
        } catch (error) {}
        return studentList;
      },
    },
  },
});

const schema2 = new GraphQLSchema({
  query: queryString,
  mutation: mutationString,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use(
  "/graphql2",
  graphqlHTTP({
    schema: schema2,
  })
);

app.get("/index", (req, res) => {
  res.render("./index.njk");
});

app.get("/", function (req, res) {
  res.send("hello world 123");
});

app.listen(3000, () => {
  console.log("server is work on 3000");
});
