const EventEmitter = require('events').EventEmitter
class Notifier extends EventEmitter {
  constructor() {
    super()
    setInterval(() => {
      this.emit('new events', { title: 'new info'  })
    }, 3000)
  }
}

exports.Notifier = Notifier