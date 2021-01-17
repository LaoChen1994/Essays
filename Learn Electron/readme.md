# Electron 学习笔记

## 1. 开发环境搭建

### 1.1 前提条件

+ node
+ electron

### 1.2 创建脚本

#### 1.2.1 简单看一个官网的例子

```javascript
const { app, BrowserWindow } = require('electron')

function createWindow() {
    // 创建一个浏览窗口
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 如果需要进行node操作需要设置该配置为true
            nodeIntegration: true
        }
    })

    // 窗口内需要加载的页面，可以理解为webview
    // 感觉这里用单页应用就很舒服
    win.loadFile('./pages/home/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // 当没有窗口的时候关闭对应的app
        // 在macOS上是禁止的
        app.quit()
    }
})

app.on('activate', () => {
    // 没有可见窗口的时候创建新的浏览器窗口
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
```

#### 1.2.2 开启对应的应用

非全局安装场景：

> npx electron main.js

#### 1.2.3 打包

官网打包主要分为两部：

1. 安装electron-forge，他主要做了这么几件事

   > npx @electron-forge/cli import

   + 确认系统环境
   + 初始化git
   + 修改package.json 主要是注入了 make 命令
   + 下载打包需要的依赖

2. 使用make命令打包

   > npm run make

   打包过程中遇到的坑

   + 必须要填写author和description信息不然就会报错

#### 1.2.4 打开调试工具

以上面的例子为例，我们通过在窗口中调用webContents中的openDevTools来打开调试模式

```javascript
function createWindow() {
    // 创建一个浏览窗口
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 如果需要进行node操作需要设置该配置为true
            nodeIntegration: true
        }
    })

    // 窗口内需要加载的页面，可以理解为webview
    // 感觉这里用单页应用就很舒服
    win.loadFile('./pages/home/index.html')
    // 在下方打开调试模式
    win.webContents.openDevTools({ mode: 'bottom' })
}

```



### 2. 基础知识学习

### 2.1 应用程序结构

#### 2.1.1 Electron包括三个核心

+ Chromium: 用于显示网页内容
+ Node.js: 用于操作本地文件系统和操作系统
+ 自定义APIs：Electron自带的封装好的一些调用操作系统的函数

#### 2.1.2 Electron进程

+ 主进程：通过创建BrowserWindow来创建网页，其实相当于我理解创建了一个webview，在BrowserWindow里面创建渲染进程
+ 渲染进程：负责渲染对应的页面

【注意】进程间通信通过IPC，主要模块为：ipcMain和ipcRender

【注意】在主进程中去管理BrowserWindow所渲染的所有页面和渲染进程





