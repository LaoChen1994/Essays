const glob = require('glob')
const path = require('path')

// 阻塞IO
console.time('glob sync')
result = glob.sync(path.resolve(__dirname, './**/*'))
console.timeEnd('glob sync')
console.log('end 1')


// 非阻塞IO
console.time('glob')
result = glob(path.resolve(__dirname, './**/*'), (err, res) => {
  console.log('ends')
})
console.timeEnd('glob')
console.log(1 + 1)


