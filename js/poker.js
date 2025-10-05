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
// console.log(allRanks)
// console.log(allSuits)

// 映射
const mappedRanks = allRanks.map(x =>({ 'J':11, 'Q':12, 'K':13, 'A':14 }[x] || +x))
mappedRanks.sort((a,b) => b - a);
// console.log(mappedRanks)
// 得到了降序排列的mappedRanks数组

// 2)统计花色\牌面出现频率\统计纯牌面值
let rankCounts = {}
mappedRanks.map(x => {
  rankCounts[x] = (rankCounts[x] || 0) + 1 
})
let suitCounts = {}
allSuits.map(x => {
  suitCounts[x] = (suitCounts[x] || 0) + 1 
})
let rankNumber = [...new Set(mappedRanks)]

console.log(mappedRanks)
console.log(rankNumber)
console.log(rankCounts)
console.log(suitCounts)

// 2.胜负判断

// // 试验牌型
// rankNumber = [14,13,12,11,10]
// rankCounts = {
//   2: 2, 
//   9: 3, 
//   10: 2, 
// }
suitCounts = {
  "♠": 5,
  "♦": 2, 
};
// // 之后记得把它俩改回const！

let rank

// 1)顺子
function judgingStraight(arr){
  if(arr.length<5)
    return false

  const special = arr.every((rank) => [2,3,4,5,14].includes(rank))
  if(special === true){
    rank = 5
    return true
  }
  let outcome = false
  for(i=0;i<=arr.length-5;i++){
    // console.log(`第${i}遍大循环`);
    for(j=i;j<i+5;j++){
      // console.log(`第${j}遍小循环`);
      if(arr[j] !== arr[j+1]+1){
        // console.log(`这大概不是顺子`);
        break
      }else if(j === i+3){
        rank = arr[i]
        outcome = true
        break
      }
    }
  }
  return outcome
}
const ifStraight = judgingStraight(rankNumber)
// console.log(ifStraight);
// console.log(rank);


// 2)同花
let ifFlush = false
for(let k in suitCounts){
  if (suitCounts[k] >=5){
    ifFlush = true
  }
}
// console.log(ifFlush);

// 3)同花顺
// const ifStraightFlush = ifFlush && ifStraight
// // console.log(ifStraightFlush);
if(ifFlush){
  
}




// 4)皇家同花顺
const ifRoyalFlush = ifStraightFlush && rankNumber.every((rank) => [14,13,12,11,10].includes(rank))
// console.log(ifRoyalFlush);

// 5)四条
let ifFourOfAKind = false
for(let k in rankCounts){
  if (rankCounts[k] === 4){
    ifFourOfAKind = true
  }
}
// console.log(ifFourOfAKind);

// 6)葫芦
let ifFullHouse = false
for(let i in rankCounts){
  if (rankCounts[i] === 3){
    for(let j in rankCounts){
      if (rankCounts[j] === 2 || rankCounts[j] === 3){
        ifFullHouse = true
      }
    }
  }
}
// console.log(ifFullHouse);

// 7)三条
let ifThreeOfAKind = false
for(let i in rankCounts){
  if (rankCounts[i] === 3){
    ifFullHouse = true
  }
}
// console.log(ifFullHouse);

// 8)两对/一对
let pair = 0
for(let k in rankCounts){
  if (rankCounts[k] === 2){
    pair += 1
  }
}

const ifTwoPair = '';
const ifOnePair = pair === 1?true:false

// console.log(ifOnePair);
// console.log(ifTwoPair);

function getHandLevel() {
  if (ifRoyalFlush) return 10;
  if (ifStraightFlush) return 9;
  if (ifFourOfAKind) return 8;
  if (ifFullHouse) return 7;
  if (ifFlush) return 6;
  if (ifStraight) return 5;
  if (ifThreeOfAKind) return 4;
  if (ifTwoPair) return 3;
  if (ifOnePair) return 2;
  return 1;
}

game.players[0].hand.level = getHandLevel();
console.log(game.players[0].hand.level);
