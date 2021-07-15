"use strict"
const   O = -3, //橙
        Q = -2, //一次的な禁止区域
        N = -1, //無
        W =  0, //白
        R =  1, //赤
        Y =  2, //黄
        G =  3  //緑;
const pX = 13;
const pY = 19;
var Turn = 0;
var checkTurn = -1;
var pTurn = R;  //現在の手番プレイヤーを示す（R～Gを代入することになるはず）
var gameLog = "";

var prex;   //移動前の座標を格納する変数
var prey;   //移動前の座標を格納する変数

var winR = false, winY = false, winG = false;

const dirs = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];   //6方向を表す配列

let board = [
//   0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i
    [N,N,N,N,N,N,N,N,N,R,N,N,N,N,N,N,N,N,N],//0
    [N,N,N,N,N,N,N,N,R,N,R,N,N,N,N,N,N,N,N],//1
    [N,N,N,N,N,N,N,R,N,R,N,R,N,N,N,N,N,N,N],//2
    [W,N,W,N,W,N,R,N,R,N,R,N,R,N,W,N,W,N,W],//3
    [N,W,N,W,N,W,N,W,N,W,N,W,N,W,N,W,N,W,N],//4
    [N,N,W,N,W,N,W,N,W,N,W,N,W,N,W,N,W,N,N],//5
    [N,N,N,G,N,W,N,W,N,W,N,W,N,W,N,Y,N,N,N],//6
    [N,N,G,N,G,N,W,N,W,N,W,N,W,N,Y,N,Y,N,N],//7
    [N,G,N,G,N,G,N,W,N,W,N,W,N,Y,N,Y,N,Y,N],//8
    [G,N,G,N,G,N,G,N,W,N,W,N,Y,N,Y,N,Y,N,Y],//9
    [N,N,N,N,N,N,N,W,N,W,N,W,N,N,N,N,N,N,N],//10
    [N,N,N,N,N,N,N,N,W,N,W,N,N,N,N,N,N,N,N],//11
    [N,N,N,N,N,N,N,N,N,W,N,N,N,N,N,N,N,N,N],//12
];

var WeightData_Y = [
    //    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f, g, h, i
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//2
        [ 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],//3
        [ 0, 5, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 0,-1, 0, 0, 0, 0, 0],//4
        [ 0, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 0,-1, 0,-2, 0, 0, 0, 0],//5
        [ 0, 0, 0, 3, 0, 2, 0, 1, 0, 0, 0,-1, 0,-2, 0,-3, 0, 0, 0],//6
        [ 0, 0, 0, 0, 2, 0, 1, 0, 0, 0,-1, 0,-2, 0,-3, 0,-4, 0, 0],//7
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0,-1, 0,-2, 0,-3, 0,-4, 0,-5, 0],//8
        [ 0, 0, 0, 0, 0, 0, 0, 0,-1, 0,-2, 0,-3, 0,-4, 0,-5, 0,-6],//9
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//10
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//11
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//12
    ];

var WeightData_G = [
    //    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f, g, h, i
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//2
        [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6],//3
        [ 0, 0, 0, 0, 0,-1, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0],//4
        [ 0, 0, 0, 0,-2, 0,-1, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 0],//5
        [ 0, 0, 0,-3, 0,-2, 0,-1, 0, 0, 0, 1, 0, 2, 0, 3, 0, 0, 0],//6
        [ 0, 0,-4, 0,-3, 0,-2, 0,-1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0],//7
        [ 0,-5, 0,-4, 0,-3, 0,-2, 0,-1, 0, 0, 0, 1, 0, 0, 0, 0, 0],//8
        [-6, 0,-5, 0,-4, 0,-3, 0,-2, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],//9
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//10
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//11
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//12
    ];

function init(){    //初期化関数
    var b = document.getElementById("board");
    for(var i=0;i<pX;i++){
        for(var j=0;j<pY;j++){
            var color = board[i][j];
            if(color == N) continue;
            var button = document.createElement("button");
            button.className = "piece" + trans(i) + trans(j);
            button.id = "place" + trans(i) + trans(j);
            button.onclick = clicked;
            b.appendChild(button);
        }
        b.appendChild(button);
    }
    update();
}

function update(){
    showBoard();
    if(     place96.style.backgroundColor == "red"
        &&  place98.style.backgroundColor == "red"
        &&  place9a.style.backgroundColor == "red"
        &&  place9c.style.backgroundColor == "red"
        &&  placea7.style.backgroundColor == "red"
        &&  placea9.style.backgroundColor == "red"
        &&  placeab.style.backgroundColor == "red"
        &&  placeb8.style.backgroundColor == "red"
        &&  placeba.style.backgroundColor == "red"
        &&  placec9.style.backgroundColor == "red"){
            winR = true;
    }
    if(     place30.style.backgroundColor == "yellow"
        &&  place32.style.backgroundColor == "yellow"
        &&  place34.style.backgroundColor == "yellow"
        &&  place36.style.backgroundColor == "yellow"
        &&  place41.style.backgroundColor == "yellow"
        &&  place43.style.backgroundColor == "yellow"
        &&  place45.style.backgroundColor == "yellow"
        &&  place52.style.backgroundColor == "yellow"
        &&  place54.style.backgroundColor == "yellow"
        &&  place63.style.backgroundColor == "yellow"){
            winY = true;
    }
    if(     place3c.style.backgroundColor == "green"
        &&  place3e.style.backgroundColor == "green"
        &&  place3g.style.backgroundColor == "green"
        &&  place3i.style.backgroundColor == "green"
        &&  place4d.style.backgroundColor == "green"
        &&  place4f.style.backgroundColor == "green"
        &&  place4h.style.backgroundColor == "green"
        &&  place5e.style.backgroundColor == "green"
        &&  place5g.style.backgroundColor == "green"
        &&  place6f.style.backgroundColor == "green"){
            winG = true;
    }
    if(winR && winG && winY){//終了判定
        gameset();
        document.getElementById("end").textContent = "対戦終了：対戦ログをダウンロードした後、F5で更新してください"
        return;
    }

    turnChange();
    if(Turn > 300){
        gameset();
        document.getElementById("end").textContent = "強制終了：対戦ログをダウンロードした後、F5で更新してください";
        return;
    }
    document.getElementById("turn").textContent = ctrans(pTurn);
    if(pTurn != R)  setTimeout(think(), 5000);
}

function turnChange(){
    checkTurn++;
    if(checkTurn % 3 == 0 && winR == true) checkTurn++;
    if(checkTurn % 3 == 1 && winY == true) checkTurn++;
    if(checkTurn % 3 == 2 && winG == true) checkTurn++;
    if(checkTurn % 3 == 0 && winR && winG) checkTurn++;
    pTurn = checkTurn % 3 + 1;
    //console.log(checkTurn);
}

function clicked(e){
    var id = e.target.id;
    var i = parseInt(trans(id.charAt(5)));
    var j = parseInt(trans(id.charAt(6)));
    var color = e.target.style.backgroundColor;
    console.log(i+":"+j);
    if(color == ctrans(O)){ //クリックした場所がオレンジ
        movePiece(prex,prey,i,j,pTurn);
        //goTurn(prex,prey,i,j,pTurn);
        update();
        return;
    }
    if(color != ctrans(pTurn))  return;
    prex = i;
    prey = j;
    toW(O); //O->W
    //document.getElementById("test1").textContent = id + "がクリックされた";
    canMove(i, j);
    showBoard();

}

function movePiece(x1,y1,x2,y2,color){  //移動前、移動後、移動させる色
    board[x1][y1] = W;
    board[x2][y2] = color;
    toW(O);
    toW(Q);
    goTurn(x1, y1, x2, y2, color);
}

function goTurn(x1, y1, x2, y2, color){
    Turn++;
    gameLog += Turn + "," + ctrans(color) + ",place" + trans(x1) + trans(y1) + ",place" + trans(x2) + trans(y2) + "\n";
    console.log(gameLog);
}

function canMove(i, j){     //動ける場所をオレンジにする
    setnotMove(pTurn);  //一時的な禁止区域を設定する
    for(var p=0;p<dirs.length;p++){ //6方向を1つずつ調べていく
        var dx = i + dirs[p][0];    //1つ隣
        var dy = j + dirs[p][1];    //1つ隣
            //盤外、禁止区域、候補地の場合は処理を飛ばす
        if(dx < 0 || dx > pX-1 || dy < 0 || dy > pY-1 || board[dx][dy] < W) continue;
            //選んだコマの隣が白ならばオレンジにする
        if(board[dx][dy]==W){board[dx][dy] = O;}
            //ここに到達した時の状態は「盤内であり、隣に何かしらのコマがおかれている」
        canJumpMove(dx, dy, dirs[p][0], dirs[p][1]);
    }
}

function canJumpMove(x,y,dx,dy){
        //隣が盤外または色が無い
    if(x < 0 || x > pX-1 || y < 0 || y > pY-1 || board[x][y] < R) {return;}
    var nx = x + dx;
    var ny = y + dy;
        //もう一つ隣が盤外または白じゃない
    if(nx < 0 || nx > pX-1 || ny < 0 || ny > pY-1 || board[nx][ny] != W) {return;}
        //到達状況「盤内であり、隣の隣は白」
    board[nx][ny] = O;
    //6方向を調べる
    for(var p=0;p<dirs.length;p++){
        var nx2 = nx + dirs[p][0];
        var ny2 = ny + dirs[p][1];
        canJumpMove(nx2, ny2, dirs[p][0], dirs[p][1]);
    }
}

function showBoard(){
    for(var i=0;i<pX;i++){
        for(var j=0;j<pY;j++){
            if(board[i][j] != N){
                var c = document.getElementById("place" + trans(i) + trans(j));
                c.style.backgroundColor = ctrans(board[i][j]);
            }
        }
    }
}

function gameset(){
    for(var i=0;i<pX;i++){
        for(var j=0;j<pY;j++){
            if(board[i][j] != N){
                var c = document.getElementById("place" + trans(i) + trans(j));
                c.disabled = true;
            }
        }
    }
}

function ctrans(color){
    var ct;
    switch (color) {
        case W:
        case Q:         ct = "white";   break;
        case "white":   ct = W;         break;
        case R:         ct = "red";     break;
        case "red":     ct = R;         break;
        case Y:         ct = "yellow";  break;
        case "yellow":  ct = Y;         break;
        case G:         ct = "green";   break;
        case "green":   ct = G;         break;
        case O:         ct = "orange";  break;
        case "orange":  ct = O;         break;
    }
    return ct;
}
function trans(fig){
    switch (fig) {
        case 10:    fig = "a";  break;
        case "a":   fig = 10;  break;
        case 11:    fig = "b";  break;
        case "b":   fig = 11;  break;
        case 12:    fig = "c";  break;
        case "c":   fig = 12;  break;
        case 13:    fig = "d";  break;
        case "d":   fig = 13;  break;
        case 14:    fig = "e";  break;
        case "e":   fig = 14;  break;
        case 15:    fig = "f";  break;
        case "f":   fig = 15;  break;
        case 16:    fig = "g";  break;
        case "g":   fig = 16;  break;
        case 17:    fig = "h";  break;
        case "h":   fig = 17;  break;
        case 18:    fig = "i";  break;
        case "i":   fig = 18;  break;
        default:    return fig;
    }
    return fig;
}

function setnotMove(){
    var nR = [  [ 3, 0], [ 3, 2], [ 3, 4], [ 4, 1], [ 4, 3], [ 5, 2],//左上黄
                [ 7,16], [ 8,15], [ 8,17], [ 9,14], [ 9,16], [ 9,18],//右下黄
                [ 3,14], [ 3,16], [ 3,18], [ 4,15], [ 4,17], [ 5,16],//右上緑
                [ 7, 2], [ 8, 1], [ 8, 3], [ 9, 0], [ 9, 2], [ 9, 4] //左下緑
            ];
    var nY = [  [ 0, 9], [ 1, 8], [ 1,10], [ 2, 7], [ 2, 9], [ 2,11],//上赤
                [10, 7], [10, 9], [10,11], [11, 8], [11,10], [12, 9],//下赤
                [ 3,14], [ 3,16], [ 3,18], [ 4,15], [ 4,17], [ 5,16],//右上緑
                [ 7, 2], [ 8, 1], [ 8, 3], [ 9, 0], [ 9, 2], [ 9, 4] //左下緑
            ];
    var nG = [  [ 0, 9], [ 1, 8], [ 1,10], [ 2, 7], [ 2, 9], [ 2,11],//上赤
                [10, 7], [10, 9], [10,11], [11, 8], [11,10], [12, 9],//下赤
                [ 3, 0], [ 3, 2], [ 3, 4], [ 4, 1], [ 4, 3], [ 5, 2],//左上黄
                [ 7,16], [ 8,15], [ 8,17], [ 9,14], [ 9,16], [ 9,18]//右下黄
            ];
    if(pTurn == R) var mode = nR;
    if(pTurn == Y) var mode = nY;
    if(pTurn == G) var mode = nG;
    for(var p=0;p<mode.length;p++){
        if(board[mode[p][0]][mode[p][1]] == W)
            board[mode[p][0]][mode[p][1]] = Q;
    }
}

function toW(QO){
    for(var i=0;i<pX;i++){
        for(var j=0;j<pY;j++){
            if(board[i][j] == QO)    board[i][j] = W;
        }
    }
}

function strtime(){
    var now = new Date();
    var filetime =      now.getFullYear() + "_"
                +   (now.getMonth() + 1) + "_"
                +   now.getDate() + "_"
                +   now.getHours() + "_"
                +   now.getMinutes();
    return filetime;
}

function downloadText() {
    var title = strtime() + '_log' +'.txt';
    var blobType = 'text/plain';
    var linkTagId = 'getLocal';
    var linkTag = document.getElementById(linkTagId);
    var linkTagAttr =  ['href','download'];
    var stringObject = new Blob([gameLog], { type: blobType });
    var objectURL = window.URL.createObjectURL(stringObject);
    var UA = window.navigator.userAgent.toLowerCase();
    if(UA.indexOf('msie') != -1 || UA.indexOf('trident') != -1) {
    window.navigator.msSaveOrOpenBlob(stringObject, title);
    } else {
        linkTag.setAttribute(linkTagAttr[0],objectURL);
        linkTag.setAttribute(linkTagAttr[1],title);
    }
}

function think(){
    var tmp_prex = -1, tmp_prey = -1;
    var tmp_x = -1, tmp_y = -1;         //仮座標
    var preX = -1, preY = -1;
    var x = -1, y = -1;                 //実座標
    var score = -1000;
    var tmp_score = -1000;
        //手番色を探すfor
    for(var i=0;i<pX;i++){
        for(var j=0;j<pY;j++){
            if(board[i][j] == pTurn){   //手番の色を探す
                canMove(i,j);   //候補地をオレンジにする
                    //候補地を探すfor
                for(var k=0;k<pX;k++){
                    for(var l=0;l<pY;l++){
                        if(board[k][l] == O){   //候補地を探す
                            tmp_score =  calcWeight(i, j, k, l, pTurn);
                            tmp_prex = i;
                            tmp_prey = j;   //移動させるコマの場所(仮)
                            tmp_x = k;
                            tmp_y = l;      //移動後のコマの場所(仮)
                                //点数が高くなったら実座標に代入する
                            if(tmp_score > score){
                                score = tmp_score;
                                preX = tmp_prex;
                                preY = tmp_prey;
                                x = tmp_x;
                                y = tmp_y;
                            }
                        }
                    }
                }
                //オレンジの探索終了
                toW(O); //オレンジを白に戻して探索続行
            }
        }
    }
    //探索終了
    movePiece(preX, preY, x, y, pTurn);     //計算結果を元にコマを移動させる
    update();
}

function calcWeight(x1, y1, x2, y2, color){
    var score = 0;
    var weight = WeightData_Y;
        //現在の手番に合わせて重みを変える
    if(color == Y) weight = WeightData_Y;
    if(color == G) weight = WeightData_G;
    score = weight[x2][y2] - weight[x1][y1];
    return score;
}

