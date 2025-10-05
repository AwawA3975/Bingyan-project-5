// 初始化游戏状态 存于对象game中
const game = {
  // 游戏全局状态
  state: {
    phase: 'preflop', // 游戏阶段
    pot: 0,/* 赌池中全部赌注 */
    communityCards: [],
    currentBet: 0,/* 当前赌注 */
    // dealerPosition: 0,
    smallBlind: 10,
    bigBlind: 20
  },
  
  // 玩家数组
  players: [
    {
      id: 1,
      name: 'Player 1',
      chips: 1000,
      card: [],
      hand:{
        level : '',
        myRank : '',
      },
      currentBet: 0,
      folded: false,
      // allIn: false,
      isActive: true
    },
    // 更多玩家...
  ],
  
  // 历史记录
  history: {
    actions: [],
    winners: []
  }
};

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

// 发牌 发单张牌使用函数dealCard()
let selectedCard =''
function dealCard(){
  // 1.取出最后一张牌 存于变量selectedCard中
  selectedCard = poker.pop()
  // console.log(selectedCard);
  // console.log(poker);

  // 2.获取该被渲染的卡片信息
  const correspondingCard = document.querySelector('.card[data-suit=""]')
  const correspondingWord = document.querySelector('.card[data-suit=""] .card-front .number')
  // console.log(correspondingWord);

  // 3.赋值
  correspondingCard.dataset.suit = selectedCard[0]
  correspondingCard.dataset.rank = selectedCard.substring(1)
  correspondingCard.classList.toggle('flipped')
  correspondingWord.innerHTML = `<strong>${selectedCard.substring(1)}</strong>`
  // console.log(correspondingCard.dataset);
  // 此时：牌面信息已被赋值到data-rank和data-suit属性中，且牌面翻转，背景和上面文字也被改变
}
dealCard()
game.players[0].card.push(selectedCard)
dealCard()
game.players[0].card.push(selectedCard)
/* 好丑、 感觉可以用class什么的但是还不会用 */

document.querySelector('.cards div div').innerHTML = poker.length
// console.log(game);

// 每轮发牌：
dealCard()
game.state.communityCards.push(selectedCard)
dealCard()
game.state.communityCards.push(selectedCard)
dealCard()
game.state.communityCards.push(selectedCard)
dealCard()
game.state.communityCards.push(selectedCard)
dealCard()
game.state.communityCards.push(selectedCard)



// 胜负判断系统
// 1.预处理
// 1)将花色、牌面提到单独数组并对牌面映射排序
const allRanks = []
const allSuits = []
function prejudging(arr){
  for(let i = 0 ; i<arr.length ; i++){
    // console.log(arr[i]);
    allSuits.push(arr[i][0])
    allRanks.push(arr[i].substring(1))
  }
}
prejudging(game.players[0].card)
prejudging(game.state.communityCards)
// console.log(allRanks);
// console.log(allSuits);

const mappedRanks = allRanks.map(x =>({ 'J':11, 'Q':12, 'K':13, 'A':14 }[x] || +x))
mappedRanks.sort((a,b) => b - a);
// console.log(mappedRanks);
// 得到了降序排列的mappedRanks数组

// 2)统计花色\牌面出现频率
const rankCounts = {}
mappedRanks.map(x => {
  rankCounts[x] = (rankCounts[x] || 0) + 1 
})
const suitCounts = {}
allSuits.map(x => {
  suitCounts[x] = (suitCounts[x] || 0) + 1 
})
// console.log(rankCounts)
// console.log(suitCounts)

// 2.胜负判断





