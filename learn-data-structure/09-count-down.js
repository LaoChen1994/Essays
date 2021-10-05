function countDown(num) {
  if (num < 0) return
  console.log(num)

  countDown(num - 1)
}

countDown(10)

function Fibonacci(num) {
  if (num === 1) return 1

  return num * Fibonacci(num - 1)
}

const rlt = Fibonacci(5)
console.log(rlt)