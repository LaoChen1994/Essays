const pushStackMarks = ["(", "{", "["]
const outStack = [")", "}", "]"]

function matchBracket (origin, target) {
  const orginIdx = pushStackMarks.indexOf(origin)

  return outStack[orginIdx] === target
}

function lintCode (str) {
  const stack = []

  for (let index = 0; index < str.length; index++) {
    const char = str[index];
    if (pushStackMarks.includes(char)) {
      stack.push(char)
    } else if(outStack.includes(char)) {
      const outStackElem =  stack.pop()

      if (!matchBracket(outStackElem, char)) {
        return false
      }
      
    }
  }

  return true
}


const lintStr = '(var a = { a: 1, b: 2, c: [1, 2, 3] })'

const rlt = lintCode(lintStr)
