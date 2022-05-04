## 1. Rollup初识

### 1.1 安装环境

> yarn add global rollup

### 1.2 使用配置文件

1. 在根目录下创建rollup.config.js

```javascript
export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs'
  }
}
```

2. 使用命令行引入用-c参数带上对应的配置文件即可

```bash

rollup -c ./rollup.config.js

```

### 1.3 文件的输入和输出

input指定文件的输入,output指定文件的输出。

format用来指定文件输出的格式:
  + cjs: 代表commonjs
  + es用来代表esModule
  + amd和umd不多解释

单文件的配置如下，如果是多文件export的，就是一个数组。

```javascript

export default {
  input: "./src/index.js",
  output: {
    file: "./dist/index.js",
    format: "cjs",
  },
};

```

### 1.4 插件的使用

#### 1.4.1 resolve

作用：用于解析文件的路径,rollup无法识别node_modules中的包，需要使用rollup-plugin-node-resolve这个插件，来识别对应路径中的包

**安装插件**

```bash
<<<<<<< HEAD:learn-roll-up/guide/readme.md

yarn add @rollup/plugin-node-resolve

```

**使用方法**

```javascript
import resolve from '@rollup/plugin-node-resolve'

export defult {
  //...省略上述配置
  plugins: [resolve()]
}

=======
yarn add @rollup/plugin-node-resolve
>>>>>>> 100fd79a76f0fe959c95f1ff005f3c8ca7bab78d:learn-rollup/guide/readme.md
```
#### 1.4.2 commonjs

<<<<<<< HEAD:learn-roll-up/guide/readme.md

#### 1.4.2 commonjs

作用：将node_modules中的cjs转换为esm

=======
作用：将CJS -> ESM 通常和resolve插件一起使用

安装插件

```bash
yarn add rollup-plugin-commonjs
```

#### 1.4.3 typescript

作用：将ts文件进行解析，类似ts-loader

安装插件

```bash
yarn add @rollup/plugin-typescript
```

#### 1.4.4 terser

作用：丑化和压缩js文件

tips：以前用的uglyjs，现在自己用terser更多一点

安装插件

```bash
yarn add rollup-plugin-terser
```
>>>>>>> 100fd79a76f0fe959c95f1ff005f3c8ca7bab78d:learn-rollup/guide/readme.md
