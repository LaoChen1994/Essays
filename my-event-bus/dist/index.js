"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventBus = /*#__PURE__*/function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    this._events = new Map();
    this._maxListener = 10;
  }

  _createClass(EventBus, [{
    key: "on",
    value: function on(type, fn) {
      var handler = this._events.get(type);

      if (!handler) {
        this._events.set(type, [fn]);
      } else {
        handler.push(fn);
      }
    }
  }, {
    key: "emit",
    value: function emit(type) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var handlers = this._events.get(type);

      if (handlers) {
        (handlers || []).forEach(function (handler) {
          handler.call(_this, args);
        });
      }

      return true;
    }
  }, {
    key: "off",
    value: function off(type, fn) {
      var _hanlder = this._events.get(type);

      if (_hanlder) {
        _hanlder.splice(_hanlder.findIndex(fn), 1);
      }
    }
  }]);

  return EventBus;
}();

var eventBus = new EventBus();
var n = 0;

var emitEvent1 = function emitEvent1(property, value) {
  console.log("".concat(property, " is changed, newValue = ").concat(value));
};

var emitEvent2 = function emitEvent2(property, value) {
  console.log('*************************************');
  console.log("".concat(property, " is changed to ").concat(value, ", this is Event 2"));
  console.log('*************************************');
};

var genProxy = function genProxy(obj) {
  var name = n++;
  eventBus.on(name, emitEvent1);
  eventBus.on(name, emitEvent2);
  return new Proxy({
    obj: obj
  }, {
    set: function set(target, property, value) {
      console.log('old target = ', target);
      eventBus.emit(name, property, value);
      return true;
    }
  });
};

var a = genProxy({
  a: 1,
  b: 2
});
a.a = 3;
console.log(a);