Function.prototype.bind2 = function(context, ...args) {
    if (!context) {
        context = {}
    }

    let self = this
    const fn = function (...args2) {
        // 如果是构造函数场景这个this已经是实例了
        // 所以这个时候this的实例指向对应的构造函数的时候，说明是构造函数场景
        // 在obj.__proto__ = constructor.prototype所以这个时候new时候新生成的obj实例的原型链已经是fn了
        self.call(this instanceof fn ? this : context, ...args, ...args2)
    }

    fn.prototype = this.prototype

    return fn
}

var foo = {
    value: 1
}

var bar = function (a, b) {
    console.log(this.value)
    console.log(a + b)
}

const fn = bar.bind2(foo, 1);
// fn(2)

const a = new fn(2)