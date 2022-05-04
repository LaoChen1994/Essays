"use strict";
var reducer = function (value) { };
reducer({
    action: "edit",
    handler: function (value) {
        console.log(value.id);
    }
});
var reducer2 = function (value) { };
reducer2({
    action: "edit",
    handler: function (value) {
        console.log(value.id);
    }
});
