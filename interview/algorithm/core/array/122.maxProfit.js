/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let prev_0 = 0;
    let prev_1 = -1 * prices[0];

    for (let i = 1; i < prices.length; i++) {
        prev_0 = Math.max(prev_0, prev_1 + prices[i]);
        prev_1 = Math.max(prev_1, prev_0 - prices[i]);
    }

    return prev_0
};

var maxProfit2 = function(prices) {
    const dp = [];


    for (let i = 0; i < prices.length; i++) {
        if (!dp[i]) {
            dp[i] = [];
        }

        if (i === 0) {
            dp[i][0] = 0;
            dp[i][1] = -1 * prices[0];
            continue
        }

        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
        dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    }

    return dp[prices.length - 1][0]
};

console.log(maxProfit([7,1,5,3,6,4]))