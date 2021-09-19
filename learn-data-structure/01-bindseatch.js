function bindSearch(array, target) {
  let lowBound = 0
  let highBound = array.length
  let targetIndex = -1

  while (lowBound < highBound) {
    const middleIndex = Math.floor((lowBound + highBound) / 2)

    if (array[middleIndex] === target) {
      targetIndex = middleIndex
      break
    } else if (array[middleIndex] < target) {
      // 不存在的时候只剩最接近的一位，不做这个的话
      if (lowBound === middleIndex) break
      lowBound = middleIndex
    } else {
      highBound = middleIndex
    }
  }

  return targetIndex
}

console.log(bindSearch([1, 3, 10, 18], 10))