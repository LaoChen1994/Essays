### Typescript 4 学习笔记

- 可变元组类型
- 元组标记
- class 从构造函数推断成员变量类型
- 短语赋值法
- 将 catch error 判定为 unknown 而非 any

#### 0. 准备工作

- 安装 typescript 4 beta 体验版

  ```bash
  npm init
  npm install typescript@beta
  ```

- 配置 workspace 启动

  package.json 文件中增加 script 配置, 一定要使用 node_modules 下的 tsc 不然用全局的编译时候还是会报错，因为用的还是系统全局 3.x 的 typescript 版本

  ```json
  {
    // ....
    "scripts": {
      "dev": "node ./node_modules/typescript/bin/tsc -w -p ./tsconfig.json"
    }
    // ...
  }
  ```

- vscode 配置 typescript 检查版本

  点击右下角 typescript标签 -> 配置版本号 -> 选择对应版本

  ![image-20200802113648717](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200802113648717.png)

#### 1. 可变元组类型

> 说人话：支持在定义类型的时候使用扩展运算符...

```typescript
// 4.0 之前不支持
const a: number[] = [1, 2];
const b: string[] = ["a", "b"];

const c = [...number[], ...string[]] // A rest element must be last in a tuple type.ts(1256)
```

> 4.0中使用可变元组类型能做的事情
>
> + 剥离数组参数解构赋值
> + 实现按顺序的数组聚合 
> + 保证数组聚合后的顺序

~~~typescript
// 剥离部分参数
function head<T extends unknown, U extends Arr>(arr: [T, ...U]): T{
  const [head, ...tail] = arr;
  return head
}

// 实现数组的聚合
function map<T extends Arr, U extends Arr, K extends Arr>(
  arr1: T,
  arr2: U,
  fn: (item: (T | U)[number]) => K
): K[] {
  const list: [...T, ...U] = [...arr1, ...arr2];

  return list.map(fn);
}

const _map = map(a, b, function (item) {
  if(typeof item === 'number') {
    return item.toString()
  } else {
    return item
  }
}) // string[]

// 相较于 (T|U)[] 该种写法可以保证顺序
// 但是其实没差 因为最后结果还是(T|U)[]
function concat<T extends Arr, U extends Arr>(arr1: T, arr2: U): [...T, ...U] {
  return [...arr1, ...arr2];
}

const _concat = concat(a, b) // (string|number)[]

// 一个柯里化的例子
function partialCall<T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R,
  ...headArgs: T
) {
  return (...b: U) => f(...headArgs, ...b);
}

const add = (...args: number[]) => args.reduce((p, c) => p + c, 0);

const fn = partialCall(add, 10);

const res = fn(3, 4, 5, 6);
~~~



#### 2.  元组标记功能

废话不多说直接看代码~

~~~typescript
// 3.x支持的写法
type List = [number, string]
const _list = [1, "1"]

// 4.0支持给对应的元组元素进行记名标记
// 使每个元素的意义更加明确
type List2 = [first: number, second: string]
const list: List2 = [1, "1"]
~~~



#### 3. class 从构造函数推断成员变量类型

原来的class我们需要在**申明变量时就指定对应变量的类型**，现在支持从构造函数中直接进行推断

~~~typescript
class Circle {
  area; // 3.x -> any; 4.x -> number
  radius; // 3.x -> any; 4.x -> number

  constructor(radius: number) {
    this.radius = radius;
    this.area = Math.PI * radius ** 2
  }
}
~~~



#### 4. 短语赋值法

将 &&、||、??可以通过 x=的方式写

~~~typescript
// 4.0新支持
a &&= b // a = a && b
a ||= b // a = a || b
a ?? b // a = a ?? b

// 例子
students.forEach(stu => {
  stu.hobby ||= 'No Hobby'
  stu.hobby &&= 'Clean'
})
~~~



#### 5. catch error

~~~typescript
// catch Error unknown
try {
  // ...
} catch (e) { // any -> unknow
  // error!
  if (typeof e === "string") {
    // works!
    // We've narrowed 'e' down to the type 'string'.
    console.log(e.toUpperCase());
  }
}

~~~

