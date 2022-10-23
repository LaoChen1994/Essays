function runInPromiseReduce(promises, value) {
    return promises.reduce((p, fn) => {
        if (p instanceof Promise) {
            return p.then(fn)
        } else {
            return fn(p)
        }
    }, value)
}

const f1 = (value) => new Promise((res, rej) => {
    setTimeout(() => {
        res(value + 1)
    }, 1000)
})

const f2 = (value) => new Promise((res, rej) => {
    setTimeout(() => {
        res(value + 2)
    }, 1000)
})

const rlt = runInPromiseReduce([() => 3, f1, f2]).then(data => console.log(data))

const rlt2 = runInPromiseReduce([() => 1, val => val + 2, val => val + 3])
console.log(rlt2)