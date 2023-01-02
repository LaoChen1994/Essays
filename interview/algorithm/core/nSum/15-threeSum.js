/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    let n = nums.length
    nums = nums.sort((x, y) => x - y);
    let result = []
    for (let i = 0; i < n; i++) {
        let num = nums[i];
        let target = 0 - num;
        if (i > 0 && nums[i - 1] === num) {
            continue
        }

        let left = i + 1, right = nums.length;

        while(left < right) {
            const sum = nums[left] + nums[right]
            if (sum === target) {
                result.push([num, nums[left], nums[right]])

                // 收缩左右窗口
                while (nums[left] === nums[++left]) {}
                while (nums[right] === nums[--right]) {}
            } else if (sum < target) {
                left++;
            } else {
                right--
            }
        }
    }

    return result
};

console.log(threeSum( [0, 0, 0, 0]))