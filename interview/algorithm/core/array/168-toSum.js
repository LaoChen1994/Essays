/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let left = 0,
    right = numbers.length - 1;

  while (left <= right) {
    const result = numbers[left] + numbers[right];
    if (result === target) {
      return [left + 1, right + 1];
    }

    if (result > target) {
      right--;
      continue;
    }

    left++;
  }
};

console.log(twoSum([2, 7, 11, 15], 9));
