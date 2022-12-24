// 穷举写法
/**
 * @param {number} k
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (k, prices) {
    let res = 0;
    k = k * 2;

    function cb(buyNums, start, totalMoney, lastBuy = undefined) {
        if (buyNums === k || start >= prices.length) {
            if (totalMoney > res) {
                res = totalMoney;
            }
            return;
        }

        const price = prices[start];
        // 不买
        cb(buyNums, start + 1, totalMoney, lastBuy);
        if (lastBuy === undefined) {
            if (start === prices.length - 1) return;
            // 可以买
            cb(buyNums + 1, start + 1, totalMoney - price, price);
        } else {
            // 可以卖
            cb(buyNums + 1, start + 1, totalMoney + price, undefined);
        }
    }

    cb(0, 0, 0, undefined);
    return res;
};

console.log(maxProfit(11, [48, 12, 60, 93, 97, 42, 25, 64, 17, 56, 85, 93, 9, 48, 52, 42, 58, 85, 81, 84, 69, 36, 1, 54, 23, 15, 72, 15, 11, 94,]));
