/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  const dp = [];

  function t(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    if (dp[amount]) return dp[amount];

    let min = Number.MAX_SAFE_INTEGER;

    for (const coin of coins) {
      let count = t(coins, amount - coin);
      if (count === -1) continue
      min = Math.min(min, count + 1);
    }

    dp[amount] = min === Number.MAX_SAFE_INTEGER ? -1 : min;

    return dp[amount];
  }

  return t(coins, amount)
};

console.log(coinChange([1], 0));
