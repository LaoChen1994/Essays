// 用Promise来解决异步流程控制问题
function intervivew(step) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve();
      } else {
        reject(step);
      }
    }, 500);
  });
}

(async function() {
  let success = true

  try {
    for (let index = 1; index < 4; index++) {
      await intervivew(index)
    }
    
  } catch (error) {
    success = false
    console.log('cry at ', error, 'round' )
  }

  success && console.log('smile')
})()