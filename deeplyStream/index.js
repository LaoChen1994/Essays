const Readable = require("stream").Readable;

class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }

  _read() {
    const data = this.dataSource.makeData();
    this.push(data);
  }
}

const dataSource = {
  data: Array.from({ length: 100 }).map((item, i) => i + ""),
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
myReadable.on("readable", () => {
    const buffer = myReadable._readableState.buffer
    console.log('buffer hightWaterMark = ', myReadable._readableState.highWaterMark)
    console.log(`buffer header = ${JSON.stringify(buffer.head)}, buffer tail = ${JSON.stringify(buffer.tail)}`)
    // let chunk;
    // while (null !== (chunk = myReadable.read())) {
    //     console.log(`Received ${chunk.length} bytes of data. Chunk is ${chunk}`);
    // }
});

// myReadable.on('data', (chunk) => {
//     console.log(chunk)
// })

// console.log("read = ", i + ":", myReadable.read());
// console.log("read = ", i + ":", myReadable.read());
// console.log("read = ", i + ":", myReadable.read());
