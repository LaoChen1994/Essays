/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
  const need = buildNeed(s1);
  let curr = {};
  let left = 0;

  for (let right = 0; right < s2.length; right++) {
    const ch = s2[right];
    if (need[ch]) {
        curr[ch] ? (curr[ch]++)  : (curr[ch] = 1);
    }

    if (right - left + 1 === s1.length) {
      if (isSame(need, curr)) {
        return true
      }

      do {
        curr[s2[left]]--;
        left++;

        if (need[s2[left]]) {
          // 在其中说明后面的可能会是s2的排列组合
          break
        }
      } while (left < right);
    }
  }
  return false;
};

/**
 * 
 * @param {object} need 
 * @param {object} win 
 * @return {boolean}
 */
function isSame (need, win) {
    const keys = Object.keys(need);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (!win[key] || need[key] > win[key]) {
            return false
        }
    }

    return true
}

/**
 *
 * @param {string} s
 */
function buildNeed(s) {
  let need = {};

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    need[ch] ? need[ch]++ : (need[ch] = 1);
  }

  return need;
}

console.log(checkInclusion("ab", "eidbaoo"));
