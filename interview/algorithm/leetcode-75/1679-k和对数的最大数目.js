/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxOperations = function(nums, k) {
    let count = 0;
    nums.sort((x, y) => x - y);

    let left = 0, right = nums.length - 1;

    while (left < right) {
        const sum = nums[left] + nums[right]
        if (sum === k) {
            count++;
            left++;
            right--;
            continue;
        }

        if (sum < k) {
            left++;
        }

        if (sum > k) {
            right--
        }
    }


    return count
};


console.log(maxOperations([3,1,3,4,3], 5))
