import { Desp } from './desp'
import { effect } from './effect'

function createRef(initVal) {
    let _value = initVal;
    let desp = new Desp()

    return {
        get value() {
            desp.depend()
            return _value
        },
        set value(value) {
            _value = value
            desp.notify()
        }
    }
}

const getCommonHandler = (desp) =>  ({
    get(target, property) {
        desp.depend()
        return target[property]
    }, 
    set() {
        Reflect.set(...arguments)
        desp.notify()
        return true
    }
})

function createProxyRef(initVal) {
    let _value = initVal
    let desp = new Desp()

    let proxy = new Proxy({ value: _value }, getCommonHandler(desp))

    return proxy
}


// 想要实现的功能
const state = createProxyRef(1)
const strState = createProxyRef("")

effect(() => {
    console.log('effect = ', state.value)
})

effect(() => {
    console.log('effect2 = ', state.value)
})

effect(() => {
    console.log('effect3 = ', strState.value)
})

setInterval(() => {
    state.value++;
}, 1000)

setInterval(() => {
    strState.value = strState.value + 'a'
}, 500)