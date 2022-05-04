# Node.js是什么

## 一、简介

### 1.1 Node.js是什么

**Q1: 在Nodejs里面写JS和在Chrome中写JS有什么不一样**

A1: 没有什么不一样，除了Nodejs里面没有Browser API，另外==增加了一些其他的API，让你能够控制整个计算机==

不看官网的那两句话，总的来说就是一个可以在任何地方跑起来的javascript引擎

### 1.2 Nodejs可以用来做什么

用nodejs最好的原因是可以做前后端同构

1. Web服务（服务端渲染、首屏速度优化等）
2. 构建工作流（gulp、webpack等）
3. 开发工具electron（vscode、wayward、twitch.tv等）



## 二、技术预研

### 2.1 Nodejs环境安装

略

### 2.2 第一个Nodejs程序

略

### 2.3 模块：CommonJS规范

#### 2.3.1 前端引入js的方法

前端加载js脚本的方法：通过script标签进行加载

**script引入的问题：**

1. 脚本变多需要手动管理加载顺序
2. 不同的脚本逻辑之间的调用，需要通过全局变量的方式进行管理
3. 没有html的话就没有办法运行

#### 2.3.2 commonjs模块规范

模块规范：

1. require引入
2. exports或module.exports输出（导出的内容是函数，对象，字符串等都可以）

注意：导出的exports和引入的exports是同一个引用，所以外部可以改变该引用内的值

```javascript
// index.js
console.log('require start')
const lib = require('./lib')
console.log('require end', lib)

lib.test = 'test'
```

```javascript
// lib.js
console.log('hello require')

exports.a = 1
exports.c = 2

setTimeout(() => {
  // 这里会输出{ a: 1, c: 2, test: 'test' }
  console.log(exports)
}, 1000)
```

**Q1: 如果module.exports和exports同时存在会怎么样**
如果两者同时存在的话，会以module.exports导出的元素为准，exports导出的内容会被忽略，但是**打印exports的内容还是存在的，可以理解为module.exports的优先级会比exports更高**，且不是同一个对象

> 原理可以理解为：只有module.exports，exports也是改的module.exports的值，但是当我们对module.exports进行赋值后就把整个对象替掉了，但是由于exports引用还在，所以这个地方还有另外一个exports的对象的引用，但实际导出的还是module.exports

#### 2.3.3 使用commonjs规范来写一个石头剪子布的游戏



需求：

1. 使用commonjs规范来引入函数
2. 电脑输了3次就退出游戏（process.exit）

```javascript
// index.js
const { game, GameResult } = require("./game");

process.stdin.on("data", (e) => {
  const playAction = e.toString().trim();
  let loseCount = 0
  const result = game(playAction);
  if (result === GameResult.win) {
    loseCount++
  } else {
    loseCount = 0
  }

  if (loseCount === 3) {
    console.log('你太厉害了我不玩了')
    process.exit()
  }
  
});

// game.js
const GameResult = {
  win: 0,
  lose: 1,
  equal: 2
}

exports.GameResult = GameResult
exports.game = function (playerAction) {
  if (
    playerAction != "rock" &&
    playerAction != "paper" &&
    playerAction != "scissor"
  ) {
    console.log("请输入rock或paper或scissor");
  } else {
    // 计算电脑出的东西
    var computerAction;
    var random = Math.random() * 3;
    if (random < 1) {
      computerAction = "rock";
      console.log("电脑出了石头");
    } else if (random > 2) {
      computerAction = "scissor";
      console.log("电脑出了剪刀");
    } else {
      computerAction = "paper";
      console.log("电脑出了布");
    }

    if (computerAction == playerAction) {
      console.log("平局");
      return GameResult.equal
    } else if (
      (computerAction == "rock" && playerAction == "scissor") ||
      (computerAction == "scissor" && playerAction == "paper") ||
      (computerAction == "paper" && playerAction == "rock")
    ) {
      console.log("你输了");
      return GameResult.lose
    } else {
      console.log("你赢了");
      return GameResult.win
    }
  }
};

```

### 2.4 npm

**Q1: npm是什么？**

npm是一个包的管理工具

**Q2: npm常用命令？**

1. 安装npm install  [packages]
2. 卸载npm uninstall [packages]
3. 使用其他镜像进行下载 npm install -g [packages] --registry [image url] / ==建议使用nrm来管理==

**Q3: npm的event-stream事件（花边）**：在event-stream包里面执行了恶意代码，赚取了非法的虚拟货币



### 2.5 Nodejs内置模块

**Nodejs系统介绍**

![企业微信截图_39d9f452-fd6e-4e29-8f66-04d9ffa1aa97](/Users/pidan/Library/Containers/com.tencent.WeWorkMac/Data/Library/Application Support/WXWork/Temp/ScreenCapture/企业微信截图_39d9f452-fd6e-4e29-8f66-04d9ffa1aa97.png)

这张Nodejs架构图，左边反应了是机遇Nodejs V8引擎将引用（javascript code）和底层的操作系统做了交互

右边说明了时间驱动和非阻塞的I/O模型来实现事件循环（Event Loop）和非阻塞（None Blocking）



**如何查看Nodejs源码**

Nodejs V8引擎实现和底层操作系统的交互主要是通过V8引擎的一些内置模块来实现的具体的内置模块,可以看官方的文档[nodejs官网](http://nodejs.cn/api/)

如何去查看nodejs的源码

1. clone对应的nodejs仓库
2. 在lib下找到对应的模块（lib/*）
3. 查看对应node_v8对应的c源码：（src/node_xx.cc）
4. 你必须知道的几个东西：
   1. internalBindings(一个调用v8引擎的方法，从v8引擎中获取相关的方法)
   2. primordials: v8注入在环境变量中的一个常量

NodeJs简单的调用机制：application -> v8 -> nodejs bindings -> os



**重要模块使用：Event Emiter模块**

观察者模式，实现的事件触发功能，一般用于注册时间的回调和触发注册的事件

观察者模式不好的点：1. 不知道观察者是谁，以及观察者是否存在 2. 

一个简单的功能

```javascript
const EventEmitter = require('events').EventEmitter
const create = require('crypto')

class Notifier extends EventEmitter {
  constructor() {
    super()
    setInterval(() => {
      this.emit('new events', { title: 'new info'  })
    }, 3000)
  }
}

const notify = new Notifier()

notify.addListener('new events', (e) => {
  console.log('receive new events ->', e)
})
```

**nodejs是一种在服务端可运行的，异步的，具有扩展性、复用性的JS技术**



### 2.6 异步：非阻塞



















