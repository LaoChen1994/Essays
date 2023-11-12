/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function(nums) {
  const len = nums.length;
  const maxArray = Array.from({length: len}).fill(0);
  const minArray = Array.from({length: len}).fill(0);

  minArray[0] = nums[0];

  for (let i = 1; i < len; i++) {
    minArray[i] = Math.min(minArray[i - 1], nums[i]);
  }

  maxArray[len - 1] = nums[len - 1];
  for (let i = len - 2; i >= 0 ; i--) {
    maxArray[i] = Math.max(maxArray[i + 1], nums[i])
  }

  for (let i = 0; i < len; i++) {
    if (nums[i] > minArray[i] && nums[i] < maxArray[i]) {
      return true
    }
  }

  return false
};

console.log(increasingTriplet([2,1,5,0,4,6]))
