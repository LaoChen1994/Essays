// console.log('require start')
// const lib = require('./lib')
// console.log('require lib ->', lib)

// lib.test = 'test'

const { game, GameResult } = require("./game");

process.stdin.on("data", (e) => {
  const playAction = e.toString().trim();
  let loseCount = 0
  const result = game(playAction);
  if (result === GameResult.win) {
    loseCount++
  } else {
    loseCount = 0
  }

  if (loseCount === 3) {
    console.log('你太厉害了我不玩了')
    process.exit()
  }
  
});
