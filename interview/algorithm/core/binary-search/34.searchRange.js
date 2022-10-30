/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    if (!nums.length) return [-1, -1]

    const left = searchBoundLeft(nums, target);
    const right = searchBoundRight(nums, target, false);

    return [left, right]
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @param {boolean} isLeft
 * @return {number[]}
 */
function searchBoundLeft (nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        if (nums[mid] === target) {
            right = mid - 1
        } else if (nums[mid] > target) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return nums[right + 1] === target ? right + 1 : -1
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @param {boolean} isLeft
 * @return {number[]}
 */
 function searchBoundRight (nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (nums[mid] === target) {
            left = mid + 1
        } else if (nums[mid] > target) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return nums[left - 1] === target ? left - 1 : -1
 }


console.log(searchRange([1], 1))