/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    const need = buidMap(p)
    const curr = {}
    let left = 0;
    let len = p.length;
    let res = []

    for (let right = 0; right < s.length; right++) {
        const ch = s[right];

        if (curr[ch]) {
            curr[ch]++
        } else {
            curr[ch] = 1
        }
        
        if (right - left + 1 === len) {
            while(left <= right) {
                // 初次匹配
                if (right - left + 1 === len) {
                    if (isSame(need, curr)) {
                        res.push(left)
                    }
                } else {
                    // 开始收缩
                    // 如果收缩值仍在value中，指针右移
                    if (need[s[left]]) {
                        break
                    }
                }

                curr[s[left]]--
                left++
            }
        }
    }

    return res
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
 * @returns {object}
 */
function buidMap (s) {
    const m = {};

    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (m[ch]) {
            m[ch]++
        } else {
            m[ch] = 1
        }
    }

    return m
}

console.log(findAnagrams("abab", "ab"))