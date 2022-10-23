function bigIntAdd(a, b) {
  if (
    !(
      ["string", "number"].includes(typeof a) ||
      ["string", "number"].includes(typeof b)
    )
  ) {
    return false;
  }

  a = typeof a === "string" ? a : a.toString();
  b = typeof b === "string" ? b : b.toString();

  let num1 = a,
    num2 = b,
    extra = 0
    rlt = "";

  if (b.length > a.length) {
    num1 = b;
    num2 = a;
  }

  for (let index = 0; index < num1.length; index++) {
    const bit1 = +getElementReverse(num1, index)
    const bit2 = +(getElementReverse(num2, index) || 0);
    const addRlt = bit1 + bit2 + extra;

    rlt = addRlt % 10 + rlt;
    extra = Math.floor(addRlt / 10)
  }

  return extra > 0 ? extra + rlt : rlt
}

function getElementReverse(str, pos) {
  const lenIndex = str.length - 1;
  if (pos > lenIndex) {
    return null;
  }

  return str[lenIndex - pos];
}

console.log(bigIntAdd('1234567899999999999', '9007199254740991'))