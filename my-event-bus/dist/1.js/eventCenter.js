"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _value = 0;
var activeEffect;

var Desp = /*#__PURE__*/function () {
  function Desp() {
    _classCallCheck(this, Desp);

    this.subs = [];
  }

  _createClass(Desp, [{
    key: "depend",
    value: function depend() {
      if (activeEffect) {
        this.subs.push(activeEffect);
      }
    }
  }, {
    key: "notify",
    value: function notify() {
      this.subs.map(function (effect) {
        return effect();
      });
    }
  }]);

  return Desp;
}();

function effect(fn) {
  activeEffect = fn;
  fn();
}

var desp = new Desp(); // 想要实现的功能

var state = {
  get value() {
    desp.depend();
    return _value;
  },

  set value(value) {
    _value = value;
    desp.notify();
  }

};
effect(function () {
  console.log('effect = ', state.value);
});
setInterval(function () {
  state.value++;
}, 1000);