const net = require("net");
const {
  parseStringToBuffer,
  writeNumber,
} = require("./utils");

const socket = new net.Socket({});
const actionList = ["rock", "scissors", "paper"];

const numberBuf = writeNumber(123);

console.log("num buffer ->", numberBuf);

const buff1 = parseStringToBuffer(actionList[0]);

socket.connect({
  host: "127.0.0.1",
  port: 4000,
});

// 半双工通信，可以发送可接受信息
// 但是需要错开
socket.write(buff1);
socket.on("data", (buffer) => {
  console.log(buffer.toString());
});
