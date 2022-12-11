/**
* @param {string} s
* @param {string} t
* @return {string}
*/
var minWindow = function(s, t) {
    // build need
    let need = {}
    let curr = {}
    let maxStr = "";

    for (let i = 0; i < t.length; i++) {
        const key = t[i];
        if (!need[key]) {
            need[key] = 1
        } else {
            need[key] += 1
        }
    }

    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        need[ch] && (!curr[ch] ? (curr[ch] = 1) : (curr[ch]++));

        if (!need[ch]) {
            continue;
        }

        if (need[ch] && need[ch] > curr[ch]) {
            continue
        }

        if (isSame(need, curr)) {
            // 相同场景左指针收缩
            while (true) {
                if (!maxStr || right - left + 1 < maxStr.length) {
                    maxStr = s.slice(left, right+1)
                } 

                const leftChar = s[left];
                curr[leftChar]--;
                left++;

                if (need[leftChar] && curr[leftChar] < need[leftChar]) {
                    break
                }
            }
        }
        
    }

    return maxStr
}

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

console.log(minWindow("ADOBECODEBANC", "ABC"))