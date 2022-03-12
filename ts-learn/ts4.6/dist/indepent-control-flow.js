"use strict";
function fn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var a = args[0], b = args[1];
    if (a === "num") {
        b.toFixed();
    }
    else {
        b.trim();
    }
}
