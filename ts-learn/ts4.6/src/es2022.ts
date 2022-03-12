await new Promise((res, rej) => {
  setTimeout(() => {
    res(1);
  }, 100);
});

const a = [1, 2, 3]

a.at(-1)


export {}