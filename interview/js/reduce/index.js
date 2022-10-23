function reduce(fn, initVal) {
    let prev = initVal, i = 0;
    if (prev === undefined) {
        prev = this[0];
        i++;
    }

    for (i; i < this.length; i++) {
        const next = this[i];
        prev = fn(prev, next, i, this)
    }

    return prev
}

/**
 * reduce((prev, next))
 */


Array.prototype.myReduce = reduce;

const rlt = [1, 2, 3].myReduce((p, c) => p + c);

console.log(rlt)