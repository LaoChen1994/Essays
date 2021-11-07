const net = require('net')
const { decodeBufferToString } = require('./utils')

const data = {
  rock: '石头',
  scissors: '剪刀',
  paper: '布' 
}

const server = net.createServer((socket) => {
  socket.on('data', function(buffer) {
    const action = decodeBufferToString(buffer)
    console.log('action ->', action)
    // Buffer.from会完成parseStringToBuffer的工作
    socket.write(Buffer.from(data[action] || '没有实际操作'))
  })
})

server.listen(4000)