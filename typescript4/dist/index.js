"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// 可变元组类型
var a = [1, 2];
var b = ["a", "b"];
var students = [
    {
        name: "Tom",
        age: 16,
    },
    {
        name: "Tony",
        age: 18,
    },
];
var targos = [
    {
        goodName: "茅台",
        price: 2000,
    },
    {
        goodName: "香肠",
        price: 5,
    },
];
// map
function map(arr1, arr2, fn) {
    var list = __spreadArrays(arr1, arr2);
    return list.map(fn);
}
function concat(arr1, arr2) {
    return __spreadArrays(arr1, arr2);
}
// 如果输入是两个不同的数组感觉还是解决不了
// function handleArr(item: IUserInfo)
// function handleArr(item: IGoods | IUserInfo) {
//   // do something different for IUserInfo or IGoods
// }
// map(targos, students, handleArr);
function tail(arr) {
    var _ignored = arr[0], rest = arr.slice(1);
    return rest;
}
// as const 表示元素不能被扩展
var myTuple = [1, 2, 3, 4];
var myArray = ["hello", "world"];
// type [2, 3, 4]
var r1 = tail(myTuple);
// type [2, 3, ...string[]]
var r2 = tail(__spreadArrays(myTuple, myArray, students));
function partialCall(f) {
    var headArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        headArgs[_i - 1] = arguments[_i];
    }
    return function () {
        var b = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            b[_i] = arguments[_i];
        }
        return f.apply(void 0, __spreadArrays(headArgs, b));
    };
}
var add = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (p, c) { return p + c; }, 0);
};
var fn = partialCall(add, 10);
var res = fn(3, 4, 5, 6);
console.log(res);
// 元组标记
function test() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var param1 = args[0];
    var param2 = args[1];
}
var list = [1, "1"];
var _a = list[0], _b = list[1];
// class 从构造函数推断成员变量类型
var Circle = /** @class */ (function () {
    function Circle(radius) {
        this.radius = radius;
        this.area = Math.PI * Math.pow(radius, 2);
    }
    return Circle;
}());
// 短语赋值法
students.forEach(function (stu) {
    var _c, _d;
    (_c = stu).hobby || (_c.hobby = 'No Hobby');
    (_d = stu).hobby && (_d.hobby = 'Clean');
});
// catch Error unknown
try {
    // ...
}
catch (e) {
    // error!
    if (typeof e === "string") {
        // works!
        // We've narrowed 'e' down to the type 'string'.
        console.log(e.toUpperCase());
    }
}
