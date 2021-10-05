// 回调地狱问题
// intervivew((err) => {
//   if (err) {
//     console.log("cry in 1st interview");
//     return;
//   }

//   intervivew((err) => {
//     if (err) {
//       console.log("cry in 2st interview");
//       return;
//     }

//     intervivew((err) => {
//       if (err) {
//         console.log("cry in 3st interview");
//         return;
//       }

//       console.log('I get offer~!')
//     });
//   });
// });

// 并发问题
let count = 0

const getSmile = () => {
  if (count === 2) {
    console.log('smile')
  } else {
    console.log('wait next interview result')
  }
}

intervivew((err) => {
  if (err) {
    console.log("cry in 2st interview");
    return
  }

  count++
  getSmile()
})


intervivew((err) => {
  if (err) {
    console.log("cry in 1st interview");
    return
  }

  count++
  getSmile()
})


function intervivew(callback) {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      callback();
    } else {
      callback(Error("没有通过"));
    }
  }, 500);
}
