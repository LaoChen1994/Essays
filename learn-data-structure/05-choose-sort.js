let step = 0;

function chooseSort(array) {
  for (let index = 0; index < array.length; index++) {
    let minIndex = index;

    for (let index = minIndex + 1; index < array.length; index++) {
      step++
      if (array[index] < array[minIndex]) minIndex = index;
    }
    
    if (minIndex !== index) {
      [array[minIndex], array[index]] = [array[index], array[minIndex]]
      step++
    }
  }

  return array
}

const items = chooseSort([5, 4, 3, 2, 1])

console.log(items, step)