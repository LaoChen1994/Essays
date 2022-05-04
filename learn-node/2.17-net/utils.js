function parseStringToBuffer(str) {
  const buffer = Buffer.alloc(str.length * 2);

  for (let index = 0; index < str.length; index++) {
    const charCode = str[index].charCodeAt();
    buffer.writeInt16BE(charCode, index * 2);
  }

  return buffer;
}

function decodeBufferToString(buffer) {
  const stringList = []
  for (let index = 0; index < (buffer.length / 2); index++) {
    const decodeBuffer = buffer.slice(index * 2, (index + 1) * 2)
    const charCode = String.fromCharCode(decodeBuffer.readInt16BE())
    stringList.push(charCode)
  }

  return stringList.join('')
}

// 数字的写入方法
function writeNumber(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeInt16LE(value);
  return buffer;
}

module.exports = {
  parseStringToBuffer,
  writeNumber,
  decodeBufferToString
};
