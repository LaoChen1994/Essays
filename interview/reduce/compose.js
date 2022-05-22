function compose (...fns) {
    if (fns.length === 0) {
        return val => val
    }

    if (fns.length === 1) {
        return fns[0]
    }

    return fns.reduce((a, b) => (...args) => a(  b(...args)))
}

const fn1 = (a) => {
    console.log(1, a)
    return a + 1
}

const fn2 = (a) => {
    console.log(2, a)
    return a + 2
}

const fn3 = (a) => {
    console.log(3, a)
    return a + 3
}

const rlt = compose(fn3, fn2, fn1)(1)
console.log(rlt)
