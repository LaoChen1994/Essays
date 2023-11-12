/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {
    let j = 0;

    if (s.length === 0) return true

    for (let i = 0; i < t.length; i++) {
        if (t[i] === s[j]) {
            j++;
            if (j >= s.length) {
                return true
            }
        }
    }

    return false
};

console.log(isSubsequence("", "ahbgdc"))
