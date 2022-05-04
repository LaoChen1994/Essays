/**
 * 
 * @param {function} fn 
 * @param {number} delay 
 */
 function throttle (fn, delay) {
    let timer = null;

    return function (...args) {
        const ctx = this;
        if (timer) return;

        timer = setTimeout(() => {
            fn.call(ctx, ...args)
            timer = null
        }, delay)

    }
}