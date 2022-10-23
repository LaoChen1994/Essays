const _ = Symbol("empty");

/**
 *
 * @param {function} fn
 * @param  {any[]} args
 */
// @todo add holes
function curry(fn, ...args) {
  const paramsLen = fn.length;
  const initProps = args || [];
  const hasHoles = args.some((item) => item === _);

  if (initProps.length === paramsLen && !hasHoles) {
    return fn.call(this, ...initProps);
  } else {
    return function (...args) {
      const mergeProps = initProps.concat(...args);
      const nextProps = mergeProps.slice(paramsLen);

      const realProps = mergeProps.slice(0, paramsLen).map((item) => {
        return nextProps.length && item === _ ? nextProps.shift() : item;
      });

      return curry.call(this, fn, ...realProps);
    };
  }
}

function add(a, b, c, d, e) {
  console.log([a, b, c, d, e]);
  return a + b + c + d + e;
}

const addCurry = curry(add, 1);

console.log(addCurry(_, 3, _, 5)(_, 4)(2));
