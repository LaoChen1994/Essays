const http = require('http');
const fs = require('fs')
const path = require('path')

http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200);
    res.end()
    return
  }
  
  res.writeHead(200)
  fs.createReadStream(path.resolve(__dirname, './index.html')).pipe(res)
}).listen(3000, () => {
  console.log('server is on 3000')
})