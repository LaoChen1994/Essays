const cache = {}

/**
 * @param {number} n
 * @return {number}
 */
 var fib = function(n) {
     if (n <= 0) return 0;
     if (n === 1) return 1;

     if (cache[n]) return cache[n];

     return cache[n]= fib(n - 1) + fib(n - 2)
};

console.log(fib(100))