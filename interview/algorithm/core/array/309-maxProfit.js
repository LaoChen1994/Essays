/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let dp = [];

    for (let i = 0; i < prices.length; i++) {
        dp[i] = [];
        if (i === 0) {
            dp[i][0] = 0;
            dp[i][1] = -1 * prices[i]
            continue
        }

        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
        // 冷冻期为一天，临界情况是第二天的没有持仓且买入，所以当前金额是第二天的价格 * -1 买入
        dp[i][1] = Math.max(dp[i - 1][1], i >= 2 ? dp[i - 2][0] - prices[i] : -prices[i]);
    }

    return dp[prices.length - 1][0]
};

console.log(maxProfit([1]))