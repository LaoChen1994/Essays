function* promise() {
  const a = yield new Promise((res) => {
    setTimeout(() => {
      res(1);
    }, 1000);
  });

  const b = yield new Promise((res) => {
    setTimeout(() => {
      res(2);
    }, 300);
  });

  console.log(a + b);
}

function async(generator) {
  const gen = generator();

  function next(arg) {
    const rlt = gen.next(arg);

    if (rlt.done) return;
    const value = rlt.value;

    if (value instanceof Promise) {
      value.then((data) => next(data)).catch((e) => gen.throw(e));
    }
  }

  try {
    next();
  } catch (error) {
    gen.throw(error);
  }
}

async(promise);
