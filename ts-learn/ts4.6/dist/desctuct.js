"use strict";
function processAction(action) {
    // 增加了解构后的类型判断
    var kind = action.kind, payload = action.payload;
    if (kind === "NumberContents") {
        // `action.payload` is a number here.
        var num = payload * 2;
        // ...
    }
    else if (kind === "StringContents") {
        // `action.payload` is a string here.
        var str = payload.slice(0, 1);
        // ...
    }
}
