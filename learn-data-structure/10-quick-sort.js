function partition(array, ctx = {}) {
  if (array.length <= 1) return array

  if (array.length === 2) {
    if (array[0] > array[1]) {
      [array[1], array[0]] = array
    }
    return array
  }

  const base = array[array.length - 1]
  let leftPointer = 0
  // 主要是为了节约空间复杂度
  let rightPointer = ctx.basePointer = array.length - 2

  while (leftPointer !== rightPointer) {
    if (array[leftPointer] <= base) {
      leftPointer++;
      continue
    }

    // 左指针找到大值
    // 右指针找小值
    if (array[rightPointer] > base) {
      rightPointer--
      continue;
    }

    [array[leftPointer], array[rightPointer]] = [array[rightPointer], array[leftPointer]]
  }

  // 左右指针交汇， 这个时候这个位置需要把基准值塞进来
  if (array[leftPointer] > base) {
    [array[leftPointer], array[array.length - 1]] = [base, array[leftPointer]]
    ctx.basePointer = leftPointer
  }

  return array
}

function quickSort(array) {
  let ctx = {
    basePointer: array.length - 1
  }

  if (array.length <= 1) return array

  const partitions = partition(array, ctx)
  const base = ctx.basePointer

  const leftArray = quickSort(partitions.slice(0, base))
  const rightArray = quickSort(partitions.slice(base + 1, array.length))

  return [...leftArray, array[base], ...rightArray]
}

function fastSearch(kthMin, array) {
  let ctx = {
    basePointer: array.length - 1
  }

  if (array.length <= 1) return array[0]

  const partitions = partition(array, ctx)
  const base = ctx.basePointer
  if (kthMin - 1 === base) {
    return array[base]
  }

  if (kthMin -1 < base) {
    return fastSearch(kthMin, partition(partitions.slice(0, base), ctx))
  }

  return fastSearch(kthMin + base, partition(partitions.slice(base + 1, array.length), ctx))
}

const array = [0, 5, 2, 1, 6, 3]
const rlt = quickSort(array)

console.log(rlt)
