function fn(...args: ["num", number] | ["str", string]) {
  const [a, b] = args;
  if (a === "num") {
    b.toFixed();
  } else {
    b.trim();
  }
}
