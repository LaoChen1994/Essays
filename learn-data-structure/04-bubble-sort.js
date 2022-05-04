let transStep = 0;

function bubbleSort (array) {
  let endLength = 1;
  for(let i = 0; i < array.length; i++) {
    if(endLength === array.length) return array;

    for (let j = 0; j < array.length - endLength; j++) {
      transStep++;
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j+1], array[j]]
        transStep++
      }
    }

    endLength++;
  }
}

const arr = bubbleSort([5, 4, 3, 2, 1])

console.log(arr, transStep)