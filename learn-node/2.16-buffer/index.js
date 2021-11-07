const buffer1 = Buffer.from("Hello World");
const buff2 = Buffer.from([1, 2, 3, 4]);

const buff3 = Buffer.alloc(20);

buff3.writeInt16BE(100);
buff3.writeInt8(100, 1);

console.log(buff3);
console.log(buff3.readInt16BE());

const fs = require("fs");
const path = require("path");

const protobuf = require("protocol-buffers");
const schema = protobuf(
  fs.readFileSync(path.resolve(__dirname, "./test.proto"), "utf-8")
);

const codeSchema = schema.Column.encode({
  id: 1,
  name: "Node.js",
  price: 100,
});

console.log(codeSchema);

const decodeSchema = schema.Column.decode(codeSchema);

console.log(decodeSchema);
