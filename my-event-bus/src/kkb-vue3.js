const effectStack = [];
let targetMap = new WeakMap(); // 存储所有的reactive，所有key对应的依赖

function track(target, key) {
  // 收集依赖，收集reactive对象中中多个key的依赖
  // reactive 可能有多个 {a, b}
  // 而一个又有多个key
  // targetMap =
  //   {
  //       {a, b}: {
  //           a:  [effect1, effect2],
  //           b: [effect3]
  //       }
  //   }
  const effect = effectStack[effectStack.length - 1];
  if (effect) {
    let depMap = targetMap.get(target);

    if (!depMap) {
      depMap = new Map();
      targetMap.set(target, depMap);
    }

    let dep = depMap.get(key);
    if (!dep) {
        dep = new Set()
        depMap.set(key, dep)
    }
    dep.add(effect);
  }
}

function trigger(target, key) {
  // 触发更新
  let depMap = targetMap.get(target)
  
  if(!depMap) {
    return
  }

  const effects = new Set()
  const computedRunners = new Set()

  if(key) {
      let deps = depMap.get(key)
      deps.forEach(function(dep) {
          if(dep.computed) {
              computedRunners.add(dep)
          } else {
              effects.add(dep)
          }
      })
  }

  computedRunners.forEach(effect => effect())
  effects.forEach(effect => effect())
}

function effect(fn, options = {}) {
  // options -> lazy, computed
  // 副作用

  let e = createReactiveEffect(fn, options)
  if(!options.lazy) {
    // 决定是否首次就执行
    e()
  }

  return e
}

const baseHandler = {
  get(target, property) {
    track(target, property);
    return Reflect.get(target, property);
  },
  set(target, property, value) {
    trigger(target, property, target[property], value);
    Reflect.set(target, property, value);
    return true;
  },
};

function reactive(target) {
  // target 处理成响应式
  const observered = new Proxy(target, baseHandler);

  return observered;
}


function createReactiveEffect(fn, options) {
    const effect = function effect(...args) {
        return run(effect, fn, args);
    }
    effect.deps = []
    effect.computed = options.computed
    effect.lazy  = options.lazy

    return effect
}

function run(effect, fn, args) {
    console.log('effect = ', fn)
    if(effectStack.indexOf(effect) === -1) {
        try {
            effectStack.push(effect)
            return fn(...args)
        } finally {
            // 为了处理  
            effectStack.pop()
        }
    }
}

function computed(fn) {
    const runner = effect(fn, { computed: true, lazy: true })
    console.log(runner())
    return {
        effect: runner,
        get value() {
            return runner()
        }
    }
}
