/**
 * @param {number[]} nums
 * @return {number}
 */

var removeDuplicates = function(nums) {
    if (nums.length <= 1) {
        return nums.length
    }

    let slow = 0, fast = 0;

    while (fast < nums.length) {
        if (nums[fast] !== nums[slow]) {
            slow++
            nums[slow] = nums[fast]
        }

        fast++
    }

    return slow + 1
}

const list = [0,0,1,1,1,2,2,3,3,4]
const len = removeDuplicates(list)

console.log(list, len)