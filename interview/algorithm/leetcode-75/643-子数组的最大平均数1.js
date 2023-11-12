/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function(nums, k) {
    let prevSum = 0;
    let left = 0, avg = Number.MIN_SAFE_INTEGER;
    const len = nums.length;

    while (left + k <= len) {
        if (left === 0) {
            prevSum = nums.slice(left, left + k).reduce((p, c) => {
                return p + c
            }, 0)
        } else {
            prevSum = prevSum + nums[left + k - 1]
        }

        avg = Math.max(avg, prevSum / k);

        prevSum -= nums[left]

        left++
    }

    return avg
};

console.log(findMaxAverage([0,1,1,3,3], 4))
