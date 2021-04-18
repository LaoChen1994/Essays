const Readable = require("stream").Readable;
const process = require('process')

class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }

  _read() {
    const data = this.dataSource.makeData();
    console.log('flowing -> ', this._readableState.flowing)
    console.log('needReadable -> ', this._readableState.needReadable)
    console.log('bufferList -> ', this._readableState.buffer.head)
    this.push(data);
  }
}

const dataSource = {
  data: Array.from({ length: 5 }).map((item, i) => i + ""),
  // 每次读取时 pop 一个数据
  makeData() {
    if (!dataSource.data.length) return null;
    return dataSource.data.pop();
  },
};

// 流动模式 自动触发
// const myReadable = new MyReadable(dataSource);
//     myReadable.setEncoding('utf8');
//     myReadable.on('data', (chunk) => {
//     console.log(chunk);
// });

// 暂停模式
const myReadable = new MyReadable(dataSource);
myReadable.setEncoding("utf8");
myReadable.resume()

// myReadable.on("readable", () => {
//     const buffer = myReadable._readableState.buffer
//     console.log('buffer hightWaterMark = ', myReadable._readableState.highWaterMark)
//     console.log(`buffer header = ${JSON.stringify(buffer.head)}, buffer tail = ${JSON.stringify(buffer.tail)}`)
//     // let chunk;
//     // while (null !== (chunk = myReadable.read())) {
//     //     console.log(`Received ${chunk.length} bytes of data. Chunk is ${chunk}`);
//     // }
// });

// myReadable.on('data', (chunk) => {
//     console.log(chunk)
// })

// console.log("read = ", i + ":", myReadable.read());
// console.log("read = ", i + ":", myReadable.read());
// console.log("read = ", i + ":", myReadable.read());

// 同时readable和data事件

// const fs = require('fs')
// const path = require('path')

// const rs = fs.createReadStream(path.resolve(__dirname, './test.js'))

// rs.on('data', (chunk) => {
//   console.log('data -> ', chunk)
// })

// rs.on('readable', () => {
//   // readable需要手动调用read事件获取对应的data
//   console.log('readable ->', rs._readableState.buffer.head.data.toString())
//   console.log(rs.read())
// })
