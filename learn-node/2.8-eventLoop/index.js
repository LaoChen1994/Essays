const eventLoop = {
  queue: [],
  loop() {
    while (this.queue.length) {
      const cb = this.queue.shift()
      cb()
    }

    setTimeout(() => this.loop.call(this), 50)
  },
  add(callback) {
    this.queue.push(callback)
  },
  init() {
    this.loop()
    return this
  }
}

myLoop = eventLoop.init()

setTimeout(() => {
  myLoop.add(() => {
    console.log(1)
  })
}, 100)

setTimeout(() => {
  myLoop.add(() => {
    console.log(2)
  })
}, 250)

