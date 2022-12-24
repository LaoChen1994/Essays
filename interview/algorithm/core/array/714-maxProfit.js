/**
 * @param {number[]} prices
 * @param {number} fee
 * @return {number}
 */
var maxProfit = function(prices, fee) {
    let dp = [];
    let prev_0 = 0, prev_1 = -1 * prices[0]

    for (let i = 1; i < prices.length; i++) {
        const price = prices[i];
        dp[i] = [];

        prev_0 = Math.max(prev_0, prev_1 + price - fee);
        prev_1 = Math.max(prev_1, prev_0 - price);
    }

    return prev_0
};

console.log(maxProfit([1, 3, 2, 8, 4, 9], 2))