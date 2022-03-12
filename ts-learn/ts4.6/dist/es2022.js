await new Promise(function (res, rej) {
    setTimeout(function () {
        res(1);
    }, 100);
});
var a = [1, 2, 3];
a.at(-1);
export {};
