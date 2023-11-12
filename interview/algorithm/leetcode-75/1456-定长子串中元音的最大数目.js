const VOWLES_MAP = {
    a: 1,
    e: 1,
    i: 1,
    o: 1,
    u: 1
}

/**
 * @param {string} char
 * @return {boolean}
 */
function isVowels (char) {
    return !!VOWLES_MAP[char]
}

/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxVowels = function(s, k) {
    let left = 0, maxVowelsNum = 0, currentVowlesNums = 0;

    while (left + k <= s.length) {
        const substr = s.slice(left, left + k)

        if (left === 0) {
            currentVowlesNums = maxVowelsNum = substr.split("").filter(isVowels).length;
        } else {
            if (isVowels(s[left + k - 1])) {
                currentVowlesNums++;
            }
            maxVowelsNum = Math.max(currentVowlesNums, maxVowelsNum)
        }

        if (isVowels(s[left]) && currentVowlesNums > 0) {
            currentVowlesNums--;
        }

        left++;
    }

    return maxVowelsNum;
};

console.log(maxVowels("tryhard", 4))
