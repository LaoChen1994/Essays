# Service Worker学习笔记

## 1. Service是啥

### 1.1 Service Worker介绍

先来看mdn上的介绍

>  Service workers 本质上充当 Web 应用程序、浏览器与网络（可用时）之间的代理服务器。这个 API 旨在创建有效的离线体验，它会拦截网络请求并根据网络是否可用采取来适当的动作、更新来自服务器的的资源。它还提供入口以推送通知和访问后台同步 API。

从上面的描述我们可以总结成两点：

1. service worker是用来增加网页离线体验的一种离线缓存方式
2. 通过拦截网络请求来判断是否采取某些适当的动作，是否要向服务端发送请求获取对应的资源

**曾经离线缓存的方式是application cache，但是目前已经被web标准废弃**

### 1. 2 service worker特点

[参考博文](https://segmentfault.com/a/1190000022103402)

+ service本质是一个特殊的web worker的一个web后台运行的脚本程序，通过消息通知的方式来通知UI主线程
+ 本质上充当了介于服务器和web浏览器之间的代理服务器，可以拦截全站的请求做出相应的动作
+ 可以有效解决弱网和无网时的离线体验
+ 该脚本是事件驱动的具有生命周期的
+ 可以支持推送，让开发者自己控制管理的内容和版本
+ 可以访问DB
+ 后台数据同步
+ 响应来自其它源的资源请求
+ 集中接收计算成本高的数据更新，比如地理位置和陀螺仪信息，这样多个页面就可以利用同一组数据
+ 在客户端进行CoffeeScript，LESS，CJS/AMD等模块编译和依赖管理（用于开发目的）
+ 后台服务钩子
+ 自定义模板用于特定URL模式
+ 性能增强，比如预取用户可能需要的资源，比如相册中的后面数张图片

## 2. service worker的使用方法

[参考mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)

### 2.1 注意点

service worker的**兼容性**如下，且不可通过polyfill注入的的方式来兼容，因此我们在一些需要考虑兼容性的场景下慎用

![image-20210213201916270](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20210213201916270.png)

### 2.2 service worker 特性

#### 2.2.1 使用规则

+  不能直接访问/操作DOM，只能操作部分web api例如promise, cache, fetch
+ 需要时直接唤醒，不需要自动休眠(即install安装脚本后对应的代码直接就缓存了，关闭当前网页对应的缓存脚本也不会消失)
+ 离线缓存内容开发者可控
+ install后除非手动卸载
+ 必须在https环境下才能工作
+ 广泛使用Promise

#### 2.2.2 生命周期

+ 注册（register）
+ 安装（install）
+ 激活（activated）

### 2.3 使用方法

#### 2.3.1 注册

```javascript
if (navigator.serviceWorker) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/static/sw.js', { scope: '/static/' })
            .then(function(registration){
                console.log(registration.scope)
             })
    })
}
```

**注意**

+ 只能对对应scope域下的页面有效
+ 不支持越域
+ 如果注册的脚本和当前页面之间存在跨域的问题，可以通过nginx转发来调整
+ 但是如果服务端指定了header中的service-worker-allowed，且越域的域范围小于header指定的域，则可以支持越域
+ 支持注册多个不同scope下的service worker

#### 2.3.2 安装

```javascript
this.addEventListener('install', function(event) {
    caches.open('my-cache-1')
        .then(function(cache) {
            return cache.addAll([
                '/index.js',
                '/index.css'
            ])
        })
})
```

+ caches是支持离线缓存的web api，返回值均是promise
+ 通过cache.addAll传入的数组来判断需要缓存的静态资源列表
+ 这里我们只拦截对应的js和css文件

#### 2.3.3 查看缓存

```javascript
caches
    .match("/static/index.css")
    .then((data) => data.text())
    .then((res) => console.log(res))
// 输出结果
// h1 { 
//     color: red;
// }
```



#### 2.3.3 拦截请求

```javascript
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(resp) {
        // 如果匹配到对应的请求，就从离线缓存中加载
        return resp || fetch(event.request).then(function(response) {
          return caches.open('my-cache-1').then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
```

+ 通过cache.put可以将对应的









