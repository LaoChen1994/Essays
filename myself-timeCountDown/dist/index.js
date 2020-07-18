"use strict";
function getWorker(worker, param) {
    var code = worker.toString();
    var blob = new Blob(["(" + code + ")(" + JSON.stringify(param) + ")"]);
    return new Worker(URL.createObjectURL(blob));
}
function getCountDown(param) {
    var _this = this;
    var _timer = null;
    var leftTime = param.leftTime;
    this.onmessage = function (e) {
        var _a = e.data, type = _a.type, interval = _a.interval;
        var countDown = function (milsecond) {
            var second = milsecond / 1000;
            if (milsecond <= 0) {
                clearInterval(timer);
                return [0, 0, 0, 0];
            }
            var leftSecond = ~~(second % 60);
            var leftMinutes = ~~(second / 60 % 60);
            var leftHours = ~~(second / 60 / 60 % 24);
            var leftDay = ~~(second / 60 / 60 / 24);
            return [leftDay, leftHours, leftMinutes, leftSecond];
        };
        nextTick = countDown(leftTime);
        if (type === 'start') {
            _timer = setInterval(function () {
                _this.postMessage({ nextTick: nextTick });
                leftTime = leftTime - interval;
                nextTick = countDown(leftTime);
            }, interval);
        }
        else if (type === 'end') {
            clearInterval(_timer);
        }
    };
}
function compareList(arr1, arr2) {
    if (arr1 === void 0) { arr1 = []; }
    if (arr2 === void 0) { arr2 = []; }
    var diffIndex = [];
    for (var index = 0; index < arr1.length; index++) {
        if (arr1[index] !== arr2[index])
            diffIndex.push(index);
    }
    return diffIndex;
}
function render() {
    var elem = document.getElementById('count_con');
    var firstRender = true;
    var prevTime = [0, 0, 0, 0];
    return function (params) {
        if (params === void 0) { params = [0, 0, 0, 0]; }
        if (firstRender) {
            var html = params.reduce(function (p, c) {
                return p + ("\n                    <div class=\"count_item\" id=\"count_item\">" + c.toString().padStart(2, "0") + "</div>\n                ");
            }, '');
            elem.innerHTML = html;
            firstRender = false;
        }
        else {
            var nowCounts_1 = document.getElementsByClassName("count_item");
            var diff = compareList(prevTime, params);
            console.log(diff);
            diff.forEach(function (i) {
                nowCounts_1[i].innerHTML = params[i];
            });
        }
        prevTime = params;
    };
}
var countRender = render();
var worker = getWorker(getCountDown, { leftTime: 691200000 });
worker.postMessage({ type: "start", interval: 1000 });
worker.onmessage = function (e) { return countRender(e.data.nextTick); };
