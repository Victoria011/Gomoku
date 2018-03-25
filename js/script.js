var chessBoard = [];
var player = true;
var gameOver = false;
//赢法数组
var wins = [];
//赢法统计数组
var blackWin = [];
var whiteWin = [];

// 初始化 chessBoard
for(var i=0; i<15; i++){
  chessBoard[i] = [];
  for(var j=0; j<15; j++){
    chessBoard[i][j] = 0;
  }
}

// 初始化赢法数组
for(var i=0; i<15; i++){
  wins[i] = [];
  for(var j=0; j<15; j++){
    wins[i][j] = [];
  }
}

var count = 0; // 赢法种数
// 所有横线赢法
for(var i=0; i < 15; i++){
  for(var j=0; j<11; j++){
    for(var k=0; k<5; k++){
      wins[i][j+k][count] = true;
    }
    count++;
  }
}

// 所有竖线赢法
for(var i=0; i < 15; i++){
  for(var j=0; j<11; j++){
    for(var k=0; k<5; k++){
      wins[j+k][i][count] = true;
    }
    count++;
  }
}

// 所有斜线赢法
for(var i=0; i < 11; i++){
  for(var j=0; j<11; j++){
    for(var k=0; k<5; k++){
      wins[i+k][j+k][count] = true;
    }
    count++;
  }
}

// 所有反斜线赢法
for(var i=0; i < 11; i++){
  for(var j=14; j>3; j--){
    for(var k=0; k<5; k++){
      wins[i+k][j-k][count] = true;
    }
    count++;
  }
}
console.log(count);

for(var i=0; i<count; i++){
  blackWin[i] = 0;
  whiteWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#BFBFBF";

var logo = new Image();
logo.src = "img/logo.png";
logo.onload = function(){
  context.drawImage(logo, 15,15,435,435);
  drawChessBoard();
}

var drawChessBoard = function(){
  for(var i=0; i<15; i++){
    context.moveTo(15 + 30*i,15);
    context.lineTo(15 + 30*i, 435);
    context.stroke();
    context.moveTo(15,30*i + 15);
    context.lineTo(435, 30*i + 15);
    context.stroke();
  }
}

var oneStep = function(i, j, human){
  // 开始画棋子
  context.beginPath();
  context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI); //本身可画扇形 这里用来画圆 将扇形弧度设置为0~2pi
  context.closePath();
  // 渐变的时候给圆心做偏移 x+2, y-2
  var gradient = context.createRadialGradient(15+i*30+2, 15+j*30-2, 0,15+i*30+2, 15+j*30-2, 13);
  if(human){ // black
    // 0 1 为百分比
    gradient.addColorStop(0, "#636766");
    gradient.addColorStop(1, "#0A0A0A");
  }else{
    gradient.addColorStop(0, "#F9F9F9");
    gradient.addColorStop(1, "#D1D1D1");
  }
  context.fillStyle = gradient;
  context.fill();
}

//落子
chess.onclick = function(e){
  if(gameOver || !player){
    return;
  }

  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(y / 30);
  var j = Math.floor(x / 30);
  if(chessBoard[i][j] == 0){
    oneStep(j, i, player);
    chessBoard[i][j] = 1;
    console.log("i = " + i + " j = " + j);

    for(var k=0; k<count; k++){
      if(wins[i][j][k]){ // 坐标 (i, j) 有可能赢
         blackWin[k]++;
         whiteWin[k] = 6; // 上限为5 6表示不可能赢了
         if(blackWin[k] == 5){
           window.alert("You win!");
           gameOver = true;
           break;
         }
      }
    }
    if(!gameOver){
      player = !player;
      computerAI();
    }
  }
}

var computerAI = function(){
  var myScore = [];
  var computerScore = [];
  var max = 0; // 保存最高分数
  var u = 0, v = 0; // 保存最高分数坐标 - 计算机下一步要落子的坐标
  // 遍历所有点 初始化数组
  for(var i=0; i<15; i++){
    myScore[i] = [];
    computerScore[i] = [];
    for(var j=0; j<15; j++){
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }

  for(var i=0; i<15; i++){
    for(var j=0; j<15; j++){
      if(chessBoard[i][j] == 0){ // 空闲点
        for(var k=0; k<count; k++){
          if(wins[i][j][k]){
            // 人方
            if(blackWin[k] == 1){
              myScore[i][j] += 200;
            }else if(blackWin[k] == 2){
              myScore[i][j] += 400;
            }else if(blackWin[k] == 3){
              myScore[i][j] += 2000;
            }else if(blackWin[k] == 4){
              myScore[i][j] += 10000;
            }
            // 计算机方
            if(whiteWin[k] == 1){
              computerScore[i][j] += 300; // 比人方奖励稍微高一点
            }else if(whiteWin[k] == 2){
              computerScore[i][j] += 500;
            }else if(whiteWin[k] == 3){
              computerScore[i][j] += 3000;
            }else if(whiteWin[k] == 4){
              computerScore[i][j] += 20000;
            }
          }
        }
        if(myScore[i][j] > max){
          max = myScore[i][j];
          u = i;
          v = j;
        }else if(myScore[i][j] = max){ // 在 (i, j) (u, v) 中选择下哪里
          if(computerScore[i][j] > computerScore[u][v]){
            u = i;
            v = j;
          }
        }
        if(computerScore[i][j] > max){
          max = computerScore[i][j];
          u = i;
          v = j;
        }else if(computerScore[i][j] = max){ // 在 (i, j) (u, v) 中选择下哪里
          if(myScore[i][j] > myScore[u][v]){
            u = i;
            v = j;
          }
        }
      }
    }
  }
  oneStep(v, u, false);
  chessBoard[u][v] = 2;

  // 更新赢法数组
  for(var k=0; k<count; k++){
    if(wins[u][v][k]){ //坐标 (i, j) 有可能赢
       whiteWin[k]++;
       blackWin[k] = 6; //上限为5 6表示不可能赢了
       if(whiteWin[k] == 5){
         window.alert("You lose!");
         gameOver = true;
         break;
       }
    }
  }
  if(!gameOver){
    player = !player;
  }
}
