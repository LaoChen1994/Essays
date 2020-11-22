"use strict";

var effectStack = [];
var targetMap = new WeakMap(); // 存储所有的reactive，所有key对应的依赖

function track(target) {// 收集依赖
  // reactive 可能有多个
  // 而一个又有多个key
}

function trigger() {// 触发更新
}

function effect() {// 副作用
}

function computed() {}

var baseHandler = {
  get: function get(target, property) {
    track(target, property);
    return Reflect.get(target, property);
  },
  set: function set(target, property, value) {
    trigger(target, property, target[property], value);
    Reflect.set(target, property, value);
    return true;
  }
};

function reactive(target) {
  // target 处理成响应式
  var observered = new Proxy(target, baseHandler);
  return observered;
}