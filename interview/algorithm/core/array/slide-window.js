function slideWindow (arr) {
    let left = 0, right = 0, window = []

    while (right < arr.length) {
        window.push(arr[right])
        // 扩展右边界
        right++;

        // 对是否满足题目条件进行判断

        while (conditionShrink) {
            // 收缩左边边界
            window.shift()
            left++
        }
    }
}
