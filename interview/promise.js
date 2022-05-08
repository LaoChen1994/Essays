const STATE_TYPE = {
  PENDING: "pending",
  FULLFILLED: "fullfilled",
  REJECTED: "rejected",
};

class MyPromise {
  constructor(fn) {
    this.state = STATE_TYPE.PENDING;
    this.value = null;
    this.reason = null;

    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    this.finallyCallbacks = [];

    this.init(fn);
  }

  init(fn) {
    this.initBind();

    try {
      fn(this.resolve, this.reject);
    } catch (error) {
      this.state = STATE_TYPE.REJECTED;
      this.reason = error;
    }
  }

  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.state !== STATE_TYPE.PENDING) return;

    this.state = STATE_TYPE.FULLFILLED;
    this.value = value;

    while (this.resolveCallbacks.length) {
      this.resolveCallbacks.shift()(value);
    }
  }

  reject(error) {
    if (this.state !== STATE_TYPE.PENDING) return;

    this.state = STATE_TYPE.REJECTED;
    this.reason = error;

    while (this.rejectCallbacks.length) {
      this.rejectCallbacks.shift()(error);
    }
  }

  handleFinally() {
    if (this.state === STATE_TYPE.FULLFILLED && this.resolveCallbacks.length)
      return;

    while (this.finallyCallbacks.length) {
      this.finallyCallbacks.shift()();
    }
  }

  then(resolveCallback, rejectCallback) {
    resolveCallback =
      typeof resolveCallback === "function" ? resolveCallback : (val) => val;
    rejectCallback =
      typeof rejectCallback === "function"
        ? rejectCallback
        : (err) => {
            throw Error(err);
          };

    return new MyPromise((resolve, reject) => {
      const resolvePromise = (callback) => {
        setTimeout(() => {
          try {
            const preResult = callback(this.value);
            if (preResult instanceof MyPromise) {
              preResult.then(resolve, reject);
            } else {
              resolve(preResult);
            }

            this.handleFinally();
          } catch (error) {
            reject(error);
            this.handleFinally();
          }
        });
      };

      if (this.state === STATE_TYPE.PENDING) {
        typeof resolveCallback === "function" &&
          this.resolveCallbacks.push(
            resolvePromise.bind(this, resolveCallback)
          );
        typeof rejectCallback === "function" &&
          this.rejectCallbacks.push(resolvePromise.bind(this, rejectCallback));
      } else if (this.state === STATE_TYPE.FULLFILLED) {
        resolvePromise(resolveCallback);
      } else {
        resolvePromise(rejectCallback);
      }
    });
  }

  catch(cb) {
    if (this.state === STATE_TYPE.PENDING) return;
    cb(this.error);

    return this;
  }

  finally(fn) {
    fn = typeof fn === "function" ? fn : () => {};
    this.finallyCallbacks.push(fn.bind(this));
    return this;
  }

  static all(promises) {
    let count = 0;
    const rlt = [];
    return new MyPromise((resolve, reject) => {
      function handleResolve(value, index) {
        rlt[index] = value;

        if (++count === promises.length) {
          resolve(rlt);
        }
      }

      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise
            .then((data) => {
              handleResolve(data, index);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          handleResolve(promise, index);
        }
      });
    });
  }
}

// 测试代码
console.log(123);
new MyPromise((resolve, reject) => {
  resolve(100);
})
  .then((data) => {
    console.log("resolve 1 ->", data);
    return new MyPromise((resolve) =>
      setTimeout(() => {
        resolve(data * 2);
      }, 1000)
    );
  })
  .then((data) => {
    console.log("resolve 2 ->", data);
    return data + 3;
  })
  .finally(() => {
    console.log(1);
  })
  .finally(() => {
    console.log(2);
  })
  .then((data) => {
    console.log("resolve 3 ->", data);
  });

const rlt = MyPromise.all([
  1,
  new MyPromise((res) => {
    setTimeout(() => {
      res(101);
    }, 100);
  }),
  2,
]);

console.log(345);

rlt.then((data) => {
  console.log("data ->", data);
})
