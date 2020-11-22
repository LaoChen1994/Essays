"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.effect = effect;

function effect(fn) {
  effect.activeEffect = fn;
  fn();
}

effect.activeEffect = null;