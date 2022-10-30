/**
 *
 * @param {number[]} nums
 */
function binarySearch(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      // 找到目标做的操作
      return mid;
    } else if (nums[mid] < target) {
      // 左指针移动
      left = mid + 1;
    } else if (nums[mid] > target) {
      // 右指针移动
      right = mid - 1;
    }
  }

  return -1;
}

console.log(binarySearch([1,2,2,2,3], 1));

module.exports = {
    binarySearch
}