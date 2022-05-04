export var C = function () { return React.createElement("div", null, "123"); };
export var D = function () {
    return Array(10).map(function (t, i) { return (i % 2 === 0 ? React.createElement(C, null) : null); });
};
