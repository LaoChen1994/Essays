function pick(obj, arr) {
  obj = obj || {};

  if (
    typeof obj !== "object" &&
    Object.prototype.toString.apply(obj) !== "[object Object]"
  ) {
    throw Error("pick target must be object");
  }

  const keys = Object.keys(obj);
  return arr.reduce((p, k) => {
    if (keys.findIndex((key) => key === k)) {
      p[k] = obj[k];
    }

    return p;
  }, {});
}
