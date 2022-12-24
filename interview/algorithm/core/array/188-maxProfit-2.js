// 动态规划写法
/**
 * @param {number} k
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (k, prices) {
    const dp = [];
    const max_k = k;

    for (let i = 0; i < prices.length; i++) {
        dp[i] = [];
        const price = prices[i];

        // 交易次数
        for (let j = max_k; j >= 0; j--) {
            if (!dp[i][j]) {
                dp[i][j] = []
            }

            if (i === 0 || j === max_k) {
                dp[i][j][0] = 0;
                dp[i][j][1] = i === 0 ? -price : Math.max(dp[i - 1][j][1], dp[i - 1][j][0] - price);
                continue;
            }
            // 再卖出的时候减掉可订购次数
            dp[i][j][0] = Math.max(dp[i - 1][j][0], dp[i - 1][j + 1][1] + price);
            dp[i][j][1] = Math.max(dp[i - 1][j][1], dp[i - 1][j][0] - price);
        }
    }

    return Math.max(...dp[prices.length - 1].map(prices => prices[0]));
};

console.log(maxProfit(2,  [3,2,6,5,0,3]))