console.log('hello require')

exports.a = 1
exports.c = 2

setTimeout(() => {
  console.log(exports)
}, 1000)

module.exports = {
  b: 2, 
  d: 4
}