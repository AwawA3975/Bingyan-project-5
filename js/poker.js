// 一、准备阶段
// 1.初始化游戏状态 存于对象game中
const game = {
  // 游戏全局状态
  state: {
    phase: 'preflop', /* 游戏阶段 */
    pot: 0,/* 赌池中全部赌注 */
    currentBetPool : 0,
    maxBet:0,
    addedBet:0,
    communityCards: [],
    Button: 2,/* 庄家id */
    // dealerPosition: 2,/* 当前行动人 */
    smallBlind: 10,
    bigBlind: 20
  },
  
  // 玩家数组
  players: [
    {
      id: 1,
      name: 'Me',
      chips: 1000,
      card: [],
      handLevel: 0,
      handRank : {},
      actionType:'',
      currentBet: 0,/* 这一轮 */
      betOfThisTurn:0,/* 总共的 */
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
      betOfThisTurn:0,
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
      betOfThisTurn:0,
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
      betOfThisTurn:0,
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
      betOfThisTurn:0,
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
      betOfThisTurn:0,
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

// 2.牌组准备
// 1)创建牌组 名为poker
const suits = ['♣','♠','♦','♥']
const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
let poker = []
createPoker()
function createPoker(){
  for(let suit in suits){
    for(let rank in ranks){
      poker.push(suits[suit]+ranks[rank])
    }
  }
}
// 2)洗牌 得到乱序数组poker
shuffleCards(poker)
function shuffleCards(arr){
  for(let i = arr.length-1; i>=0; i--){
    const j = Math.floor(Math.random()*(i+1))
    const temp = arr[j]
    arr[j] = arr[i]
    arr[i] = temp
  }
}
// 3)发牌函数
// a)给自己发牌(渲染页面)
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
// b)给他人发牌(不渲染页面)
function dealOthersCard(arr){
  arr.push(poker.pop())
  document.querySelector('.cards div div').innerHTML = poker.length
}

// 3.机器人们
class PokerBot {
  constructor(name,chips){
    this.name = name
    this.aggression = 0.5+Math.random()*0.5
    this.chips = chips
  }
  /* 输入手牌和已有公共牌，返回强度 */
  evaluateCards(card,communityCards){
    let strength = 0
    // 分时期
    if(communityCards.length === 0){
      strength = judgingMyCards(card)
    }else if(communityCards.length === 3){
      strength = guessCardsStrength(card,communityCards)
    }else if(communityCards.length === 4){
      strength = guessCardsStrength(card,communityCards) * 0.9
    }else{
      strength = guessCardsStrength(card,communityCards) * 0.8
    }
    // 1)手牌阶段
    function judgingMyCards(card){
      /* 预处理 */
      const myCards = [{},{}]
      for(let i = 0;i<2;i++){
        myCards[i].suit = card[i][0]
        myCards[i].rank = card[i].substring(1)
      }
      myCards[0].rank = { 'J':11, 'Q':12, 'K':13, 'A':14 }[myCards[0].rank] || +myCards[0].rank
      myCards[1].rank = { 'J':11, 'Q':12, 'K':13, 'A':14 }[myCards[1].rank] || +myCards[1].rank
      const maxRank = Math.max(myCards[0].rank, myCards[1].rank);
      const minRank = Math.min(myCards[0].rank, myCards[1].rank);
      /* 权重判断 */
      let strength = 0
      if(myCards[0].rank === myCards[1].rank) {
        if (myCards[0].rank >=14) strength = 1.00
        else if (myCards[0].rank >=12) strength = 0.98
        else if(myCards[0].rank === 11 || myCards[0].rank === 10) strength = 0.88
        else strength = 0.55+0.03*myCards[0].rank
      }else{
        strength = (maxRank * 0.06) + (minRank * 0.02);
        if (maxRank - minRank >= 10) strength *= 0.8;
        else if (maxRank - minRank >= 5) strength *= 0.9;
      }
      /* 加成系数 */
      if(myCards[0].suit === myCards[1].suit) strength *= 1.1
      if([1,2,-1,-2].includes(myCards[0].rank - myCards[1].rank))  strength *= 1.07
      else if([3,4,-3,-4].includes(myCards[0].rank - myCards[1].rank))  strength *= 1.03

      console.log(Math.min(strength, 1.0));
      
      return Math.min(strength, 1.0)
    }
    // 2)公共牌阶段 
    function guessCardsStrength(card,communityCards){
      /* 预处理 */
      const workedPlayerCards = prejudgingCards(card,communityCards)
      /* 权重判断 */
      const outcome = judgingCards(workedPlayerCards)
      const coefficient = {
        10: 1.0,
        9: 1.0,
        8: 0.95,
        7: 0.85,
        6: 0.75,
        5: 0.70,
        4: 0.60,
        3: 0.50,
        2: 0.30,
        1: 0.10 
      };
      if(communityCards.length === 3 || communityCards.length === 4){
        if(outcome.handLevel === 1) return outcome.handRank['rankOne'] * coefficient[outcome.handLevel] +0.15
      }return outcome.handRank['rankOne'] * coefficient[outcome.handLevel]
    }
    console.log(strength);
    
    return Math.min(strength, 1.0)
  }
  /* 根据手牌强度返回行为 */
  /* 返回一个包含行为和赌金的对象，之后再赋值到game.players中 */
  decideAction(handStrength){
    const randomFactor = (Math.random() * 0.2) - 0.1;
    let adjustedStrength = handStrength * this.aggression + randomFactor
    adjustedStrength = Math.max(0, Math.min(1, adjustedStrength))
    let action = {}
    console.log(`决策参数: strength=${handStrength}, adjusted=${adjustedStrength}, chips=${this.chips}`)
    /* 判断行为 */
    if(game.state.phase === 'preflop' || pool() !== 0){
      if(adjustedStrength >= 0.8)  action = {actionType: 'raise', currentBet: this.calculateRaiseAmount(adjustedStrength),allIn:false}
      else if(adjustedStrength >= 0.35){
        /* 记得根据流程把这里的 game.players[0].chips换掉！*/
          if(this.chips <= maxBet()) action = {actionType:'call',currentBet:game.players[0].chips,allIn:true}
          else action = { actionType:'call',currentBet : maxBet(),allIn:false}
      }else action = { actionType:'fold',currentBet:0,allIn:false}
    }else{
      if(adjustedStrength >= 0.6)action = {actionType:'bet', currentBet: this.calculateBetAmount(adjustedStrength),allIn:false}
      else action ={actionType:'check',currentBet:0,allIn:false}
    }
    console.log(action)
    return action
  }
  /* 判断赌金 */
  calculateRaiseAmount(adjustedStrength){
    const min = maxBet() + addedBet()
    const coefficient = 0.2 + 0.6*adjustedStrength
    const raiseAmount = game.state.pot * coefficient
    return Math.max(min, Math.round(raiseAmount / 10) * 10)
  }
  calculateBetAmount(adjustedStrength){
    const min = game.state.bigBlind
    const coefficient = 0.2 + 0.6*adjustedStrength
    const raiseAmount = game.state.pot * coefficient
    return Math.max(min, Math.round(raiseAmount / 10) * 10)
  }
}


// 二、下注轮函数

// 需要获得所有人的输入(actionType\player.currentBet)
// 存到game.player中！
async function bettingTime(){
  let bettingComplete = false/* 该轮次是否完结 */
  if(game.state.phase !== 'preflop'){
    pool(0)
    maxBet(0)/* 该轮次最高下注 */
    addedBet(0)/* 该轮次加注 */
  }
  
  let Index = game.state.Button 
  if(Index>=game.players.length) Index = 0
  
  // 下注循环
  while(!bettingComplete){
    const player = game.players[Index]
    console.log('开始下注轮，当前玩家:', player.name)
    console.log(Index);
    console.log(player);
    
    /* 跳过已经allIn和fold的人  */
    if(player.chips !== 0 && player.folded !== true) {
      // 0.行动人员高亮
      document.getElementById(`player${Index + 1}`).classList.add('action') 
      // 1.获得行动
      if(Index === 0)  await getMyAction()     
      else  await getBotAction(player.card,game.state.communityCards)
      console.log(player);
    
      // 2.循环 行动轮
      // chip重新计算放到下面循环中
      if(player.allIn === true){
        pool(pool() + player.chips)
        maxBet(maxBet()>player.chips ?maxBet():player.chips)
        addedBet(maxBet()>player.chips ?addedBet():player.chips)
        player.chips = 0
      }else if(game.state.phase === 'preflop' || pool() !== 0){
        switch(player.actionType){
          case 'blind':
            pool(pool()+player.currentBet)
            maxBet(game.state.bigBlind)
            addedBet(game.state.bigBlind)
            break
            case 'fold':
            player.folded = true
            break
            case 'call':
              // player.currentBet = maxBet()
            pool(pool() + maxBet())
            player.chips -=player.currentBet
            break
            case 'raise':
              /* 需补充：下注额必须至少是“maxBet() + addedBet()”​​。 */
            // player.currentBet = player.currentBet
            // maxBet = maxBet>player.currentBet? maxBet : player.currentBet
            addedBet(player.currentBet - maxBet())
            maxBet(player.currentBet)
            pool(pool()+player.currentBet)
            player.chips -=player.currentBet
            break
          }
      }else{
        switch(player.actionType){
          case 'check':
            break
          case 'bet':
            /* 需补充下注大于等于大盲注 */
            // player.currentBet = player.currentBet
            addedBet(player.currentBet)
            maxBet(player.currentBet)
            pool(pool()+player.currentBet)
            player.chips -=player.currentBet
            break
          }
      }
    }
    // 移除边框
    document.getElementById(`player${Index + 1}`).classList.remove('action') 
    Index++
    if(Index>=game.players.length) Index = 0
    console.log(Index);
    /* 更新筹码状态 */
    for(let i = 0;i<game.players.length;i++){
      document.getElementById(`betOfThisTurn_${i+1}`).innerHTML = game.players[i].betOfThisTurn + game.players[i].currentBet
    }
    document.getElementById('betPool').innerHTML = game.state.pot + pool()

    // 下注轮结束判断
    let completedNumber = 0;
    let activePlayers = 0;
    for(let i = 0; i < game.players.length; i++) {
      const player = game.players[i];
      // 跳过已经弃牌的玩家
      if(player.folded) continue;
      activePlayers++;
      // 检查玩家是否已完成本轮下注
      if(player.allIn || 
        (player.currentBet === maxBet() && player.actionType !== '') ||
        (pool() === 0 && player.actionType === 'check')) {
        completedNumber++;
      }
    }
    console.log(`完成玩家: ${completedNumber}, 活跃玩家: ${activePlayers}, 最高下注: ${maxBet()}`);
    if(completedNumber >= activePlayers || activePlayers === 0) {
      bettingComplete = true;
      console.log('下注轮结束');
    }
    
    // 函数部分
    // 获得所有人的输入(actionType\player.currentBet)后存入game.players
    // 存到game.player中！
    // 1.获得玩家行动
    function getMyAction(){
      return new Promise((resolve) => {
        // 按钮更新
        /* 状态判断：非preflop轮且currentBetPool=0时仅check和bet可用； */
        /* 其余时间仅另外三个可用 */
        submit.disabled = false
        updateButtonStates()
        function updateButtonStates() {
          const canCheck = (game.state.phase !== 'preflop' && pool() === 0);
          check.disabled = !canCheck;
          bet.disabled = !canCheck;
          call.disabled = canCheck;
          raise.disabled = canCheck;
          fold.disabled = canCheck;
        }
        // // 前一名玩家行动完后玩家方可提交自己该轮次行为
        // if(game.players[game.players.length-1].allIn || game.players[game.players.length-1].folded || game.players[game.players.length-1].currentBet === maxBet){
        //   submit.disabled = false
        // }
        // 获取玩家该轮次行为
        let whetherAllIn = false
        switch(myChoice){
          case 'call':
            myBet = maxBet()
            if(game.players[0].chips <= maxBet()){
              myBet = game.players[0].chips
              whetherAllIn = true
            }
            break
          case 'raise':
            range.style.display = 'flex'
            range.min = (maxBet() + addedBet()) < game.players[0].chips ? maxBet() + addedBet() : game.players[0].chips
            range.max = game.players[0].chips
            myBet = range.valueAsNumber
            if(myBet === game.players[0].chips) whetherAllIn = true
            break
          case 'bet':
            range.style.display = 'flex'
            range.min = game.state.bigBlind < game.players[0].chips ? game.state.bigBlind : game.players[0].chips
            range.max = player.chips
            myBet = range.valueAsNumber
            if(myBet === game.players[0].chips) whetherAllIn = true
            break
          case 'check':
            myBet = 0
            break
          case 'fold':
            myBet = 0
            break
        }
        // 记得增加一块显示玩家的选择和下注金额!
        console.log(myChoice);
        console.log(myBet);
        
        // 点击submit 将行为和赌金传入game.player[0]/改变按钮状态
        submit.addEventListener('click',function(){
          if(!myChoice) return
          game.players[0].actionType = myChoice
          game.players[0].currentBet = Math.round(myBet / 10) * 10
          game.players[0].allIn = whetherAllIn

          buttons.forEach(button => button.disabled = true)
          submit.disabled = true
          range.style.display ='none'
          
          resolve()
        })
      })
    }  
    // 2.获得机器人行动
    function getBotAction(card,communityCards){
      return new Promise((resolve) => {
        const bot = bots[Index - 1]
        const delay = 2500 + Math.random() * 2000
        setTimeout(() => {
          const strength = bot.evaluateCards(card,communityCards)
          const action = bot.decideAction(strength)
          player.actionType = action.actionType
          player.currentBet = action.currentBet
          player.allIn = action.allIn
          console.log(`已经获得了机器人行动`);
          
          resolve()
        },delay)
      })
    }
  }
  // 下注结束 处理数据/个人状态更新
  game.state.pot += pool()
  pool(0)
  game.players.forEach(
    function(player){
      player.betOfThisTurn += player.currentBet
      player.currentBet = 0
      player.actionType = ''
    }
  )
}

// 三、游戏流程
/* 配置机器人 */
const bots = []
for(let i = 1;i < game.players.length;i++){
  const robot = new PokerBot(`robot${i}`,game.players[i].chips)
  game.players[i].name = robot.name
  bots.push(robot)
}
console.log(bots);
/* 获取操作区元素 */
const check = document.getElementById('check')
const bet = document.getElementById('bet')
const call = document.getElementById('call')
const raise = document.getElementById('raise')
const fold = document.getElementById('fold')
const range = document.getElementById('range')
const submit = document.getElementById('submit')
const buttons = document.querySelectorAll('.button')
const rangeValue = document.getElementById('rangeValue')
/* 滑块设置 */
range.addEventListener('input', function() {
    const value = Math.round(this.valueAsNumber/ 10) * 10
    rangeValue.textContent = value; // 更新显示
    this.value = value; // 确保滑块停在10的倍数上
})
/* 按钮变化/记录选择 */
let myChoice = ''
let myBet = 0
buttons.forEach(button => {
  button.addEventListener('click', () => {
    myChoice = button.id;
    submit.disabled = false; // 允许提交
    if (myChoice === 'bet' || myChoice === 'raise') {
      range.style.display = 'flex';
      rangeValue.style.display = 'flex';
    } else {
      range.style.display = 'none';
      rangeValue.style.display = 'none';
    }
  })
})
/*  */


// runGame()
async function runGame(){
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
    let sbPlayer
    let bbPlayer
    if(i <= game.players.length - 3 && game.players[i].id === game.state.Button){
      sbPlayer = game.players[i+1]
      bbPlayer = game.players[i+2]
      fn()
    }
    else if(i === game.players.length - 2 && game.players[i].id === game.state.Button){
      sbPlayer = game.players[i+1]
      bbPlayer = game.players[i+2-game.players.length]
      fn()
    }
    else if(i === game.players.length - 1 && game.players[i].id === game.state.Button){
      sbPlayer = game.players[i+1-game.players.length]
      bbPlayer = game.players[i+2-game.players.length]
      fn()
    }
    
    function fn(){
      sbPlayer.currentBet = game.state.smallBlind;
      sbPlayer.chips -= game.state.smallBlind;
      bbPlayer.currentBet = game.state.bigBlind;
      bbPlayer.chips -= game.state.bigBlind;
      pool(game.state.smallBlind+game.state.bigBlind)
      maxBet(game.state.bigBlind)
      addedBet(game.state.bigBlind)
    }
  }
  console.log(pool());
  console.log(maxBet());
  console.log(addedBet());
  
  console.log(game.players);
  // 3)下注行动轮
  await bettingTime()
  
  // 2.flop
  game.state.phase = 'flop'
  dealCard(game.state.communityCards)
  dealCard(game.state.communityCards)
  dealCard(game.state.communityCards)
  await bettingTime()
  
  // 3.turn
  game.state.phase = 'turn'
  dealCard(game.state.communityCards)
  await bettingTime()
  
  // 4.river
  game.state.phase = 'river'
  dealCard(game.state.communityCards)
  await bettingTime()
  
  // 5.showdown
  for(let i=0;i < game.players.length;i++){
    const outcome = judgingOnePlayer(game.players[i].card,game.state.communityCards)
    game.players[i].handLevel = outcome.handLevel
    game.players[i].handRank = outcome.handRank
  }
  
  /* 判断赢家 */
  const winnerId  = 0
  let biggestHandLevel = 0
  let biggestHandRank = {
    rankOne:0,
    rankTwo:0,
    rankThree:0,
    rankFour:0,
    rankFive:0,
  }
  game.players.forEach(
    function(player){
      if(player.handLevel > biggestHandLevel) fn()
      else if(player.handLevel === biggestHandLevel){
        if(player.handRank.rankOne > biggestHandRank.rankOne) fn()
          else if(player.handRank.rankOne === biggestHandRank.rankOne){
            if(player.handRank.rankTwo > biggestHandRank.rankTwo) fn()
            else if(player.handRank.rankTwo === biggestHandRank.rankTwo){
              if(player.handRank.rankThree > biggestHandRank.rankThree) fn()
              else if(player.handRank.rankThree === biggestHandRank.rankThree){
                if(player.handRank.rankFour > biggestHandRank.rankFour) fn()
                else if(player.handRank.rankFour === biggestHandRank.rankFour){
                  if(player.handRank.rankThree > biggestHandRank.rankThree)fn()
      }}}}}
      function fn(){
        winnerId = player.id
      }
    }
  )

  for(let i=0;i < game.players.length;i++){
    if(game.players[i].id === winnerId){
      game.players[i].chips += game.state.pot
    }
  }
  /* 待添加：比较手牌+胜负判断+结算页面+再来一局/破产清算 */

}


// 函数
// 1.使用函数访问读取game.state.currentBetPool
function pool(value){
  if (value !== undefined) game.state.currentBetPool = value;
  return game.state.currentBetPool;
}/* 有输入就修改并返回game.state.currentBetPool，没有输入就直接返回 */
// 同理maxBet,addedBet
function maxBet(value){
  if (value !== undefined) game.state.maxBet = value;
  return game.state.maxBet;
}
function addedBet(value){
  if (value !== undefined) game.state.addedBet = value;
  return game.state.addedBet;
}

// 2.判断牌型牌面(包含预处理部分)  就是下面两个加起来
/* 输入未处理过的分开两个数组 */
function judgingOnePlayer(card,communityCards){
  // 1.预处理
  const workedPlayerCards = prejudgingCards(card,communityCards)
  // console.log(workedPlayerCards);
  // 2.牌型牌面判断
  const Obj = judgingCards(workedPlayerCards)
  return Obj
}
// 1）预处理牌面函数
/* 输入两个数组，得到处理好的对象（含四种形式） */
function prejudgingCards(card,communityCards){
  const allRanks = []
  const allSuits = []
  function prejudging(arr){
    for(let i = 0 ; i<arr.length ; i++){
      allSuits.push(arr[i][0])
      allRanks.push(arr[i].substring(1))
    }
  }
  prejudging(card)
  prejudging(communityCards)
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
  // 1.储存所有牌面信息的对象allCards
  // 2.统计牌面频率的对象rankCounts;统计花色频率的对象suitCounts
  // 3.去重且降序排列的牌面数值数组removedRanks
  return [allCards,rankCounts,suitCounts,removedRanks]
}
// 2）判断牌型牌面(不包含预处理部分)
/* 输入处理过的数组，返回包含handLevel和handRank判断的对象 */
function judgingCards(workedPlayerCards){
  const Obj = {}
  // 1)顺子
  let rank = 0
  const ifStraight = judgingStraight(workedPlayerCards[3])
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
  // 2)同花
  let ifFlush = false
  let flushSuit = ''
  for(let k in workedPlayerCards[2]){
    if (workedPlayerCards[2][k] >=5){
      ifFlush = true
      flushSuit = k
    }
  }
  // 2.5)处理牌面以便于比较
  // a.在同花的基础上取出同花的五张牌的牌面
  const flushRanks = []
  for(i=0;i<workedPlayerCards[0].length;i++){
    if(workedPlayerCards[0][i]['suit'] === flushSuit){
      flushRanks.push(workedPlayerCards[0][i]['rank'])
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
  for(let k in workedPlayerCards[1]){
    if (workedPlayerCards[1][k] === 4){
      ifFourOfAKind = true
      fourRank.push(+k)
    }
  }
  const leftedFourRank = workedPlayerCards[3].filter(item => !fourRank.includes(item)) 
  // 6)葫芦放到后面判断
  // 7)三条
  let ifThreeOfAKind = false
  let threeRank = []
  for(let k in workedPlayerCards[1]){
    if (workedPlayerCards[1][k] === 3){
      ifThreeOfAKind = true
      threeRank.push(+k)
    }
  }
  const leftedThreeRank = workedPlayerCards[3].filter(item => !threeRank.includes(item)) 
  // 8)两对/一对
  let pairRank = []
  let pair = 0
  for(let k in workedPlayerCards[1]){
    if (workedPlayerCards[1][k] === 2){
      pair += 1
      pairRank.push(+k)
    }
  }
  const leftedPairRank = workedPlayerCards[3].filter(item => !pairRank.includes(item)) 
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
      rankOne:workedPlayerCards[3][0],
      rankTwo:workedPlayerCards[3][1],
      rankThree:workedPlayerCards[3][2],
      rankFour:workedPlayerCards[3][3],
      rankFive:workedPlayerCards[3][4]
    };
  }
  return Obj
}