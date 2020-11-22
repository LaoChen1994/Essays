"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var emitEvent1 = function emitEvent1(props) {
  var _props = _slicedToArray(props, 2),
      property = _props[0],
      value = _props[1];

  console.log("".concat(property, " is changed, newValue = ").concat(value));
};

var emitEvent2 = function emitEvent2(props) {
  var _props2 = _slicedToArray(props, 2),
      property = _props2[0],
      value = _props2[1];

  console.log('*************************************');
  console.log("".concat(property, " is changed to ").concat(value, ", this is Event 2"));
  console.log('*************************************');
};

var genProxy = function genProxy(obj) {
  var name = n++;
  eventBus.on(name, emitEvent1);
  eventBus.on(name, emitEvent2);
  return new Proxy(obj, {
    set: function set(target, property, value) {
      console.log('old target = ', target);
      console.log('target = ', target);
      console.log('property = ', property);
      console.log('value = ', value);
      eventBus.emit(name, property, value);
      target[property] = value;
      return true;
    }
  });
};

var a = genProxy({
  a: 1,
  b: 2
});
a.a = 3;
a.b = 2;
console.log(a);