class Base {
  value = 1;

  constructor() {
    console.log(this.value)
  }
}

function func() {
  return Math.random()
}

class A extends Base {
  xx = 2
  constructor() {
    func()
    super()
  }
}

const base = new A()