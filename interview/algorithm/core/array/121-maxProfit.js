/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
    let prev_0 = 0
    let prev_1 = -1 * prices[0]

    for (let i = 1; i < prices.length; i++) {
        prev_0 = Math.max(prev_0, prev_1 + prices[i]);
        // 只要买，就一定是之前没有买过，所以一定是-prices[i]
        prev_1 = Math.max(prev_1, -prices[i]);
    }

    return prev_0
};

console.log(maxProfit([7, 1, 5, 3, 6, 4]))