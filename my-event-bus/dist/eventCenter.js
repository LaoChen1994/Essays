"use strict";

var _desp = require("./desp");

var _effect = require("./effect");

function createRef(initVal) {
  var _value = initVal;
  var desp = new _desp.Desp();
  return {
    get value() {
      desp.depend();
      return _value;
    },

    set value(value) {
      _value = value;
      desp.notify();
    }

  };
}

var getCommonHandler = function getCommonHandler(desp) {
  return {
    get: function get(target, property) {
      desp.depend();
      return target[property];
    },
    set: function set() {
      Reflect.set.apply(Reflect, arguments);
      desp.notify();
      return true;
    }
  };
};

function createProxyRef(initVal) {
  var _value = initVal;
  var desp = new _desp.Desp();
  var proxy = new Proxy({
    value: _value
  }, getCommonHandler(desp));
  return proxy;
} // 想要实现的功能


var state = createProxyRef(1);
var strState = createProxyRef("");
(0, _effect.effect)(function () {
  console.log('effect = ', state.value);
});
(0, _effect.effect)(function () {
  console.log('effect2 = ', state.value);
});
(0, _effect.effect)(function () {
  console.log('effect3 = ', strState.value);
});
setInterval(function () {
  state.value++;
}, 1000);
setInterval(function () {
  strState.value = strState.value + 'a';
}, 500);