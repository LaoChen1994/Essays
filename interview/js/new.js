function objectFactory () {
    // 生成一个新对象
    var obj = new Object();
    const constructor = arguments[0];
    const props = arguments.slice(1);
    // 改变原型链
    obj.__proto__ = constructor.prototype
    // 把构造函数的东西挂到obj上面, this.value = xxx
    // 改变this的指向
    const rlt = constructor.apply(obj, props)

    return typeof rlt === 'object' ? rlt : object
}