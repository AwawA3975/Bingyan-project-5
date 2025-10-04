// 创建牌组 名为poker
const suits = ['♣','♠','♦','♥']
const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
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

// 洗牌 得到乱序数组poker
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
// 1.取出最后一张牌 存于变量selectedCard中
const selectedCard = dealCards(poker)
function dealCards(arr){
  return arr.pop()
}
// console.log(selectedCard);
// console.log(poker);

// 2.分离花色和数值 分别存于selectedSuit selectedRank中
const selectedSuit = selectedCard[0]
const selectedRank = selectedCard.substring(1)
console.log(selectedSuit);
console.log(selectedRank);

// 3.将花色和数值渲染到牌面上
// 花色：给牌添加类名，显示背景
a = document.querySelector('.card[data-suit=""]').dataSuit = selectedSuit
console.log(a);








