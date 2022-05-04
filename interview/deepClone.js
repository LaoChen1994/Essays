const getType = (value) => {
  const type = Object.prototype.toString.call(value) || "";
  const re = /\[object\s(\w+)\]/;

  return type.match(re)[1];
};

const cloneSet = (target, map = new WeakMap()) => {
  const newSet = new Set();
  map.set(target, newSet);
  target.forEach((value) => {
    newSet.add(clone(value, map));
  });

  return newSet;
};

const cloneObject = (target, map = new WeakMap()) => {
  // 对set和map的深拷贝
  let cloneTarget = Array.isArray(target) ? [] : {};
  map.set(target, cloneTarget);

  for (key in target) {
    cloneTarget[key] = clone(target[key], map);
  }

  return cloneTarget;
};

const cloneMap = (target, map = new WeakMap()) => {
  const cloneRes = new Map();

  target.entries(([key, value]) => {
    cloneRes.set(key, clone(value, map))
  })

  return cloneRes
}

const cloneOther = target => {
  const constructor = target.constructor;

  return new constructor(target)
}

/**
 * 
 * @param {symbol} target 
 * @returns 
 */
const cloneSymbol = target => {
  return Symbol(target.valueOf())
}

/**
 * 
 * @param {RegExp} target 
 */
const cloneRegExp = target => {
  return new RegExp(target.source)
}

/**
 * @param {function} fun 
 * @returns {function}
 */
const cloneFunc = fun => {
  const fnStr = Function.prototype.toString.call(fun);
  return new Function(fnStr)

}

// @todo 为了考虑循环引用，引入了缓存
function clone(target, map = new WeakMap()) {
  if (typeof target === 'function') {
    return cloneFunc(target)
  }

  if (typeof target !== "object" || target === null) {
    // 非引用类型直接返回
    return target;
  } else {
    // 引用类型
    // 通过map的方式来做循环引用栈不溢出
    if (map.get(target)) {
      return target;
    }

    switch (getType(target)) {
      case "Set":
        return cloneSet(target, map);

      // 构造函数方式创建的不可迭代类型
      case "Date":
      case "Error":
      case "Number":
      case "String":
      case "Boolean":
        return cloneOther(target);
      
      case "Symbol":
        return cloneSymbol(target);

      case "RegExp":
        return cloneRegExp(target);

      case "Map":
        return cloneMap(target, map);
    
      default:
        return cloneObject(target, map);
    }
  }
}

const a = {
  field1: 1,
  field2: null,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
  field15: Symbol(1),
  field16: new Set(),
  field7: new Map(),
  func: (a, b) => a + b,
  f: {
    f: { f: { f: { f: { f: { f: { f: { f: { f: { f: { f: {} } } } } } } } } } },
  },
};

a.field4.a = a;

const b = clone(a);

b.field4.push(4);
b.field16.add(77);
b.field7.set({a: 1}, "2")
