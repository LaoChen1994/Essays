/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let res = s[0]
    for (let i = 0; i < s.length - 1; i++) {
        const odd = expand(s, i);
        const even = expand(s, i, i + 1)

        if (res.length < odd.length) {
            res = odd
        }

        if (res.length < even.length) {
            res = even
        }
    }

    return res
};

/**
 * 
 * @param {string} s
 * @param {number} p
 * @returns {number}
 */
function expand (s, l, r = l) {
    let left = l, right = r, str = s[left];
    while (left >= 0) {
        if (s[left] === s[right]) {
            str = s.slice(left, right + 1)
            left--;
            right++
        } else {
            return str
        }
    }
    
    return str
}


console.log(longestPalindrome("babad"))