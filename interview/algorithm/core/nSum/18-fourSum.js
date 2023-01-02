/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
    nums.sort((x, y) => x - y);
    const result = []
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (i > 0 && nums[i] === nums[i - 1]) continue

        const res = threeSum(nums, target - num, i + 1)
        result.push(...res.map(item => [num, ...item]))
    }

    return result
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @param {number} startX
 * @return {number[][]}
 */
var threeSum = function (nums, target, startX) {
    let n = nums.length
    const result = [];

    for (let i = startX; i < n; i++) {
        const x = nums[i];
        let left = i + 1, right = n - 1;

        if (i > startX && nums[i] === nums[i - 1]) {
            continue
        }

        while (left < right) {
            const sum = nums[left] + nums[right] + x;

            if (sum === target) {
                result.push([x, nums[left], nums[right]]);

                while (nums[left] === nums[++left]) {}
                while (nums[right] === nums[--right]) {}
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result
}

console.log(fourSum([-2,-1,-1,1,1,2,2], 0))