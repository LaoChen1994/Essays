## ES2020 学习笔记

[原文地址](https://alligator.io/js/es2020)

### 1. babel 环境配置

    babel 版本在7.8以上，babel-cli 8以上均支持es2020中的语法，具体可参照本项目的webpack配置

### 2. es2020 中值得关注的点

#### 对象定义中的私有变量

当我们创建一个类的时候，该类会在各个场景下被使用，可能我们并不希望每一个内部的参数都被全局共享，因此**在方法或者变量前添加#，使得该方法或者类名只在类内部可用**

```javascript
class Person {
  #type = "man";

  constructor(name) {
    this.name = name;
  }

  showType() {
    console.log(`${this.name} is ${this.#type}`);
  }
}

const jack = new Person("Jack");

jack.showType(); // Jack is man

jack.#type // Error: #type is private value

```

在外部调用私有变量的话就会报错

**使用方法：在类内部属性或者变量前加入#号，使得变量变为私有变量**

####　 Promise.allSettled

当我们使用多 promise 的时候，特别是当每个 promise 之间存在以来关系的时候，记录每个 Promise 的返回值对错误调试而言是很重要的。使用 Promise.allSettled，创造了一种新的 promise，**通过该 promise 所有传入的 promise 全部完成后会返回一个数组，该数组中包含了每一个 promise 的返回值和状态**

```javascript
const promise1 = new Promise((resolve, reject) =>
  setTimeout(() => {
    resolve({ type: "success", msg: "Yes" });
  }, 1000)
);

const promise2 = new Promise((resolve, reject) =>
  setTimeout(() => {
    reject({ type: "fail", msg: "No" });
  }, 2000)
);

Promise.all([promise1, promise2])
  .then(data => {
    console.log("success=");
    console.log(data);
  })
  .catch(data => {
    console.log("fail=");
    console.log(data);
  });

// 过了两秒会显示　{ type: "fail", msg: "No" }
// 使用Promise.all只会返回错误的promise返回的信息
// 而正确的Promise返回的信息并不会被得到

Promise.allSettled([promise1, promise2]).then(data => {
  console.log("allSettled");
  console.log(data);
});

/*
[
    {
        status: 'fullfilled',
        value: { type: "success", msg: "Yes" }
    }, {
        status: 'rejected',
        value: { type: "fail", msg: "No" }
    }
]

*/
```

#### Nullish Coalescing Operator(不知道怎么翻译 QAQ)

由于 JavaScript 具有动态类型的特点，因此在变量赋值的时候需要记住一个变量在 JavaScript 中的真假值。比如：当一个对象中含有某些之，我们希望给他一个“假”的初始值，之后通过判断来改写他，我们会赋值给他例如数字 0, 空字符串等等。但是如果０和空字符串本身是有意义的，这样做就会存在问题。

通常情况下使用 || 来进行默认值的赋值

```javascript
let person = {
  profile: {
    name: "",
    age: 0
  }
};

console.log(person.profile.name || "Anonymous"); // Anonymous
console.log(person.profile.age || 18); // 18
```

而在对象当中，我们想要赋值的情况是，**如果为 null 或者 undefined 的时候,赋予默认值，其他时候保持原样，因此提出了??运算符**

#### 可选链式调用

类似于??操作符，JavaScript 现在是能够处理值为 undefined 和 null 的情况，但是如果对象或者数组调用的路径是 undefined 会怎么样?

为了能够通过继续访问该变量，在.操作符之前增加一个?符号，用于模拟出一个可选的路径。

**如果不存在该值，则返回 undefined**

```javascript
const a = {};

console.log(a.b.c); // 这里会报Err， 无法从undefined中得到c

console.log(person?.profile?.name); // ""
console.log(person?.hobby?.work); // undefined

console.log(person?.hobby?.work ?? "no Work"); // no Work
```

**可选链式调用在函数和数组上的调用方法**

依然是?和.操作符

#### BigInt

目前 JavaScript 能够处理的最大的数为 2^53,即最大安全整数 Number.MAX_SAFE_INTEGER
根据你不知道的 JavaScript 中卷中描述，在处理的超过安全范围的数的时候会出现问题
另外，对于非安全最大数 MAX_VALUE,由于采取的是向接近数取整的原则，更是有各种问题

如：

```javascript
Math.pow(2, 53) === Math.pow(2, 53) + 1; // true

Number.MAX_VALUE + Number.MAX_VALUE === Infinity; // true

Number.MAX_VALUE + 1 === Number.MAX_VALUE; // true
```

我们可以通过 BigInt 来解决这个问题。通过在数字末尾添加字母 n，来实现一个 BigInt 类型。
但是我们不能混用 BigInt 和 number 类型，因此在使用运算的时候我们都需要通过 BigInt 类型进行计算

```javascript
// BigInt
a = 1000000000000000000000000000000000000000000000n;
b = 2n;
c = 2;

console.log(a * b); // 2000000000000000000000000000000000000000000000n
console.log(a * c); // Cannot mix BigInt and other types, use explicit conversions
```

#### 动态加载

如果你需要在代码中的部分场景中，使用一个工具类中的部分极少的函数，但是我们直接引入依赖可能会造成资源的浪费，现在可以通过 async/await 异步的方式，在我们需要依赖的时候动态加载依赖项

```javascript
// add.js

export const add = (a, b) => a + b;

// index.js
let math;

const useAdd = async (num1, num2) => {
  const _math = math ?? (await import("./add.js"));

  math = _math ?? add;

  const value = math?.add?.(num1, num2);

  console.log(value);
};

useAdd(1, 2); // 3
useAdd(4, 5); // 9
```
