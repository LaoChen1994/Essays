function flat(array) {
  return array.reduce((prev, current) => {
    return prev.concat(Array.isArray(current) ? flat(current) : current);
  }, []);
}

function advanced(array, nums = 999) {
  console.log(nums)
  return array.reduce((prev, current) => {
    return prev.concat(
      Array.isArray(current)
        ? nums > 0
          ? advanced(current, nums - 1)
          // 做一个浅拷贝，防止引用有问题
          : current.slice()
        : current
    );
  }, []);
}

const arr = [
  1,
  2,
  3,
  4,
  [1, 2, 3, [1, 2, 3, [1, 2, 3]]],
  5,
  "string",
  { name: "弹铁蛋同学" },
];
console.log(advanced(arr, 1));
