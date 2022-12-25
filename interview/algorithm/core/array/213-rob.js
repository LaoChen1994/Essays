/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
    if (nums.length <= 1) {
        return nums[0]
    }

    return Math.max(fn(nums.slice(0, nums.length - 1)), fn(nums.slice(1, nums.length)))
};

/**
 * @param {number[]} nums
 * @return {number}
 */
function fn(nums) {
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

console.log(rob( [0]))