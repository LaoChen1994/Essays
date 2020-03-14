// 私有变量private
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

jack.showType();

// console.log(jack.#type);

// Promise.allSettled
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

Promise.allSettled([promise1, promise2]).then(data => {
  console.log("allSettled");
  console.log(data);
});

// Nullish Coalescing Operator
let person = {
  profile: {
    name: "",
    age: 0,
    friends: ["jack"]
  },
  getName() {
    console.log("It's me Anonymous");
  }
};

console.log(person.profile.name || "Anonymous"); // Anonymous
console.log(person.profile.age || 18); // 18

console.log(person.profile.name ?? "Anonymous"); // ""
console.log(person.profile.age ?? 18); // 0

// 可选链式运算符

console.log(person?.profile?.name); //
console.log(person?.hobby?.work);

console.log(person?.hobby?.work ?? "no Work");

// 数组上的使用方法
console.log(person?.profile?.friends?.[0]); // jack
console.log(person?.profile?.friends?.[1]); // undefined
console.log(person?.profile?.families?.[0]); // undefined

// 函数对象的使用方法

person?.getName?.(); // It's me Anonymous
person?.hello?.(); // 这里不存在hello方法，但是并没有报错

// BigInt

const a = 1000000000000000000000000000000000000000000000n;
const b = 2n;
const c = 2;

console.log(a * b); // 2000000000000000000000000000000000000000000000n
// console.log(a * c); // Cannot mix BigInt and other types, use explicit conversions

// dynamic import

let math;

const useAdd = async (num1, num2) => {
  const _math = math ?? (await import("./add.js"));

  math = _math ?? add;

  const value = math?.add?.(num1, num2);

  console.log(value);
};


useAdd(1, 2)
useAdd(4, 5)