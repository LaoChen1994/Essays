// 第一种直接for循环
function multiply1 (a, b) {
    let rlt = 0;
    for (let i = 0; i < b; i++) {
        rlt += a
    }

    return rlt
}

// 快速加法
function multiply2(a, b, cache = { 1: a }) {
    let result = 0, k = 1;
    if (cache[b]) return cache[b]

    while (b - k >= 0) {
        result += cache[k];
        b-=k;

        if (!cache[k + k]) {
            cache[k + k] = cache[k] + cache[k]
            k = k + k
        }
    }

    if (b) {
        cache[b] = multiply2(a, b, cache)
        result += cache[b]
    }

    return result
}

// 归并加法

function test(fn) {
    console.time(fn.name)
    console.log(fn(2, 211021312))
    console.timeEnd(fn.name)
}

test(multiply1)
test(multiply2)