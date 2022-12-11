var lengthOfLongestSubstring = function (s) {
  let left = 0;
  let max = 0, map = new Map();

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (!map.get(ch)) {
      map.set(ch, 1);
      if (right - left + 1 > max) {
        max = right - left + 1
      }
    } else {
      // 左边收缩
      while(left <= right) {
        if (ch === s[left]) {
          left++;
          break;
        } else {
          map.delete(s[left])
          left++;
        }
      }
    }
  }

  return max
};

console.log(lengthOfLongestSubstring("pwwkew"))
