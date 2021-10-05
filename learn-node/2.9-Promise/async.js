// 用Promise来解决异步流程控制问题
function intervivew(step) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve();
      } else {
        reject(step);
      }
    }, 500);
  });
}

(() => {
  const promise = intervivew(1)
    .then((resp) => {
      return intervivew(2);
    })
    .then(() => intervivew(3))
    .then(() => {
      console.log('Get Offer')
    })
    .catch((step) => {
      console.log(`cry at ${step}st interview`)
    });
})();
