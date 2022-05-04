/**
 * 
 * @param {Function} fn 
 * @param {number} delay 
 * @returns 
 */
function debounce (fn, delay) {
    let timer = null;

    return function(...args) {
        const ctx = this;

        if (timer) {
            clearTimeout(timer)
        };

        timer = setTimeout(() => {
            fn.call(ctx, ...args);
            clearTimeout(timer);
            timer = null
        }, delay)
    }
}

const btn = document.getElementById("button")
btn.addEventListener("click", debounce(() => {
    console.log("click")
}, 1000))