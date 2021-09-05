function foo(arg: unknown) {
  const argIsString = typeof arg === "string";
  if (argIsString) {
      arg.toUpperCase()
  }
}

function addOne(a: number) {
  return a + 1
}

let a: string | number = 1

const isString = typeof a === 'string'
const isNumber = typeof a === 'number'

if (isString) {
  a.toUpperCase()
}

if (isNumber) {
  addOne(a)
}