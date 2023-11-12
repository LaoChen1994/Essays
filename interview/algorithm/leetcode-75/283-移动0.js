/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let p1 = 0, p2 = 0;

    while (p1 < nums.length) {
        if (nums[p1] === 0) {
            p2 = p1 + 1;

            while (p2 < nums.length) {
                if (nums[p2] !== 0) {
                    [nums[p2], nums[p1]] = [nums[p1], nums[p2]]
                    break;
                }
                p2++
            }
        }
        p1++
    }
};

const demo = [0,1,0,3,12]
moveZeroes(demo)

console.log(demo)
