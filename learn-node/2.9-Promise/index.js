var promise = new Promise((res, rej) => {
  setTimeout(() => {
    Math.random > 0.5 ? res() : rej(Error('error'))
  }, 500)
}).then(() => {
  console.log('resolve')
}).catch(() => {
  console.log('reject')
})

console.log(promise)

setTimeout(() => {
  console.log(promise)
}, 800)