"use strict"

const   O = -3, //橙
        Q = -2, //一次的な禁止区域
        N = -1, //無
        W =  0, //白
        R =  1, //赤
        Y =  2, //黄
        G =  3  //緑;
const pX = 9;
const pY = 13;
var Turn = 0;
var checkTurn = -1;
var pTurn = R;  //現在の手番プレイヤーを示す（R～Gを代入することになるはず）
var gameLog = "";

var prex;   //移動前の座標を格納する変数
var prey;   //移動前の座標を格納する変数

var winR = false, winY = false, winG = false;

const dirs = [[-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1]];   //6方向を表す配列

let board = [
//   0,1,2,3,4,5,6,7,8,9,a,b,c
    [N,N,N,N,N,N,R,N,N,N,N,N,N],//0
    [N,N,N,N,N,R,N,R,N,N,N,N,N],//1
    [W,N,W,N,R,N,R,N,R,N,W,N,W],//2
    [N,W,N,W,N,W,N,W,N,W,N,W,N],//3
    [N,N,G,N,W,N,W,N,W,N,Y,N,N],//4
    [N,G,N,G,N,W,N,W,N,Y,N,Y,N],//5
    [G,N,G,N,G,N,W,N,Y,N,Y,N,Y],//6
    [N,N,N,N,N,W,N,W,N,N,N,N,N],//7
    [N,N,N,N,N,N,W,N,N,N,N,N,N],//8
];

var WeightData_Y = [
    //    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1
        [ 4, 0, 3, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0],//2
        [ 0, 3, 0, 2, 0, 1, 0, 0, 0,-1, 0, 0, 0],//3
        [ 0, 0, 2, 0, 1, 0, 0, 0,-1, 0,-2, 0, 0],//4
        [ 0, 0, 0, 1, 0, 0, 0,-1, 0,-2, 0,-3, 0],//5
        [ 0, 0, 0, 0, 0, 0,-1, 0,-2, 0,-3, 0,-4],//6
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//7
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//8
    ];

var WeightData_G = [
    //    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1
        [ 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4],//2
        [ 0, 0, 0,-1, 0, 0, 0, 1, 0, 2, 0, 3, 0],//3
        [ 0, 0,-2, 0,-1, 0, 0, 0, 1, 0, 2, 0, 0],//4
        [ 0,-3, 0,-2, 0,-1, 0, 0, 0, 1, 0, 0, 0],//5
        [-4, 0,-3, 0,-2, 0,-1, 0, 0, 0, 0, 0, 0],//6
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//7
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//8
    ];
//↓//↑
//↓終了用の関数
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

//↑終了用の関数

//↓描画用の関数
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
//↑描画用の関数

//↓手番進行用の関数
function turnChange(){
    checkTurn++;
    if(checkTurn % 3 == 0 && winR == true) checkTurn++;
    if(checkTurn % 3 == 1 && winY == true) checkTurn++;
    if(checkTurn % 3 == 2 && winG == true) checkTurn++;
    if(checkTurn % 3 == 0 && winR && winG) checkTurn++;
    pTurn = checkTurn % 3 + 1;
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
    //gameLog += Turn + "," + ctrans(color) + ",place" + trans(x1) + trans(y1) + ",place" + trans(x2) + trans(y2) + "\n";
    var all_b = "";
    var bit = 0;
    var cnt = 0;
    for(var i=0;i<pX;i++){
        for(var j=0;j<pY;j++){
            if(board[i][j] != N){
                if(cnt == 0){
                    all_b += board[i][j];
                    cnt++;
                    continue;
                }
                if(cnt % 2 == 1){
                    bit = 4*board[i][j];
                    cnt++;
                    continue;
                }
                if(cnt % 2 == 0){
                    bit += board[i][j];
                    all_b += trans(bit);
                    bit = 0;
                    cnt++;
                    continue;
                }
            }
        }
    }
    var tc = "";
    switch(color){
        case W: tc = "W";   break;
        case R: tc = "R";   break;
        case Y: tc = "Y";   break;
        case G: tc = "G";   break;
    }
    var Turn2 = Turn;
    if(Turn2 < 10)  Turn2 = "0"+ Turn2;
    gameLog += Turn2 + "," + tc + ","+ all_b + "\n";
    console.log(gameLog);
}
//↑手番進行用の関数

//↓文字変換用の関数
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
//↑文字変換用の関数

//↓ダウンロード用の関数
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
//↑ダウンロード用の関数