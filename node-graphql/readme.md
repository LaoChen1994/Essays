# Graphql + Node 实践

### 1. 搭建 typescript + webpack + nodemon 的运行环境

#### 0. 需求分析

我们想要啥效果：

+ 支持es6+    ->  babel-loader + webpack
+ 支持typescript  -> ts-loader
+ client文件夹下的前端文件多入口打包(便于懒加载) -> webpack多入口配置
+ server下的文件能通过webpack打包，当对应文件更新时，实现服务器重启   -> 使用nodemon来定位变化

#### 1. 安装依赖

>yarn init
>
>yarn add babel-loader @babel/core @babel/preser-env  ts-loader --save-dev
>
>yarn add nodemon -g
>
>yarn add webpack webpack-merge --save-dev
>
>yarn add webpack-cli webpack-dev-server -g

#### 2. 创建文件目录

![image-20200816214536183](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200816214536183.png)

#### 3. 配置webpack基础配置

##### 1.  client 代码打包配置

~~~javascript
// webpack.config.js
// 通用的基础loader等配置
const path = require("path");
const fs = require("fs");

module.exports = {
  devtool: "inline-source-map",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src/"),
    },
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          preset: ["@babel/preset"],
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

~~~

~~~javascript
// 获取多文件入口
// dirConfig.js
const fs = require("fs");
const path = require("path");

// 为了获得client文件夹下多文件的入口
// 便于分包，按需加载
module.exports = function getFilePath(basePath) {
  const files = [];

  function _tranvers(_basePath) {
    const _dirPath = fs.readdirSync(_basePath);

    _dirPath.map((filePath) => {
      const currPath = path.resolve(_basePath, filePath);
      const isDir = fs.statSync(currPath).isDirectory();
      if (isDir) {
        _tranvers(currPath);
      } else {
        files.push(currPath);
      }
    });
  }
  _tranvers(basePath);

  return files.reduce((p, c, i) => ({ ...p, [i]: c }), {});
};

// develoment 开发模式配置
// 多文件打包的好处就是 如果我们只改动了其中一个文件，其他的文件不需要重新打包
// webpack.config.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const path = require("path");
const getFilePath = require("./dirConfig");
const clientPath = path.resolve(__dirname, "../src/client");

const fileList = getFilePath(clientPath);

module.exports = merge(common, {
  mode: "development",
  entry: fileList,
  // 输出文件按照多文件打包
  output: {
    path: path.resolve(__dirname, "../dist"),
    // 这里使用chunckhash，是包的版本，如果包没有被更新他的chunck是不会变的~
    filename: "[name].[chunkhash].js",
  },
  // 启用webpack-dev-server
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
  },
});

~~~



##### 2. node server配置

注意点：

+ target设为node，告诉webpack node的通用模块可以不用打进去

~~~javascript
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const path = require("path");

module.exports = merge(common, {
  target: "node",
  entry: path.resolve(__dirname, "../src/server/index.ts"),
  output: {
    path: path.resolve(__dirname, "../local"),
    filename: "server.js",
  },
  node: {
    console: true,
    process: true,
    global: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
  },
  mode: "development",
});
~~~

+ 简单的编写下node server的代码

  ~~~javascript
  import express from "express";
  import nunjucks from "nunjucks";
  import path from "path";
  
  const app = express();
  
  app.set("view engine", "njk");
  nunjucks.configure(path.resolve(__dirname, "./view/"), {
    autoescape: true,
    express: app,
  });
  
  app.get("/", (req, res) => {
    res.send("hello Word")
  });
  
  
  app.listen(3000, () => {
    console.log("server is work on 3000");
  });
  
  ~~~

  

#### 

##### 3. 测试配置结果

1. 先在package.json中添加打包的命令

![image-20200822122542616](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200822122542616.png)

2. 看一看client下面的文件打包结果，从这里可以看到，我们的三个文件已经被打成了3个不同的js包完成了 ts -> js -> 多入口打包，

![image-20200822122736437](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200822122736437.png)

3. 这个时候我们**修改其中一个user/index.ts**文件我们发现修改文件后 chunckName为2的被重新打包，而**其他的文件并没有被重新打包，其chunkHash值并没有发生改变**

![image-20200822122925607](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200822122925607.png)

4. server端的打包结果，可以看到node的原生模块作为了external，理论上没有被打进来

![image-20200822123222032](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200822123222032.png)



#### 4. 配置nodemon

##### 1. nodemon是啥玩意儿？

> nodemon是啥: Nodemon is a utility that will monitor for any changes in your source and automatically restart your server. Perfect for development.

**说人话：**

> nodemon 就是在你服务器代码更新的时候帮你重启服务器。
>
> 以前的场景：node代码改了之后，手动yarn start一下
>
> 现在：node代码改了之后，自动start (就是这么简单~)

##### 2.项目中的nodemon配置

~~~json
{
  // 是否支持重启动
  "restartable": "rs",
  // 配置忽略的文件 -> 这些文件改动之后不会重启服务器
  "ignore": [".git", ".svn", "node_modules/**/node_modules"],
  "verbose": true,
  // 我们执行nodemon xxx.ts 他会用ts-node执行， 执行nodemon xxx.js用node xxx.js执行
  // 执行的配置列表
  "execMap": {
    "js": "node --harmony",
    "ts": "ts-node"
  },
  // 我们打包的文件在local文件下
  // 我们写的文件在server下
  // 这是一个监听列表，只有监听列表下的文件发生变化，才会重启node服务
  "watch": ["./local", "./src/server"],
  "env": {
    "NODE_ENV": "development"
  },
  // 监听文件的后缀名，只有包含在下列扩展名内的文件才会重启node服务
  // 比如一个server下的 xxx.html发生更改，他是不会重启node服务的
  "ext": "js json njk"
}

~~~

#### 5. 整体搭建环境测试

~~~bash
# 现在我们通过三个命令去启动我们的环境
yarn dev-serve
yarn dev-client
yarn watch-serve
~~~

当我们修改index.ts的时候，会自动重新打包并通过nodemon重启node服务

![](D:\Learn\node-graphql\img\test.gif)



### 2. 基本的graphql + express使用

[官方文档](https://graphql.cn/graphql-js/)

+ 依赖的包:
  + graphql
  + express
  + express-graphql -> 支持express的graphql服务器

#### 1. 建立一个graphql的基础服务器配置

##### 1. 服务端配置

~~~typescript
import express from "express";
import { buildSchema } from "graphql";
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

// 关键的配置代码
// 用来定义返回类型
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// 用来定义返回值的操作
var root = {
  hello: () => {
    return "get value";
  },
};

// 将从前端传来的grapyql请求通过graphql服务器进行解析
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("server is work on 3000");
});

~~~

##### 2. 前端请求配置

~~~javascript
fetch("/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({ query: "{hello}" }),
})
    .then((r) => r.json())
    .then((data) => console.log(data));
// 这里我们会得到data -> get value
~~~

从上面的例子可以看到graphql配置中的几个关键点

+ scheme -> 用于定义返回值的类型
+ root  -> 用于定义需要返回值返回的值得获取方法
+ graphqlHTTP一个支持graphql api的返回的服务器

##### 3. 使用构建类型定义schema的方法

我们先来看下上面代码中对schema的配置方法

~~~typescript
// 关键的配置代码
// 用来定义返回类型
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// 用来定义返回值的操作
var root = {
  hello: () => {
    return "get value";
  },
};
~~~

在这里有几个让人别扭(没错就是我感觉难受)的点：

+ 我们通过模板字符串来配置schema，在书写的时候没有提示，很容易写错
+ 当我们的业务很复杂的时候，schema的字符串列表会很长，不易于维护和复用
+ 返回值得类型定义和返回值的业务逻辑分离，通过名字相同来进行匹配，感觉上不容易维护(当然也有人觉得分开维护更加清晰，仁者见仁智者见智吧~)

基于此，我更喜欢文档中的第二种，利用构建类型，操作和定义schema，废话不多说我们先来看代码

~~~javascript
import { GraphQLObjectType, GraphQLString } from 'graphql'
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
  },
});
~~~

在构建类型中，其实是将 schema定义 + root进行整合 方法如下：

+ 每一个fields对应了一个支持的graphql的查询方法
+ **type**用于定义该查询**语句的返回类型**
+ **args**用于定义查询**语句获得的参数类型**（后面会详细的演示）
+ **resolve**用于处理该查询语句**获取参数的业务逻辑**(一般来讲graphql其实应该更多负责获取数据，而不是处理太多奇怪的业务逻辑)

为了对比结果我们增加一个新的graphql查询服务器，放在/graphql2这个路径下

~~~typescript
const schema2 = new GraphQLSchema({
  query: queryString,
});

app.use(
  "/graphql2",
  graphqlHTTP({
    schema: schema2,
  })
);

// 前端请求方法
fetch("/graphql2", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({ query: "{ hello }" }),
})
    .then((res) => res.json())
    .then((data) => console.log("new Hello = ", data));
~~~

##### 4. 结果

![image-20200829214737732](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200829214737732.png)

**从结果看到，两种方法其实都是可以获得对应的参数的，只看你喜欢哪种啦~**

#### 2. 复杂对象graphql返回方法

我们有时需要返回的不仅仅是一个简单的字符串或者数字，我们可能需要返回一个复杂对象，这个时候我们要怎么操作呢？我们继续看下面的例子

##### 1. 服务端的配置

+ 首先，从模板字符串来看，我们来配置schema 和 root
+ 注意点，作为一个复杂类型(对象类型)，我们可以定义一个Student来类来进行返回 (**原因：因为我理解，其实最后我们通过graphql返回给前端是一个对象，比如我们返回 const res = { name: '张三', age: 18 }, 但是其实我们前端拿的时候，只想拿到name字段，其实这个时候，graphql http在处理的时候会直接拿res.name**),我们通过定义一个Student类，更有利于代码的维护，
+ 另外，比如我们要返回一个Student对象，我们在返回值的时候，其实并不是返回string, int这么简单，我们需要返回一个Student的类，那么，我们**在graphql的schema中定义returnType的时候就应该返回这个Student类型**，因此我们**需要在Schema中就定义**这个类型

~~~javascript
// 定义了一个学生类别
// 用于返回学生信息

// 用于在js中处理对应的取参逻辑
class Student {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// 这个type Student 为了让graphql用于数据的校验
var schema = buildSchema(`
  type Student {
    name: String!
    age: Int!
  }

  type Query {
    hello: String
    studentInfo: Student
  }
`);

var root = {
  hello: () => {
    return "get value";
  },
  studentInfo: () => {
    return new Student("张三", 14);
  },
};

~~~

**构建类型的定义方法**

+ 这里我们依然给出构建类型的定义方法:

1. 定义对应的Student的query类型

~~~javascript
// 1. 定义一个Student的Query类型 -> scehma中的类型定义
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
~~~

2. 在schema中定义相应的fields（type 即为刚才定义的studentType）

~~~javascript
const queryString = new GraphQLObjectType({
  name: "Query",
  fields: {
    studentInfo: {
      type: studentType,
      resolve: () => {
        return new Student("张三-新", 20);
      },
    },
  },
});
~~~

##### 2. 前端调用的规则

+ 注意点：
  + 对于复杂对象的查询来说，因为返回的是一个复杂类型，因此我们需要告诉graphql，最终我们在复杂类型中需要取的字段名，因此在查询语句中**写明最终需要返回参数的名称**

~~~javascript
// 定义查询语句 
let query3 = `query StudentInfo {
    studentInfo {
        name,
        age
    }
}`;

// 调用模板字符串定义的schema
fetch("/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({ query: query3 }),
})
    .then((res) => res.json())
    .then((data) => console.log(data));

// 调用构造类型的schema
fetch("/graphql2", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({ query: query3 }),
})
    .then((res) => res.json())
    .then((data) => console.log("get Student = ", data));
~~~

##### 3. 结果

![image-20200829224032189](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200829224032189.png)



#### 3. 传参的例子

有些场景下我们需要根据参数来获取对应的返回值，这个时候我们可以通过传参的方式来解决

例如，我们想获取一个学生列表中的学生，我们可以根据学生的学号进行匹配，获取对应学生的信息的场景

##### 1. 服务端配置

1. 为模板字符串添加配置

   **我们在root中的param中可以获取前端传过来的查询参数**

   ~~~javascript
   // 模拟一个假的数据库
   const studentList = [
     new Student("张三", 14),
     new Student("李四", 14),
     new Student("王五", 20),
   ];
   
   // schema
   // 新增getStudentById
   var schema = buildSchema(`
     type Student {
       name: String!
       age: Int!
     }
   
     type Query {
       // .....省略之前的
       getStudentById(id: Int!): Student
     }
   `);
   
   // root配置
   var root = {
     // ....省略之前的
     // 新增root配置
     getStudentById: (params) => {
       // 所有传递的参数在params中可以拿到
       const stus = [new Student("张三", 14), new Student("李四", 14)];
       if (stus[params.id]) {
         return stus[params.id];
       } else {
         return null;
       }
     },
   };
   
   ~~~

2. 为构建类型添加类型

   + 构建时通过args来定义**resolve中查询参数的类型**
   + 如果args是一个复杂类型的话，可以利用之前的**先定义变量类型的方法，将类型赋值给对应args的type**

   ~~~typescript
   const queryString = new GraphQLObjectType({
     name: "Query",
     fields: {
       // 省略之前的。。。。
       getStudentById: {
         type: studentType,
         args: {
           id: { type: GraphQLInt },
         },
         resolve: (_, { id }) => {
           // 解构赋值拿到对应的参数进行操作
           return studentList[id];
         },
       },
     },
   });
   ~~~

##### 2. 前端调用方法

+ 如果需要传参先要定义一个query方法，之后通过$xxx定义对应形参的类型，使用**$是为了转义**
+ 之后需要调用对应的schema中的方法，然后**如果返回是复杂类型，要最终写到需要返回的参数名**
+ **需要将形参$xxx赋值给实际在graphql resolve解构参与的逻辑的实参xxx**
+ 定义时的输入输出的类型要和传入传出的参数类型保持一致，不然会报错
+ 目前Graphql支持的标量类型：String，Int，Float，Boolean和ID

~~~javascript
// 这里先通过一个id进行传递，然后将该id传给对应的在shema中配置的方法即可
// 这里推荐用$符号 完成自动转义
let query4 = `query GetStudentInfo($id: Int!) {
    getStudentById(id: $id) {
        name,
        age
    }
}`;

fetch("/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({ query: query4, variables: { id: 0 } }),
})
    .then((res) => res.json())
    .then((data) => console.log(data));

// 调用构建类型的代码
      fetch("/graphql2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: query4, variables: { id: 1 } }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
~~~

##### 3. 结果

![image-20200829231723019](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200829231723019.png)

#### 4. 修改请求发送

在常用的增删改查的过程中，刚才考虑了查，增删改 的过程我们还没有学习，graphql是通过Mutation关键字来发起修改数据库数据的请求的，让我们来看看怎么操作吧~**其实都一样，只不过我们需要一个新的声明mutation**

##### 1. 服务端的配置

+ 模板字符串配置
  + 我们重新定义一个type为Mutation的方法，之后我们在前端请求带有mutation的会直接打到对应的方法上
  + 这里我们将mutation的处理函数与query的写在一起，通过**与type中相同的方法名字来进行查询**
  + 如果是返回一个复杂类型的列表，模板字符串中只需要写成 [Student]即可

~~~typescript
// 创建一个新的学生~
// 为了便于查看操作的结果，我们将操作完成后的所有学生列表返回
// 定义一个新的mutation类型
var schema = buildSchema(`
  // 省略上面的内容
  type Query {
	// 省略query中的内容
  }

  type Mutation {
    addStudent(name: String!, age: Int!): [Student]
  }
`);

var root = {
  // 省略之前的query的方法
  addStudent: ({ name = "", age = -1 }) => {
    const newStu = new Student(name, age);
    studentList.push(newStu);
    return studentList;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

~~~

+ 使用类型构建的方法
  + 从上面的方法可以看到其实这种混合的写法，混在一起其实后期要进行维护辨认也是比较难的，用类型构建就会好许多
  + 其实操作和之前的query并没有什么不一样
  + 复杂类型列表，在构建类型中我们需要调用 new GraphqlList来定义它是一个列表类型

~~~typescript
// 定义一个mutationString
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

// 在schema中直接将其作为mutation传入，后续前端请求mutation语句时直接打到对应的mutation中进行操作
const schema2 = new GraphQLSchema({
  query: queryString,
  mutation: mutationString,
});
~~~

##### 2. 前端请求编写

+ 对于一个复杂类型的列表，我们在定义返回值的类型，我们**只需要按照复杂类型中需要的值进行填写，他会将每个复杂类型中我们需要的参数取出组成一个列表进行返回**

~~~typescript
let _query1 = `
    mutation AddStudent($name: String!, $age: Int!) {
        addStudent(name: $name, age: $age) {
            name,
            age
    }
}
`;
fetch("/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({
        query: _query1,
        variables: { name: "王六", age: 19 },
    }),
})
    .then((res) => res.json())
    .then((data) => console.log("add student 1 = ", data));

fetch("/graphql2", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify({
        query: _query1,
        variables: { name: "王七", age: 20 },
    }),
})
    .then((res) => res.json())
    .then((data) => console.log("add student 2 = ", data));
~~~

##### 3. 结果

![image-20200829234524818](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200829234524818.png)

好了~我们已经学会了 增删改查相应的功能~~~已经可以开心的用起来了，后面我会对node + orm + graphql的实践进行后续的探索~



