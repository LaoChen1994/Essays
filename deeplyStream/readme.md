# 深入理解Node Stream

# 0. 参考文章

[深入理解Node Stream内部机制](https://www.barretlee.com/blog/2017/06/06/dive-to-nodejs-at-stream-module/)

[NodeJS Stream流原理分析](https://juejin.cn/post/6844903681259733006#heading-24)

[NodeJS Stream源码](https://github.com/nodejs/node/tree/master/lib/internal/streams)

## 1. Node Stream简介

### 1.1 为什么要使用Stream

Stream翻译成中文为流，我们为什么要使用这个东西呢，我们来试想这么一个场景，现在我们需要将一个文件A中的内容copy一份到文件B中，我们需要做什么？

**场景1：没有Stream之前**

1. 我们需要先fs.open打开文件A
2. 我们通过file.read将对应的文件A的内容暂时读取到内存中
3. 我们通过fs.write将文件写入到文件B中
4. 使用完后我们需要将文件A和文件B关闭
5. 完成

乍一眼看来这个流程没有问题，但是这个场景只能对小文件有效，如果是大文件的话。。。。。那么很有可能文件A无法通过内存进行暂存。

**解决方案**：因此这个内存成为了我们这个方案最大的瓶颈，如果我们需要读取的文件足够大，我们对内存的要求就会越来越高，因此，我们在想，如果我们直接能将文件A的内容导入到文件B就好了，而Stream就是做这个事情的，他让我们的文件流就像水流一样，直接从A流到B

**Stream的应用场景**

目前的使用场景：请求流(http中的request)、响应流(http请求中的response对body的处理)、文件流(fs)，socket流甚至是console.log都是用Stream来封装的。

### 1.2 Node Stream使用的基础例子

具体基础使用的例子可以看： [基础使用例子](https://segmentfault.com/a/1190000016654903)

简单概括就是，我们通过fs + stream的方式来创建读写流，即可将1.1中的例子简单改为

1. 通过fs.createReadStream创建文件A对应的可读流
2. 通过fs.createWriteStream创建文件B对应的可写流
3. 通过pipe方法建立管道，将可读流里的内容直接写入可写流即可

## 2. Node Stream 前置部分

### 2.1 NodeJS events模块

#### 2.1.1 起因

打开[Stream源码的legacy文件](https://github.com/nodejs/node/blob/master/lib/internal/streams/legacy.js), 我们可以发现Stream这个对象本身是继承于events（题外话：其实很多包都继承于events，例如koa），那么我们先来看看events是个怎么样的模块，为啥频频出现。

**本质**：本质上来看events主要是一个event bus的事件触发器(我理解)，设计模式类似发布订阅，我们将所对应的事件和回调注册到events上，然后通过emit方法来触发对应的事件回调，你可以理解就是做这个事情的

**注**：这里不对模块源码进行分析，只对部分方法及进行阐述

#### 2.1.2 主要方法分析

详细说明可以参考nodejs文档[events](http://nodejs.cn/api/events.html#events_emitter_addlistener_eventname_listener)

+ emitter.addListener/emiter.on：两个方法一样，就是不同叫法将对应的callback绑定到某个事件上，这种方法是加到对应事件回调函数栈的尾部
+ emitter.prependListener: 将方法添加到监听器数组的开头，和on相反  
+ emitter.emit: 触发对应的事件
+ emitter.once:  添加单词监听器到某个事件上，说白了就是绑定一个只触发一次的事件
+ emitter.removeListener/emiter.off: 从某个事件上移除某个事件
+ 其他的应该这次暂时用不到了就不做介绍了

## 3. Node Stream源码分析

### 3.1 Stream背后的问题

​		从1.1中我们可以了解，我们需要将一个文件中的流存放到一个暂存区中，然后往另外一个文件中写，这个问题其实就可以抽象为一个生产者和消费者问题的模型。在这个模型中，可以理解为生产者往不A断的往缓冲区中写入对应的数据，然后我们的消费者从缓冲区中不断消费对应的数据写入到自己的领域中。

**关键问题**：在这个简单的模型关系中我们需要保证的是：

1. 如果缓存区满了，我们不希望生产者仍继续生产数据

2. 如果缓存区为空，消费者也不应该继续消费对应的数据


**解决办法**：消息通知

**总结**：因此我们可以将Stream需要解决的问题分为三个部分

1. 生产者将内容写入缓存区
2. 消费者消费在缓存区中的数据
3. 对消费过程中的临界状态做对应的状态管理

### 3.2 Stream 用法及原理分析

#### 3.2.1 参考文档

本部分原理主要参考[Stream内部机制](https://www.barretlee.com/blog/2017/06/06/dive-to-nodejs-at-stream-module/)

#### 3.2.2 Readable Stream

**可读流的运作模式**

1. 根据官方文档，目前可读流可运作于两种模式之一：流动模式(flowing)或暂停模式(paused)

	+ 流动模式中，数据自动从底层获取A，然后通过EventEmitter来触发相关回调
	+ 暂停模式中，必须手动调用Stream.read来读取数据块
2. 模式之间的切换
   + flowing to paused
     + pause
     + unpipe
   + paused to flowing
     + stream.resume
     + stream.pipe
3. 模式判断方式
   + 可以通过readable.readableFlowing这个字段来进行判断
     + null没有消费流数据的机制(开始的时候的状态)
     + true处于flowing状态下，一般通过pipe或resume来激活
     + false处于暂停模式，一般通过unpipe和pause来激活

**flowing和paused流程模式**



![Readable](https://github.com/barretlee/dive-into-node-stream/raw/master/graphic/Readable.png)



### 3.2 通用Stream(基类) 介绍

#### 3.2.1 Stream

代码位置：[legacy](https://github.com/nodejs/node/blob/master/lib/internal/streams/legacy.js)，这个文件中主要包括了三部分的工作：

1. 继承于events的Emitter类，实现事件的触发机制
2. 在原型上定义了pipe函数
3. 在emitter.prependListener外面包了一层定义了一个新的prependListener方法，主要是兼容了老的写法(我们就把他当作新的来用就行)

##### 3.1.1.1 pipe方法的定义

**源码如下**，在分析之前我们需要定义几个东西：

1. source为数据的源头，即生产者
2. dest为数据的目的地，即消费者

**代码实现步骤分析**

已经都在注释里面了，具体一些细节会单独写在下面：

1. 一般调用的主体就是生产者，所以即为this

```javascript
Stream.prototype.pipe = function(dest, options) {
  // 生产者即为调用主体
  const source = this;

  function ondata(chunk) {
    if (dest.writable && dest.write(chunk) === false && source.pause) {
      source.pause();
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  let didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // Don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      this.emit('error', er);
    }
  }

  prependListener(source, 'error', onerror);
  prependListener(dest, 'error', onerror);

  // Remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);
  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};
```





## 2. Node Stream应用

## 3. node-csv源码解析

### 3.1 csv数据格式原理分析

### 3.2 node-csv应用实例

### 3.3 node-csv源码结构拆分

## 4. 总结





