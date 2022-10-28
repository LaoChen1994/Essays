const cache = [0, 1]

/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if (cache[n] !== undefined) return cache[n]
    cache[n] = fib(n - 2) + fib(n - 1)
    return cache[n]
};

console.log(fib(3))

