/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
    const n = nums.length;

    let prev_0 = nums[0];
    let prev_1 =  Math.max(...nums.slice(0, 2));

    if (n < 2) {
        return prev_1
    }

    for (let i = 2; i < n; i++) {
        const curr = Math.max(prev_1, prev_0 + nums[i]);
        prev_0 = prev_1;
        prev_1 = curr
    }

    return prev_1
};
/**
 * dp[i] = Math.max(dp[i - 1]， dp[i-2] + nums[i]);
 */
console.log(rob([2]))