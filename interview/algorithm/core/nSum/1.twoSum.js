/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    const map  = {};
    const n = nums.length

    for (let i = 0; i < n; i++) {
        if (map[nums[i]] !== undefined) {
            return [i, map[nums[i]]]
        }

        map[target - nums[i]] = i
    }

    return []
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    let left = 0, right = nums.length - 1;
    const result = []

    nums.sort((x, y) => x - y)

    while (left < right) {
        const sum = nums[left] + nums[right]
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

console.log(twoSum([1,3,1,2,2,3], 4))