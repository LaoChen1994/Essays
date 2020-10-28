class EventBus {
  constructor() {
    this._events = new Map()
    this._maxListener = 10
  }

  on(type, fn) {
    const handler = this._events.get(type)
    if (!handler) {
      this._events.set(type, [fn])
    } else {
      handler.push(fn)
    }
  }

  emit(type, ...args) {
    let handlers = this._events.get(type)
    if(handlers) {
      (handlers || []).forEach(handler => {
        handler.call(this, args)
      });
    }

    return true
  }

  off(type, fn) {
    const _hanlder = this._events.get(type)
    if(_hanlder) {
      _hanlder.splice(_hanlder.findIndex(fn), 1)
    }
  }
}


const eventBus = new EventBus()
let n = 0

const emitEvent1 = (props) => {
  const [property, value] = props
  console.log(`${property} is changed, newValue = ${value}`)
}

const emitEvent2 = (props) => {
  const [property, value] = props
  console.log('*************************************')
  console.log(`${property} is changed to ${value}, this is Event 2`)
  console.log('*************************************')
}

const genProxy = (obj) => {
  const name = n++

  eventBus.on(name, emitEvent1)
  eventBus.on(name, emitEvent2)

  return new Proxy(obj, {
    set(target, property, value) {
      console.log('old target = ', target)
      console.log('target = ', target)
      console.log('property = ', property)
      console.log('value = ', value)
      eventBus.emit(name, property, value)
      target[property] = value

      return true
    }
  })
}

const a = genProxy({a: 1, b: 2})

a.a = 3
a.b = 2

console.log(a)

