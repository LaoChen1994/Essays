var lengthOfLongestSubstring = function (s) {
  let left = 0,
    right = 0,
    len = 0;
  let need = {};

  while (right < s.length) {
    const c1 = s[right];

    if (!need[c1]) {
      need[c1] = 1;
    } else {
      need[c1] = need[c1] + 1;
    }

    while (left <= right && need[c1] && need[c1] > 1) {
      if (need[s[left]]) {
        need[s[left]]--;
      }

      left++;
    }

    if (right - left + 1 > len) {
      len = right - left + 1;
    }

    right++;
  }
};
