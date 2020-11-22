"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Desp = void 0;

var _effect = require("./effect.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Desp = /*#__PURE__*/function () {
  function Desp() {
    _classCallCheck(this, Desp);

    this.subs = new Set();
  }

  _createClass(Desp, [{
    key: "depend",
    value: function depend() {
      if (_effect.effect.activeEffect) {
        this.subs.add(_effect.effect.activeEffect);
      }
    }
  }, {
    key: "notify",
    value: function notify() {
      this.subs.forEach(function (effect) {
        return effect();
      });
    }
  }]);

  return Desp;
}();

exports.Desp = Desp;