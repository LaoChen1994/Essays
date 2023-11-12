/**
 * @param {number[]} chars
 * @return {number}
 */
var compress = function(chars) {
    let pointer = 1;
    let count = 1, char = chars[0];

    while (pointer < chars.length) {
        if (char === chars[pointer]) {
            count++;
        }

        const isLast = pointer === chars.length - 1

        if (char !== chars[pointer] || isLast){
            const isLastSame = isLast && char === chars[pointer]
            const idx = pointer - count + (isLastSame ? 1 : 0);
            const insertValue = count >= 10 ? count.toString().split("") : [count.toString()]
            char = chars[pointer];

            if (count > 1) {
                chars.splice(idx + 1, count - (isLastSame ? 0 : 1), ...insertValue);
                pointer = idx + insertValue.length + 1;
            }

            count = 1;
        }

        pointer++;
    }

    return chars.length
};

console.log(compress(["a"]))
