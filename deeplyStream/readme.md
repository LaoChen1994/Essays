#   深入理解Node Stream

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

### 2.2 Stream原理分析

​		从1.1中我们可以了解，我们需要将一个文件中的流存放到一个暂存区中，然后往另外一个文件中写，这个问题其实就可以抽象为一个生产者和消费者问题的模型。在这个模型中，可以理解为生产者往不A断的往缓冲区中写入对应的数据，然后我们的消费者从缓冲区中不断消费对应的数据写入到自己的领域中。

**关键问题**：在这个简单的模型关系中我们需要保证的是：

1. 如果缓存区满了，我们不希望生产者仍继续生产数据(这里可能不是满了，而是达到一个阈值的时候我们就不会让生产者再继续生产信息)
2. 如果缓存区为空，消费者也不应该继续消费对应的数据

注意：这里引入一个专有名词叫**背压**，即当缓存池达到一定阈值，而导致生产者不继续生产的场景

**解决办法**：消息通知

**总结**：因此我们可以将Stream需要解决的问题分为三个部分

1. 生产者将内容写入缓存区
2. 消费者消费在缓存区中的数据
3. 对消费过程中的临界状态做对应的状态管理

**参考**

本部分原理主要参考[Stream内部机制](https://www.barretlee.com/blog/2017/06/06/dive-to-nodejs-at-stream-module/)

### 2.3 Nodejs源码分析指南

参考知乎大佬的文章：[nodejs是如何和libuv以及v8一起合作的](https://zhuanlan.zhihu.com/p/92305600)

在阅读nodejs的文件中，我们经常会看到类似代码

```javascript
const {
  MathFloor,
  NumberIsInteger,
} = primordials;
```

其中：`isMainThread`、`ownsProcessState`以及`process`、`require`、`primordials`和`internalBinding`六个C++函数供js文件调用。

### 2.4 buffer和Stream之间的互相转换

#### 2.4.1 buffer to Stream

```javascript
let Duplex = require('stream').Duplex;

function bufferToStream(buffer) {  
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
```

#### 2.4.2 Stream to Buffer

```javascript
function streamToBuffer(stream) {  
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers))
  });
}
```

#### 2.4.3 String to Buffer

```javascript
function stringToBuffer(str) {
    return Buffer.from(str)
}
```



## 3. Node Stream源码分析

### 3.1 通用基类Stream介绍

#### 3.1.1 Stream

代码位置：[legacy](https://github.com/nodejs/node/blob/master/lib/internal/streams/legacy.js)，这个文件中主要包括了三部分的工作：

1. 继承于events的Emitter类，实现事件的触发机制
2. 在原型上定义了pipe函数
3. 在emitter.prependListener外面包了一层定义了一个新的prependListener方法，主要是兼容了老的写法(我们就把他当作新的来用就行)

#### 3.1.2 pipe方法的定义

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
    // 手动调用pause，产生背压
    // 产生背压，停止生产  
    if (dest.writable && dest.write(chunk) === false && source.pause) {
      source.pause();
    }
  }

  // source绑定了data方法自动转换为流动模式
  // 这个时候就会自动将source中的chunk写入到dest中
  source.on('data', ondata);

  // 让生产者开始继续生产
  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  // 生产者写入速度过快，产生背压，生产者便停止生产
  // 这个时候当消费者消费完之后，会给生产者发送一个drain事件，告诉生产者你可以恢复生产了
  // 如果之前产生背压，这个时候应该写入完之后就触发drain事件，然后让生产者重新生产
  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  // 我理解就是当没有end和close方法的时候给个兜底的方法绑定一下子
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


  // close默认调了dest.close()
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
  // 调用dest的pipe事件
  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};
```

### 3.2 Readable Stream

#### 3.2.1 **可读流的运作模式**

1. 根据官方文档，目前可读流可运作于两种模式之一：流动模式(flowing)或暂停模式(paused)

	+ 流动模式中，数据自动从底层获取A，然后通过EventEmitter来触发相关回调
	+ 暂停模式中，必须手动调用Stream.read来读取数据块，一般刚创建的时候就是非流动模式
2. 模式之间的切换
   + flowing to paused
     + pause
     + unpipe
     + 注册readable事件的回调函数
   + paused to flowing
     + stream.resume
     + stream.pipe
     + 注册data事件的回调函数
3. 模式判断方式
   + 可以通过readable.readableFlowing这个字段来进行判断
     + null没有消费流数据的机制(开始的时候的状态)
     + true处于flowing状态下，一般通过pipe或resume来激活
     + false处于暂停模式，一般通过unpipe和pause来激活

#### 3.2.2 **flowing和no-flow流程模式**

##### 3.2.2.1 流动模式

+ 流动模式中需要解决的问题(生产者和消费者之间的状态控制)
  
  + 流动模式，再在Stream上绑定ondata方法就会触发这个模式
  + 背压问题
    + 手动pause停止生产，push返回为false停止生产
    + 由于缓存池内容大于阈值(highWaterMark)，可认为不可再写入缓存池，因此这个时候如果生产者push的时候会返回false，用于通知生产者该场景下停止生产。
  
+ 流动模式的使用例子

  ```javascript
  const Readable = require('stream').Readable
  
  class MyReadable extends Readable {
      constructor(dataSource, options) {
          super(options)
          this.dataSource = dataSource
      }
  
      // 继承Stream类别，一定要重写_read方法，再管道读取文件的时候会用
      // 调用this.push将数据推到buffer中
      _read() {
          const data = this.dataSource.makeData();
          this.push(data)
      }
  }
  
  const dataSource = {
      // 这里是一个[0, 1, 2, ..., 99]的数组
      data: Array.from({length: 100}).map((item ,i) => i + ''),
      // 每次读取时 pop 一个数据
      makeData() {
        if (!dataSource.data.length) return null;
        return dataSource.data.pop();
      }
    };
  
  const myReadable = new MyReadable(dataSource);
  myReadable.setEncoding('utf8');
  // 自动读取
  myReadable.on('data', (chunk) => {  
      console.log(chunk);
  });
  
  // 输出
  // 99, 98 .... 0
  ```

##### 3.2.2.2 暂停模式

+ 暂停模式
  + 当监听readable事件后会进入暂停模式，此时，生产者会一直向缓存池中添加数据，直到达到highWaterMark，消费者不会像流动模式那样自动消费对应的内容
  + 进入暂停模式后需要通过read方法，消费者逐个读取对应的信息
  + 因为暂停模式是消费者主动调用pause，后续开启需要消费者调用read, readable是消费者调用read之后的对应的回调
+ 【注】如果同时存在readable和data事件，则仍处于paused模式，如果此时移除readable事件，则可使readable重新流动起来
  
  + 【注】readable事件何时触发？当生产者将数据达到缓存池的时候，就会触发readable事件，和消费者是否正在消费其实没有必然关系，这点很重要，如果还是要监听消费者消费数据的事件，还得是data事件
  
+ 代码实例
    ```javascript
	// 暂停模式
    const myReadable = new MyReadable(dataSource);
  let i = 0;
    
    myReadable.setEncoding("utf8"); 
    myReadable.on("readable", () => {
      // readable方法是生产者产生的数据到缓存池的时候就会触发
      // _readableState中包含了许多中间状态
      // buffer可以获取缓存区的内容
      const buffer = myReadable._readableState.buffer
      console.log("readable -> ", i);
      i++;
    });
    
    console.log("read = ", i + ":", myReadable.read());
    console.log("read = ", i + ":", myReadable.read());
    console.log("read = ", i + ":", myReadable.read());
    
    // read =  0: 99
    // read =  0: 98
    // read =  0: 97
    // readable ->  0
    // readable ->  1
    // readable ->  2
    // readable ->  3
  ```
  
    


![Readable](https://github.com/barretlee/dive-into-node-stream/raw/master/graphic/Readable.png)

#### 3.2.3 Readable Stream源码分析

代码坐标：[readable.js](https://github.com/nodejs/node/blob/master/lib/internal/streams/readable.js)

该文件内主要输出两样东西

1. readable state
2. Readable 可读流的类

另外在Readable上挂了很多不同的工具函数，这部分也需要单独进行解析

##### 3.2.3.1 readable state

作用：将初始化的state塞到对应的ReadStream对象上。

目前readableState上的具体参数如图所示，其中有几个重要的属性：

1. objectMode： 这个是用来控制使得否返回的是buffer类型还是一个对象，如果返回是一个自定一对象的话，他在默认的缓存已经返回数据类型上都是不同的，当该值为true的时候返回的是一个对象，否则返回的是一个buffer类型
2. highWaterMark水位的高低，当水位高于阈值就会触发背压，如果是流动模式会自动触发pause
3. buffer： 一个用来存储data chunk的容器，这里重新封装了一个链表BufferList来做这个事情

![](E:\Learn\Essays\deeplyStream\images\Readable State.svg)

##### 3.2.3.2 Readable构造函数

Readable类做的事情：

1. 判断是否是双向流

2. 初始化readState

3. 初始化一些option中的属性

   1. _read

   2. _destroy

   3. _construct

   4. 为stream在abort的时候添加回调函数，提示stream已经被移除
      ```javascript
      // internal/streams/add-abort-signal.js
      // 这里只有当signal中有aborted属性时才会在stream destroy的时候去挂上abort的回调函
      module.exports.addAbortSignalNoValidate = function(signal, stream) {
        if (typeof signal !== 'object' || !('aborted' in signal)) {
          return stream;
        }
        const onAbort = () => {
          stream.destroy(new AbortError());
        };
        if (signal.aborted) {
          onAbort();
        } else {
          signal.addEventListener('abort', onAbort);
          eos(stream, () => signal.removeEventListener('abort', onAbort));
        }
        return stream;
      };
      ```
      
   5. 调用父类的构造器，继承Stream上的属性
   
   6. 调用lib/streams/destroy下的construct方法
   
      1. 将其constructed置为false，说明构造阶段结束。
      2. 绑定kConstruct事件，并注册回调函数，回调函数做的事：如果在option中的needReadable为true的话，会调用maybeReadable（这部分先不考虑）
   

##### 3.2.3.3 Readable 相关方法解析

###### 1. destroy

+ 坐标：lib/internal/streams/destroy

+ 作用：将对应的流关闭和删除，主要就是设置了closed，destroyed，errored为true

+ 主要步骤：

  + 获取可读可写流的state，如果是双向流拿可写流的state
  + 判断state中的destroyed状态，如果已被终止调用destroy的回调，否则就设置对应的destroy状态，调用_destroy函数

+ _destroy函数分析，主要就是设置对应的closed状态，并调用readablea/writable的\_destroy函数

  + readable的destroy主要就是调用了destroy的回调，其他没啥
  ```javascript
  function  _destroy(self, err, cb) {
    let called = false;
    // 这里的self就是Writable或者Readable的实例
    // 如果是readable默认的_destroy是不会有返回值的他只是调用cb
    const result = self._destroy(err || null, (err) => {
      const r = self._readableState;
      const w = self._writableState;
  
      called = true;
  
      checkError(err, w, r);
  
      if (w) {
        w.closed = true;
      }
      if (r) {
        r.closed = true;
      }
  
      if (typeof cb === 'function') {
        cb(err);
      }
  
      if (err) {
        // 再下一个时钟进行操作
        process.nextTick(emitErrorCloseNT, self, err);
      } else {
        process.nextTick(emitCloseNT, self);
      }
    });
    // 这类result属于非undefined的情况一般是
    // 在初始化的option的时候自己重新设置的destroy函数
    // 这种场景需要做额外处理
    if (result !== undefined && result !== null) {
      try {
        // Promiose场景
        const then = result.then;
        if (typeof then === 'function') {
          // 类似函数Function.prototype.call调用then.call(prototype, resolve, reject)的调用方法
          FunctionPrototypeCall(
            // then函数
            then,
            // prototype
            result,
            // resolve函数
            function() {
              if (called)
                return;
  
              const r = self._readableState;
              const w = self._writableState;
  
              if (w) {
                w.closed = true;
              }
              if (r) {
                r.closed = true;
              }
  
              if (typeof cb === 'function') {
                process.nextTick(cb);
              }
  
              process.nextTick(emitCloseNT, self);
            },
            // reject函数
            function(err) {
              const r = self._readableState;
              const w = self._writableState;
              err.stack; // eslint-disable-line no-unused-expressions
  
              called = true;
  
              if (w && !w.errored) {
                w.errored = err;
              }
              if (r && !r.errored) {
                r.errored = err;
              }
  
              if (w) {
                w.closed = true;
              }
              if (r) {
                r.closed = true;
              }
  
              if (typeof cb === 'function') {
                process.nextTick(cb, err);
              }
  
              process.nextTick(emitErrorCloseNT, self, err);
            });
        }
      } catch (err) {
        process.nextTick(emitErrorNT, self, err);
      }
    }
  }
  ```

###### 2. _undestroy

  + 坐标：lib/internal/streams/destroy

  + 作用：将对应的和close，errorEmitted，destroyed置为false

    ```javascript
    function undestroy() {
      const r = this._readableState;
      const w = this._writableState;
    
      // 对应r，w设置对应的标志位进行重置
      if (r) {
        r.constructed = true;
        r.closed = false;
        r.closeEmitted = false;
        r.destroyed = false;
        r.errored = null;
        r.errorEmitted = false;
        r.reading = false;
        r.ended = false;
        r.endEmitted = false;
      }
    
      if (w) {
        w.constructed = true;
        w.destroyed = false;
        w.closed = false;
        w.closeEmitted = false;
        w.errored = null;
        w.errorEmitted = false;
        w.ended = false;
        w.ending = false;
        w.finalCalled = false;
        w.prefinished = false;
        w.finished = false;
      }
    }
    ```

###### 3. push

  + 坐标：lib/internal/streams

  + 作用：手动向read()的缓冲区中插入数据

  + 主要步骤：调用了readableAndChunk,这个readableAndChunk主要用在push和unshift上，所以这个addToFront是一个控制向前插入还是向后插入，readableAndChunk中主要调用了addChunk方法。

  + push/unshift -> readableAndChunk -> addChunk

  + readableAndChunk做的事

      + 将string、unit8Array、buffer数据类型和encoding进行整合，整合为buffer和对应的encoding编码方式输出
      + 根据是否stream已经被close，是否有error做一些异常的报错，然后通过addChunk往state.buffer中向read()获取数据的缓冲区里塞数据
    
    ```javascript
    // addChunk方法主要做的事
    // 1. 调用data事件
    // 2. 将往bufferList中添加对应的chunk 
    function addChunk(stream, state, chunk, addToFront) {
      if (
        // 用于判断是否处于流动模式 true -> 处于流动模式
        state.flowing &&
        // 当前state长度为0，说明处于暂停状态
        state.length === 0 &&
        // 说明没有绑定data或readable事件
        !state.sync &&
        stream.listenerCount('data') > 0
      ) {
    	// 该种场景下一般是第一次写入的场景
        // 存在多个消费者的情况下需要
        if (state.multiAwaitDrain) {
          state.awaitDrainWriters.clear();
        } else {
          state.awaitDrainWriters = null;
        }
        // 触发data事件
        // 将chunk buffer作为参数传给对应的回调
        // 主要就触发了data事件
        stream.emit('data', chunk);
      } else {
        // 非第一次调用addChunk场景
        // 更新buffer信息
        state.length += state.objectMode ? 1 : chunk.length;
        // 这里的buffer主要是bufferList
        if (addToFront) state.buffer.unshift(chunk);
      else state.buffer.push(chunk);
    
      if (state.needReadable) emitReadable(stream);
      }
      // 持续的读取read()中的数据，当length < hwm的时候可以将数据先读取到buffer中
      // 有两种场景获取继续持续的读数据
      // 1. state.length < hwm -> buffer中没有更多的数据，且当前chunk非最后一个chunk(state.ended !== true)且当前未在读取数据(!state.reading -> 表示目前有一个挂起的reading操作)
      // 2. 目前处于流动模式且state.length > 0
      maybeReadMore(stream, state);
    }
    ```
    
    ```javascript
    Readable.prototype.push = function(chunk, encoding) {
      return readableAddChunk(this, chunk, encoding, false);
    };
    
    
    function readableAddChunk(stream, chunk, encoding, addToFront) {
      // stream: readable
      // chunk主要是需要手动插入的数据
      // encoding: 编码方式
      // addToFront: boolean -> 主要用来判断是前向插入还是后向插入
      debug('readableAddChunk', chunk);
      const state = stream._readableState;
    
      let err;
      // 这种场景下主要包含三种类型的chunk
      // string, buffer, Uint8Array
      // 最终都会chunk的类型 转为buffer
      if (!state.objectMode) {
        if (typeof chunk === 'string') {
          // 默认utf8
          encoding = encoding || state.defaultEncoding;
          if (state.encoding !== encoding) {
            // unshift调用的时候，从头插入
            if (addToFront && state.encoding) {
              // When unshifting, if state.encoding is set, we have to save
              // the string in the BufferList with the state encoding.
              // 转码 + string to buffer
              chunk = Buffer.from(chunk, encoding).toString(state.encoding);
            } else {
              chunk = Buffer.from(chunk, encoding);
              encoding = '';
            }
          }
        } else if (chunk instanceof Buffer) {
          encoding = '';
        } else if (Stream._isUint8Array(chunk)) {
          // 通过Stream._unit8ArrayToBuffer将unit8Array转为buffer
          chunk = Stream._uint8ArrayToBuffer(chunk);
          encoding = '';
        } else if (chunk != null) {
          err = new ERR_INVALID_ARG_TYPE(
            'chunk',
            ['string', 'Buffer', 'Uint8Array'],
            chunk
          );
        }
      }
    
      if (err) {
        errorOrDestroy(stream, err);
      } else if (chunk === null) {
        state.reading = false;
        // chunk为null就认为是最后一个chunk了
        onEofChunk(stream, state);
        // 只要存在chunk
      } else if (state.objectMode || (chunk && chunk.length > 0)) {
        if (addToFront) {
          if (state.endEmitted)
            errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
          // 没有error，就从头插入数据
          else addChunk(stream, state, chunk, true);
        } else if (state.ended) {
          errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
        } else if (state.destroyed || state.errored) {
          return false;
        } else {
          //从尾部插入数据的场景
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0)
              addChunk(stream, state, chunk, false);
            else maybeReadMore(stream, state);
          } else {
            addChunk(stream, state, chunk, false);
          }
        }
      } else if (!addToFront) {
      state.reading = false;
        maybeReadMore(stream, state);
      }
    
      // We can push more data if we are below the highWaterMark.
      // Also, if we have no data yet, we can stand some more bytes.
      // This is to work around cases where hwm=0, such as the repl.
      return (
        !state.ended && (state.length < state.highWaterMark || state.length === 0)
      );
    }
    ```

###### 4. unshift

参考push，只是将readable中的addToFront参数置为true

###### 5. isPaused

坐标：lib/internal/streams/readable.js

作用：将state中的paused和flowing状态进行设置

实现： kpaused -> true, flowing -> false

###### 6. setEncoding

坐标：lib/internal/streams/readable.js

作用：设置对应的编码方式

实现：调用string_dencoder将string类型进行转码，先将buffer中的数据读出来，然后通过string decoder转码后再协会buffer中

###### 7. read

坐标: lib/internal/streams/readable.js

作用：从缓冲区中读取数据

注意：如果我们自定义一个readable继承了Readable，我们可以手动重写read函数或_read方法来自定义读取数据的方法


## 2. Node Stream应用

## 3. node-csv源码解析

### 3.1 csv数据格式原理分析

### 3.2 node-csv应用实例

### 3.3 node-csv源码结构拆分

## 4. 总结






 ```

 ```