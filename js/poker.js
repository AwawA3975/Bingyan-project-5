// 创建牌组
const suits=['♣','♠','♦','♥']
const ranks=['2','3','4','5','6','7','8','9','10','J','Q','K','A']
let poker = []
function createPoker(){
  for(let suit in suits){
    // console.log(suits[suit]);
    for(let rank in ranks){
      poker.push(suits[suit]+ranks[rank])
    }
  }
}
createPoker()
// console.log(poker)

// 洗牌
function shuffleCards(arr){
  for(let i = arr.length-1; i>=0; i--){
    const j = Math.floor(Math.random()*(i+1))
    const temp = arr[j]
    arr[j] = arr[i]
    arr[i] = temp
  }
}
shuffleCards(poker)
// console.log(poker);

// 发牌



