// 一、准备阶段
// 1.初始化游戏状态 存于对象game中
const game = {
  // 游戏全局状态
  state: {
    phase: 'preflop', /* 游戏阶段 */
    pot: 0,/* 赌池中全部赌注 */
    communityCards: [],
    Button: 5,/* 庄家id */
    // dealerPosition: 2,/* 当前行动人 */
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
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,
      folded: false,
      allIn: false,
    },
    {
      id: 2,
      name: 'Player 2',
      chips: 1000,
      card: [],
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,
      folded: false,
      allIn: false,
    },
    {
      id: 3,
      name: 'Player 3',
      chips: 1000,
      card: [],
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,
      folded: false,
      allIn: false,
    },
    {
      id: 4,
      name: 'Player 4',
      chips: 1000,
      card: [],
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,
      folded: false,
      allIn: false,
    },
    {
      id: 5,
      name: 'Player 5',
      chips: 1000,
      card: [],
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,
      folded: false,
      allIn: false,
    },
    {
      id: 6,
      name: 'Player 6',
      chips: 1000,
      card: [],
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,
      folded: false,
      allIn: false,
    },
  ],
  
  // // 历史记录
  // history: {
  //   actions: [],
  //   winners: []
  // }
};

// 2.创建牌组 名为poker
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
// 3.洗牌 得到乱序数组poker
function shuffleCards(arr){
  for(let i = arr.length-1; i>=0; i--){
    const j = Math.floor(Math.random()*(i+1))
    const temp = arr[j]
    arr[j] = arr[i]
    arr[i] = temp
  }
}
shuffleCards(poker)
// 4.发牌函数
// 1)给自己发牌 发单张牌使用函数dealCard()
let selectedCard =''
function dealCard(arr){
  // 1.取出最后一张牌 存于变量selectedCard中
  selectedCard = poker.pop()
  // 2.获取该被渲染的卡片信息
  const correspondingCard = document.querySelector('.card[data-suit=""]')
  const correspondingWord = document.querySelector('.card[data-suit=""] .card-front .number');
  // 3.赋值  添加属性和类从而渲染牌面
  correspondingCard.dataset.suit = selectedCard[0]
  correspondingCard.dataset.rank = selectedCard.substring(1)
  correspondingCard.classList.toggle('flipped')
  correspondingWord.innerHTML = `<strong>${selectedCard.substring(1)}</strong>`
  // 此时：牌面信息已被赋值到data-rank和data-suit属性中，且牌面翻转，背景和上面文字也被改变
  arr.push(selectedCard)
  document.querySelector('.cards div div').innerHTML = poker.length
}
// 2)给他人发牌(不渲染页面)
function dealOthersCard(arr){
  arr.push(poker.pop())
  document.querySelector('.cards div div').innerHTML = poker.length
}
// 5.机器人们



// 二、下注轮函数

// 需要获得所有人的输入(actionType\player.currentBet)
// 存到game.player中！
function bettingTime(){
  let bettingComplete = false/* 该轮次是否完结 */
  let currentBetPool = 0/* 该轮次赌池 */
  let maxBet = 0/* 该轮次最高下注 */
  let addedBet = 0/* 该轮次加注 */
  // 下注循环
  let i = game.state.Button +1
  const player = game.players[i]
  while(!bettingComplete){
    // 1.获得玩家行动
    function getMyAction(){
      // 状态判断：非preflop轮且currentBetPool=0时仅check和bet可用；
      // 其余时间仅另外三个可用
      submit.disabled = true
      if(game.state.phase !== 'preflop' && currentBetPool === 0){
        check.disabled = false
        bet.disabled = false
        call.disabled = true
        raise.disabled = true
        fold.disabled = true
      }else{
        check.disabled = true
        bet.disabled = true
        call.disabled = false
        raise.disabled = false
        fold.disabled = false
      }
      // 前一名玩家行动完后玩家方可提交自己该轮次行为
      if(game.players[game.players.length-1].allIn || game.players[game.players.length-1].folded || game.players[game.players.length-1].currentBet === maxBet){
        submit.disabled = false
      }
      // 获取玩家该轮次行为
      const myChoice = []
      let myBet = 0
      let whetherAllIn = false
      buttons.forEach(button =>{
        button.addEventListener('click',function(){
          myChoice.unshift(this.id)
        })/* 获得行为 */
      })
      if(myChoice[0] !== 'bet' && myChoice[0] !== 'raise'){
        range.style.display = 'none'
      } else range.style.display = 'flex'
      
      if(myChoice[0] === 'call'){
        myBet = maxBet
        if(game.players[0].chips <= maxBet){
          myBet = game.players[0].chips
          whetherAllIn = true
        }
      }else if(myChoice[0] === 'bet' || myChoice[0] === 'raise'){
        myBet = range.valueAsNumber
        if(myBet === game.players[0].chips) whetherAllIn = true
      }else myBet = 0/* 获得赌金 (allIn特殊状态）*/ 
      // 记得增加一块显示玩家的选择和下注金额!
      // 点击submit 将行为和赌金传入game.player[0]/改变按钮状态
      submit.addEventListener('click',function(){
        game.players[0].actionType = myChoice[0]
        game.players[0].currentBet = myBet
        game.players[0].allIn = whetherAllIn
        buttons.forEach(button => button.disabled = true)
        submit.disabled = true
        range.style.display ='none'
      })
    }  
    // 2.获得机器人行动
    function getBotAction(){

    }
    // 获得所有人的输入(actionType\player.currentBet)后存入game.players
    // 存到game.player中！
    // chip重新计算放到下面循环中
    
    // 3.循环 行动轮
    /* 盲注特殊状态:跳过获取行动环节 */
    if(player.currentBet === 0 ){
      getMyAction()
      getBotAction()
    }else player.actionType = 'blind'/* 感觉有点问题？最后一天记得来这边检查一下 */
    
    /* 跳过弃牌/allIn玩家 */
    if(player.chips === 0 || player.folded === true) continue /* 跳过已经allIn和fold的人  */
    
    if(player.allIn === true){
      currentBetPool += player.chips
      maxBet = maxBet>player.chips ?maxBet:player.chips
      addedBet = maxBet>player.chips ?addedBet:player.chips
      player.chips = 0
    }else if(game.state.phase === 'preflop' || currentBetPool !== 0){
      switch(actionType){
        case 'blind':
          currentBetPool += player.currentBet
          maxBet = game.state.bigBlind
          addedBet = game.state.bigBlind
          break
        case 'fold':
          player.folded = true
          break
        case 'call':
          // player.currentBet = maxBet
          currentBetPool += maxBet
          player.chips -=player.currentBet
          break
        case 'raise':
          /* 需补充：下注额必须至少是“maxBet + addedBet”​​。 */
          // player.currentBet = player.currentBet
          // maxBet = maxBet>player.currentBet? maxBet : player.currentBet
          addedBet = player.currentBet - maxBet
          maxBet = player.currentBet
          currentBetPool += player.currentBet
          player.chips -=player.currentBet
          break
      }
    }else{
      switch(actionType){
        case 'check':
          break
        case 'bet':
          /* 需补充下注大于等于大盲注 */
          // player.currentBet = player.currentBet
          addedBet = player.currentBet
          maxBet = player.currentBet
          currentBetPool += player.currentBet
          player.chips -=player.currentBet
          break
      }
    }
    i++
    if(i>=game.players.length) i = 0
    // 下注轮结束判断
    let completedNumber = 0
    for(let i = 0;i<game.players.length;i++){
      const player = game.players[i]
      if(player.allIn || player.folded || player.currentBet === maxBet){
        completedNumber +=1
      }
    }
    if(completedNumber === game.players.length) bettingComplete = true
  }
  // 下注结束 处理数据/个人状态更新
  game.state.pot += currentBetPool
  game.players.forEach(
    function(player){
      player.currentBet = 0
      player.actionType = ''
    }
  )
}

// 三、游戏流程
check = document.getElementById('check')
bet = document.getElementById('bet')
call = document.getElementById('call')
raise = document.getElementById('raise')
fold = document.getElementById('fold')
range = document.getElementById('range')
submit = document.getElementById('submit')
buttons = document.querySelectorAll('.button')

// 1.preflop
// 1)发牌
game.state.phase = 'preflop'
dealCard(game.players[0].card)
dealCard(game.players[0].card)
for(let i = 1;i<game.players.length;i++){
  dealOthersCard(game.players[i].card)
  dealOthersCard(game.players[i].card)
}
// 2)自动下注
for(i=0;i<game.players.length;i++){
  if(i <= game.players.length - 3 && game.players[i].id === game.state.Button){
      game.players[i+1].currentBet = game.state.smallBlind
      game.players[i+2].currentBet = game.state.bigBlind
      break
  }
  if(i === game.players.length - 2 && game.players[i].id === game.state.Button){
      game.players[i+1].currentBet = game.state.smallBlind
      game.players[i+2-game.players.length].currentBet = game.state.bigBlind
      break
  }
  if(i === game.players.length - 1 && game.players[i].id === game.state.Button){
      game.players[i+1-game.players.length].currentBet = game.state.smallBlind
      game.players[i+2-game.players.length].currentBet = game.state.bigBlind
      break
  }
}
console.log(game.players);
// 3)下注行动轮
bettingTime()

// 2.flop
game.state.phase = 'flop'
dealCard(game.state.communityCards)
dealCard(game.state.communityCards)
dealCard(game.state.communityCards)
bettingTime()

// 3.turn
game.state.phase = 'turn'
dealCard(game.state.communityCards)
bettingTime()

// 4.river
game.state.phase = 'river'
dealCard(game.state.communityCards)
bettingTime()

// 5.showdown
for(let i=0;i < game.players.length;i++){
  judgingOnePlayer(game.players[i])
}
/* 待添加：比较手牌+胜负判断+结算页面+再来一局/破产清算 */


// 四、胜负判断函数 结果存于game.players中
console.log(game.players);
// 超大函数 传入players[i]后将其handLevel,handRank传回
function judgingOnePlayer(Obj){
  // 1.预处理
  // 1)将花色、牌面提到单独数组并对牌面映射排序
  const allRanks = []
  const allSuits = []
  function prejudging(arr){
    for(let i = 0 ; i<arr.length ; i++){
      allSuits.push(arr[i][0])
      allRanks.push(arr[i].substring(1))
    }
  }
  prejudging(Obj.card)
  prejudging(game.state.communityCards)
  // 映射
  const mappedRanks = allRanks.map(x =>({ 'J':11, 'Q':12, 'K':13, 'A':14 }[x] || +x))
  // 1.5) 将牌面对应存储到allCards中
  const allCards = []
  for(i=0;i<mappedRanks.length;i++){
    allCards.push(
      ({
      suit:allSuits[i],
      rank:mappedRanks[i]
    }))
  }
  // 降序排列得到descendingRanks数组
  const descendingRanks = mappedRanks.sort((a, b) => b - a);
  // 2)统计花色\牌面出现频率\去重
  let rankCounts = {}
  descendingRanks.map(x => {
    rankCounts[x] = (rankCounts[x] || 0) + 1 
  })
  let suitCounts = {}
  allSuits.map(x => {
    suitCounts[x] = (suitCounts[x] || 0) + 1 
  })
  let removedRanks = [...new Set(descendingRanks)]

  // 2.牌型牌面判断
  // 1)顺子
  let rank = 0
  function judgingStraight(arr){
    if(arr.length<5)
      return false
    const special = arr.every((rank) => [2,3,4,5,14].includes(rank))
    if(special === true){
      rank = 5
      return true
    }
    let outcome = false
    for(i=arr.length-5;i<0;i--){
      for(j=i;j<i+5;j++){
        if(arr[j] !== arr[j+1]+1){ 
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
  const ifStraight = judgingStraight(removedRanks)
  // 2)同花
  let ifFlush = false
  let flushSuit = ''
  for(let k in suitCounts){
    if (suitCounts[k] >=5){
      ifFlush = true
      flushSuit = k
    }
  }
  // 2.5)处理牌面以便于比较
  // a.在同花的基础上取出同花的五张牌的牌面
  const flushRanks = []
  for(i=0;i<allCards.length;i++){
    if(allCards[i]['suit'] === flushSuit){
      flushRanks.push(allCards[i]['rank'])
    }
  }
  // b.映射牌面+降序
  const mappedFlushRanks = flushRanks.map(x =>({ 'J':11, 'Q':12, 'K':13, 'A':14 }[x] || +x))
  const descendingFlushRanks = mappedFlushRanks.sort((a, b) => b - a);
  // c.去重 得到了去重后降序排列的同花部分的牌面大小
  let removedFlushRanks = [...new Set(descendingFlushRanks)]
  // 3)同花顺
  // d.判断是否是顺子
  const ifStraightFlush = ifFlush ? judgingStraight(removedFlushRanks) || false:false
  // 4)皇家同花顺
  const ifRoyalFlush = ifStraightFlush && removedFlushRanks.every((rank) => [14,13,12,11,10].includes(rank))
  // 5)四条
  let ifFourOfAKind = false
  const fourRank = []
  for(let k in rankCounts){
    if (rankCounts[k] === 4){
      ifFourOfAKind = true
      fourRank.push(+k)
    }
  }
  const leftedFourRank = removedRanks.filter(item => !fourRank.includes(item)) 
  // 6)葫芦放到后面判断
  // 7)三条
  let ifThreeOfAKind = false
  let threeRank = []
  for(let k in rankCounts){
    if (rankCounts[k] === 3){
      ifThreeOfAKind = true
      threeRank.push(+k)
    }
  }
  const leftedThreeRank = removedRanks.filter(item => !threeRank.includes(item)) 
  // 8)两对/一对
  let pairRank = []
  let pair = 0
  for(let k in rankCounts){
    if (rankCounts[k] === 2){
      pair += 1
      pairRank.push(+k)
    }
  }
  const leftedPairRank = removedRanks.filter(item => !pairRank.includes(item)) 
  pairRank = pairRank.sort((a, b) => b - a);
  const ifTwoPair = pair>=2 ? true : false
  const ifOnePair = pair === 1 ? true : false
  // 6)葫芦
  const ifFullHouse = ifThreeOfAKind && pair === 1 ? true : false
  const fullHouseRank = threeRank
  const leftedFullHouseRank = pairRank

  // 3.赋值至Obj中
  Obj.handLevel = getHandLevel();
  Obj.handRank = getHandRank();

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
  function getHandRank() {
    if (ifRoyalFlush) return {rankOne:14};
    if (ifStraightFlush) return {rankOne:removedFlushRanks[0]};
    if (ifFourOfAKind) return {
      rankOne:fourRank[0],
      rankTwo:leftedFourRank[0]
    };
    if (ifFullHouse) return {
      rankOne:fullHouseRank[0],
      rankTwo:leftedFullHouseRank[0]
    };
    if (ifFlush) return {
      rankOne:removedFlushRanks[0],
      rankTwo:removedFlushRanks[1],
      rankThree:removedFlushRanks[2],
      rankFour:removedFlushRanks[3],
      rankFive:removedFlushRanks[4]
    };
    if (ifStraight) return {rankOne:rank};
    if (ifThreeOfAKind) return {
      rankOne:threeRank[0],
      rankTwo:leftedThreeRank[0],
      rankThree:leftedThreeRank[1]
    };
    if (ifTwoPair) return {
      rankOne:pairRank[0],
      rankTwo:pairRank[1],
      rankThree:leftedPairRank[0],
      rankFour:leftedPairRank[1],
      rankFive:leftedPairRank[2]
    };
    if (ifOnePair) return {
      rankOne:pairRank[0],
      rankTwo:leftedPairRank[0],
      rankThree:leftedPairRank[1],
      rankFour:leftedPairRank[2],
      rankFive:leftedPairRank[3]
    };
    return {
      rankOne:removedRanks[0],
      rankTwo:removedRanks[1],
      rankThree:removedRanks[2],
      rankFour:removedRanks[3],
      rankFive:removedRanks[4]
    };
  }
}


