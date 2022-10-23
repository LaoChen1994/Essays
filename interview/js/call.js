// 模拟实现一个call方法
Function.prototype.call2 = function(context, ...args) {
    if (context === null) {
        context = {}
    }
    context.fn = this;
    const result = context.fn(...args);
    delete context.fn;

    return result
}

var foo = {
    value: 1
}

var bar = function (a, b) {
    console.log(this.value)
    console.log(a + b)
}

bar.call2(null, 1, 2)