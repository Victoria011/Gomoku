var chessBoard = [];
var player = true;
var gameOver = false;
var _blacki = 0, _blackj = 0; //记录黑子下棋的坐标
var _whitei = 0, _whitej = 0; //记录白子下棋的坐标
//赢法数组
var wins = [];
//赢法统计数组
var blackWin = [];
var undoBlackWin = [];
var whiteWin = [];
var undoWhiteWin = [];

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
  undoBlackWin[i] = 0;
  whiteWin[i] = 0;
  undoWhiteWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var backbtn = document.getElementById("undoBtn");

context.strokeStyle = "#BFBFBF";

for(var i=0; i<15; i++){
  context.moveTo(15 + 30*i,15);
  context.lineTo(15 + 30*i, 435);
  context.stroke();
  context.moveTo(15,30*i + 15);
  context.lineTo(435, 30*i + 15);
  context.stroke();
}

var oneStep = function(i, j, human){
  context.beginPath();
  context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
  context.closePath();

  var gradient = context.createRadialGradient(15+i*30+2, 15+j*30-2, 0,15+i*30+2, 15+j*30-2, 13);
  if(human){
    gradient.addColorStop(0, "#636766");
    gradient.addColorStop(1, "#0A0A0A");
  }else{
    gradient.addColorStop(0, "#F9F9F9");
    gradient.addColorStop(1, "#D1D1D1");
  }
  context.fillStyle = gradient;
  context.fill();
}
// 销毁棋子
var minusStep = function(i,j) {
  context.clearRect(i * 30, j * 30, 30, 30);
  context.strokeStyle = "#BFBFBF";
  context.beginPath();
  context.moveTo(15+i*30, j*30);
  context.lineTo(15+i*30, j*30 + 30);
  context.moveTo(i*30, j*30+15);
  context.lineTo((i+1)*30 , j*30+15);

  context.stroke();
}
// 落子
chess.onclick = function(e){
  if(gameOver){
    return;
  }

  var x = e.offsetX;
  var y = e.offsetY;
  var i = Math.floor(y / 30);
  var j = Math.floor(x / 30);

  if(chessBoard[i][j] == 0){
    oneStep(j, i, player);
    if(player){
      _blacki = i;
      _blackj = j;
      chessBoard[i][j] = 1;
    }else{
      _whitei = i;
      _whitej = j;
      chessBoard[i][j] = 2;
    }

    for(var k=0; k<count; k++){
      if(wins[i][j][k]){ // 坐标 (i, j) 有可能赢
        if(player){
          blackWin[k]++;
          undoWhiteWin[k] = whiteWin[k];
          whiteWin[k] = 6; // 上限为5, 6表示不可能赢了

          if(blackWin[k] == 5){
            window.alert("Black win!");
            gameOver = true;
            break;
          }
        }else{
          whiteWin[k]++;
          undoBlackWin[k] = blackWin[k];
          blackWin[k] = 6; // 上限为5, 6表示不可能赢了

          if(whiteWin[k] == 5){
            window.alert("White win!");
            gameOver = true;
            break;
          }
        }
      }
    }
    player = !player;
  }
}

// 悔棋
backbtn.onclick = function(e){
  gameOver = false;
  if(player){ // 黑子悔棋
    chessBoard[_blacki][_blackj] = 0; // 清空黑子当前位置
    minusStep(_blackj, _blacki); // 销毁棋子
    for(var k = 0; k < count; k++){ // 将可能赢的情况都减1
      if(wins[_blacki][_blackj][k]){
        blackWin[k]--;
        whiteWin[k] = undoWhiteWin[k]; // 这个位置对方可能赢
      }
    }
  }
  else{ // 白子悔棋
    chessBoard[_whitei][_whitej] = 0; // 清空白子当前位置
    minusStep(_whitej, _whitei); // 销毁棋子
    for(var k = 0; k < count; k++){  // 将可能赢的情况都减1
      if(wins[_whitei][_whitej][k]){
        whiteWin[k]--;
        blackWin[k] = undoBlackWin[i]; //这个位置对方可能赢
      }
    }
  }
}
