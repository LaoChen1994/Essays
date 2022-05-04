function insertSort (array) {
  for (let i = 0; i < array.length; i++) {
    if (i === 0) continue;

    const element = array.splice(i, 1)[0];
    let position = i
    for (let j = 0; j < i; j--) {
      if (array[j] > element) {
        position = j;
      } else {
        break;
      }
    }

    array.splice(position, 0, element);
  }

  return array
}

const rlt = insertSort([6, 5, 4, 3, 2, 1])

console.log(rlt)