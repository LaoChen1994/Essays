import { IUserInfo, IGoods } from "./interface";

// 可变元组类型
const a = [1, 2];
const b = ["a", "b"];

const students: IUserInfo[] = [
  {
    name: "Tom",
    age: 16,
  },
  {
    name: "Tony",
    age: 18,
  },
];

const targos: IGoods[] = [
  {
    goodName: "茅台",
    price: 2000,
  },
  {
    goodName: "香肠",
    price: 5,
  },
];

type Arr = unknown[];

// map
function map<T extends Arr, U extends Arr, K extends unknown>(
  arr1: T,
  arr2: U,
  fn: (item: (T | U)[number]) => K
): K[] {
  const list: [...T, ...U] = [...arr1, ...arr2];

  return list.map(fn);
}

function concat<T extends Arr, U extends Arr>(arr1: T, arr2: U): [...T, ...U] {
  return [...arr1, ...arr2];
}

function head<T extends unknown, U extends Arr>(arr: [T, ...U]): T{
  const [head, ...tail] = arr;
  return head
}

const _map = map(a, b, function (item) {
  if(typeof item === 'number') {
    return item.toString()
  } else {
    return item
  }
})

const _concat = concat(a, b)

const headVal = head([1, 2, 3, '1']) // number

// 如果输入是两个不同的数组感觉还是解决不了
// function handleArr(item: IUserInfo)
// function handleArr(item: IGoods | IUserInfo) {
//   // do something different for IUserInfo or IGoods
// }

// map(targos, students, handleArr);
function tail<T extends any[]>(arr: readonly [any, ...T]) {
  const [_ignored, ...rest] = arr;
  return rest;
}

// as const 表示元素不能被扩展
const myTuple = [1, 2, 3, 4] as const;
const myArray = ["hello", "world"];

// type [2, 3, 4]
const r1 = tail(myTuple);

// type [2, 3, ...string[]]
const r2 = tail([...myTuple, ...myArray, ...students] as const);

function partialCall<T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R,
  ...headArgs: T
) {
  return (...b: U) => f(...headArgs, ...b);
}

const add = (...args: number[]) => args.reduce((p, c) => p + c, 0);

const fn = partialCall(add, 10);

const res = fn(3, 4, 5, 6);
console.log(res);

// 元组标记
function test(...args: [string, number]) {
  const param1 = args[0];
  const param2 = args[1];
}

// 支持具名数组定义
type List = [number, string]
type List2 = [first: number, second: string]

const list: List2 = [1, "1"]

const [_a, _b] = list

// class 从构造函数推断成员变量类型
class Circle {
  area;
  radius;

  constructor(radius: number) {
    this.radius = radius;
    this.area = Math.PI * radius ** 2
  }
}

// 短语赋值法
students.forEach(stu => {
  stu.hobby ||= 'No Hobby'
  stu.hobby &&= 'Clean'
})

// catch Error unknown
try {
  // ...
} catch (e) {
  // error!
  if (typeof e === "string") {
    // works!
    // We've narrowed 'e' down to the type 'string'.
    console.log(e.toUpperCase());
  }
}





