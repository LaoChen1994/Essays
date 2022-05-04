/**
 * 浅拷贝
 * @param {object} target
 */

// @todo 为了考虑循环引用，引入了缓存
function clone(target, map = new WeakMap()) {
  if (typeof target !== "object") {
    // 非引用类型直接返回
    return target;
  } else {
    if (map.get(target)) {
        return target
    }
  
    if (Array.isArray(target)) {
      // 考虑数组的情况
      let newArray = [];

      target.forEach((item) => {
        newArray.push(clone(item, map));
      });

      map.set(target, newArray)

      return newArray;
    } else {
      let cloneTarget = Array.isArray(target) ? [] : {};
      map.set(target, cloneTarget)

      for (key in target) {
        cloneTarget[key] = clone(target[key], map);
      }

      return cloneTarget;
    }
  }
}

const a = {
  field1: 1,
  field2: undefined,
  field3: "ConardLi",
  field4: {
    child: "child",
    child2: {
      child2: "child2",
    },
    child3: [1, 2, 3],
  },
};

a.field4.a = a

const b = clone(a);

b.field4.child3.push(4);


console.log('a => ', a, "b => ", b);
