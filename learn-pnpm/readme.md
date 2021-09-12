# pnpm学习笔记

## 1. 参考资料

1. [pnpm官网](https://pnpm.io/zh/)
2. [pnpm 大行其道，npm 已是风烛残年？](https://mp.weixin.qq.com/s/3qZT_Y3wuKJNNpHmTIF1Ew)

## 2. 简介

**Q1: pnpm是什么**

A1: 是一个类似yarn和npm的包管理工具



**Q2: pnpm和yarn和npm相比的区别或优势**

1. 节约磁盘空间，因为pnpm会有一个hard link的方式来引入包，不会像npm或yarn一样，100个项目同一个版本的依赖安装100次
2. 非扁平化的node_modules，包依赖的node_modules在包内部而不是统一到项目的根目录下进行下载
3. store机制，因为1中所谈hard link会从store去找是否已经在某个store中安装过依赖了，如果安装过会直接去hard link



## 2. pnpm的安装

```bash
yarn global add pnpm

npm install -g pnpm
```

安装完成后我们发现他安装了两个命令：

1. pnpm
2. pnpx

![](./image/pic-1.png)



## 3. cli命令对比

| npm 命令        | pnpm 等效                                        |
| --------------- | ------------------------------------------------ |
| `npm install`   | [`pnpm install`](https://pnpm.io/zh/cli/install) |
| `npm i <pkg>`   | [`pnpm add <pkg>`]                               |
| `npm run <cmd>` | [`pnpm <cmd>`]                                   |



【pnpx】已废弃，现在可以使用pnpm exrc 或者 pnpm dlx来代替

> 他从源获取包，但不将它安装为依赖项，热加载它，并运行任何它暴露的默认二进制命令



## 4. 几个疑问

**Q1: 两种包管理方式的node_modules的结构**

**A1: **

npm/yarn: 每个对应依赖所依赖的包都会下载到运行 npm install / yarn的根目录下

pnpm：将下载的依赖放到store下，然后在安装包的时候引用的是store中的hard link来引入已经安装过的包的版本



**Q2: 老工程的从npm换到pnpm之后运行报错怎么办**

**A2: **

因为两者的node_modules的结构存在异常，pnpm是管理到每个包内部的，而npm是拍平的，可以暂时通过增加`--shamefully-flatten`来解决

```bash
pnpm install --shamefully-flatten
```



**Q3: hard link和symlink**

**A3: **

新仓库引用老的包，通过hard link的方式从**全局的store中找到对应hardlink的映射关系**

找到对应的hard link对应的地址，**真正引入包通过的symlink的方式**



**Q4: store如果随着依赖包的增多越来越大怎么办**

**A4:** 使用pnpm store prune，清除没有被引用的包



## 5. Monorepo支持

**Q1: 为什么要使用monorepo？**

**A1:** 将应用中独立的部分拆成多个packages，然后**各个包中可以相互引用，极大解决了代码无法被重用的问题**



**Q2: 为什么合适使用pnpm？**

![](./image/pic-3.png)

因为在monorepo这种场景下，我们经常熟悉的目录结构为

==tips==：**这种依赖结构导致多个仓库可能会有相同的依赖，如果重复安装会浪费很多磁盘空间。（lerna的公共依赖其实也无法跨应用）**

pnpm在monorepo上的优势：

1. 而pnpm通过hard link保证相同的包都是通过引用的方式导入可以解决
2. 依赖平铺导致，我们在写代码时候引入的包A可能本身应用没有依赖，是依赖的包B所依赖的，这样如果有一天依赖的包B更新后不使用依赖A，那么在我们应用中我们引入的包A就可能找不到，这样容易导致线上报错



## 6. pnpm + workspace实践

创建对应的文件目录：

![](/Users/pidan/Learn/Essays/learn-pnpm/image/pic-4.png)

### 6.1 创建workspace配置文件

创建配置文件pnpm.packages.yaml

```yaml
packages:
  - 'packages/**'
  - '!test/**'
```

配置文件的包包括packages文件夹下的任意单独的包

指定想要拆出单独的包通过`路径直接匹配`即可，不想要单独分包通过`!`加以区分



### 6.2 安装对应的依赖包

```bash
pnpm add react react-dom -w
pnpm add moment -r --filter repo1
```

-w: 在执行命令的根结点下进行安装依赖（root）

-r: 指定安装在某一个目录下，不安装在公共目录下

--fiter：指定某个子包的目录



### 6.3 配置monorepo

**步骤一**：配置repo1中的相关代码，并导出

```javascript
const moment = require('moment')

const formatDateTime = date => moment(date).format('YYYY-MM-DD HH:mm:ss')

module.exports = {
  formatDateTime
}
```

**步骤二**：在repo2中加载repo1的包

```bash
pnpm add repo1 -r --filter repo2
```

**步骤三**：在repo2中使用repo1中的函数

```javascript
const { formatDateTime } = require('repo1')

const time = formatDateTime(new Date().getTime())

console.log(time)
// 2021-09-12 20:04:33
```



### 6.4 package.json的变化

我们在repo2的packages中可以看到，增加了repo1的依赖

![image-20210912200858644](/Users/pidan/Library/Application Support/typora-user-images/image-20210912200858644.png)









