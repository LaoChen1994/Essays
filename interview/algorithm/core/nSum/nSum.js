/**
 * @param {number[]} nums
 * @param {number} target
 * @param {number} n
 * @return {number[][]}
 */
var nSum = function (nums, target, n, startX = 0) {
    nums.sort((x, y) => x - y);
    const result = []
    if (n < 2) return [];
    if (n < 3) {
        return twoSum(nums, target, 0)
    }
    for (let i = startX; i < nums.length; i++) {
        const num = nums[i]
        let res = []
        if (i > startX && num === nums[i - 1]) {
            continue
        }

        if (n - 1 === 2) {
            res = twoSum(nums, target - num, i + 1)
        } else {
            res = nSum(nums, target - num, n - 1, i + 1);
        }

        if (res.length) {
            result.push(res.map(res => [num, ...res]))
        }
    }

    return result.flat()
};

/**
 *
 * @param {number[]} nums
 * @param {number} target
 * @param {number} startX
 * @return {number[][]}
 */
function twoSum (nums, target, startX) {
    let left = startX, right = nums.length - 1;
    let result = [];

    while (left < right) {
        const sum = nums[left] + nums[right];

        if (sum === target) {
            result.push([nums[left], nums[right]])

            while (nums[left] === nums[++left]) {};
            while (nums[right] === nums[--right]) {};
        } else if (sum < target) {
            left++
        } else {
            right--
        }
    }

    return result
}


console.log(nSum([1,0,-1,0,-2,2], 0, 4))