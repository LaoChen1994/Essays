/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
function openLock(deadends, target) {
  const queue = [];
  const visited = new Set([...deadends]);
  const start = "0000";
  let step = 0;
  let min = Number.MAX_SAFE_INTEGER;

  if (visited.has("0000")) return -1;

  queue.push(start);
  visited.add(start);

  while (queue.length) {
    const len = queue.length;

    for (let i = 0; i < len; i++) {
      const element = queue.shift();

      // 找到目标退出当前位置
      if (element === target) {
        return step;
      }

      for (let j = 0; j < element.length; j++) {
        const [prev, next] = getSiblings(element, j);

        if (!visited.has(prev) && !deadends.includes(prev)) {
          visited.add(prev);
          queue.push(prev);
        }

        if (!visited.has(next) && !deadends.includes(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    step++;
  }

  return min === Number.MAX_SAFE_INTEGER ? -1 : step;
}

/**
 *
 * @param {string} str
 * @param {number} idx
 * @return {string[]}
 */
function getSiblings(str, idx) {
  let prev = getSiblingValue(+str[idx] - 1);
  let next = getSiblingValue(+str[idx] + 1);

  return [replaceStrByIdx(str, idx, prev), replaceStrByIdx(str, idx, next)];
}

function getSiblingValue(value) {
  if (value < 0) return 9;
  if (value > 9) return 0;

  return value;
}

/**
 *
 * @param {string} str
 * @param {number} idx
 * @param {string} value
 * @return {string}
 */
function replaceStrByIdx(str, idx, value) {
  if (idx === 0) return `${value}${str.slice(1)}`;
  return `${str.slice(0, idx)}${value}${str.slice(idx + 1)}`;
}

console.log(openLock(["0201","0101","0102","1212","2002"], "0202"));
