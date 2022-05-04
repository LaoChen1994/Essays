# 利用yeoman搭建脚手架记录

## 1. 依赖安装

```bash
npm init
npm install -g yo
npm install yeoman-generator -D
```

## 2. 模版生成

创建的package.json的目录内容大致为

```json
{
    "name": "generator-my-bff",
    "version": "1.0.0",
    "description": "",
    "main": "./generators/app/index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [
        "yeoman-generator"
    ],
    "author": "huangxiaoyan",
    "license": "ISC",
    "dependencies": {
        "yeoman-generator": "^0.23.3"
    }
}

```

## 3. 构建一个简单的目录结构

因为在package.json中对应的入口文件为generators/app/index.js，所以我们只需要完成我们需要的代码，并通过index.js作为入口使用导出即可，我们也可以使用webpack打包我们的文件，但是demo就不搭建webpack的构建过程了

![image-20210912115807161](/Users/pidan/Library/Application Support/typora-user-images/image-20210912115807161.png)

## 4. 约定的函数

在yeoman中建议自定义的方法使用\_开头作为方法名，另外有一些约定的函数名有特殊的作用：

1. ==constructor==: 因为继承了yeoman-generator的Generator，所以需要初始化

   ![image-20210912120229268](/Users/pidan/Library/Application Support/typora-user-images/image-20210912120229268.png)

2. ==prompting==: 命令行交互执行这个函数，其中交互中比较重要的几个工具

   | 函数名      | 作用                                                         | 备注                                                         |
   | ----------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
   | this.prompt | 用于展示交互问答式的命令行调用函数，通过配置type可以定制使用哪种交互模式 | type类型：<br />1. input: 输入框<br />2. number: 数字交互<br />3. list: 选项<br />4. password: 密码（输入时隐藏）<br />5. confirm: 确认框（是/否） |
   | this.log    | 用于在bash中打印出内容，可以通过chalk库来实现各种颜色文案的打印 | this.log(chalk.yellow('xxx'))                                |

![image-20210912121308621](/Users/pidan/Library/Application Support/typora-user-images/image-20210912121308621.png)

## 5. 结果

使用方法：
```bash
npm install -g yo
npm install -g generator-my-bff
```

Then generate your new project:

```bash
yo my-bff
```



这个generator能够生成一个开箱即用的 node bff + react app的一个项目，可以使用一下



**更多用法可以参考**

[yeoman完全API文档](https://yeoman.github.io/generator/)



