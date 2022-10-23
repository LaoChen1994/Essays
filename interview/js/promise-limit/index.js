function concurrence(limit) {
  let i = -1;
  function generator() {
    let id = ++i
    console.log('id -> ', id)
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.log(id);
        res(id);
      }, 1000 + i * 500);
    });
  }

  const ids = Array.from({ length: 10 });
  const limitArray = ids.splice(0, limit).map(generator);

  ids.reduce(
    (p, _) =>
      p
        .then(() => Promise.race(limitArray))
        .then(() => {
          limitArray.shift();
          if (limitArray.length < limit) {
              limitArray.push(generator());
          } 
        })
        .catch((e) => {
          console.log(e);
        }),
    Promise.resolve()
  )
}

concurrence(3)