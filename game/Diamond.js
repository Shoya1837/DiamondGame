"use strict"

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
    if(     place64.style.backgroundColor == "red"
        &&  place66.style.backgroundColor == "red"
        &&  place68.style.backgroundColor == "red"
        &&  place75.style.backgroundColor == "red"
        &&  place77.style.backgroundColor == "red"
        &&  place86.style.backgroundColor == "red"){
            winR = true;
    }
    if(     place20.style.backgroundColor == "yellow"
        &&  place22.style.backgroundColor == "yellow"
        &&  place24.style.backgroundColor == "yellow"
        &&  place31.style.backgroundColor == "yellow"
        &&  place33.style.backgroundColor == "yellow"
        &&  place42.style.backgroundColor == "yellow"){
            winY = true;
    }
    if(     place28.style.backgroundColor == "green"
        &&  place2a.style.backgroundColor == "green"
        &&  place2c.style.backgroundColor == "green"
        &&  place39.style.backgroundColor == "green"
        &&  place3b.style.backgroundColor == "green"
        &&  place4a.style.backgroundColor == "green"){
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

function clicked(e){
    var id = e.target.id;
    var i = parseInt(trans(id.charAt(5)));
    var j = parseInt(trans(id.charAt(6)));
    var color = e.target.style.backgroundColor;
    console.log(i+":"+j);
    if(color == ctrans(O)){ //クリックした場所がオレンジ
        movePiece(prex,prey,i,j,pTurn);
        update();
        return;
    }
    if(color != ctrans(pTurn))  return;
    prex = i;
    prey = j;
    toW(O); //O->W
    canMove(i, j);
    showBoard();

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

function setnotMove(){
    var nR = [  [ 2, 0], [ 2, 2], [ 3, 1],//左上黄
                [ 5,11], [ 6,10], [ 6,12],//右下黄
                [ 2,10], [ 2,12], [ 3,11],//右上緑
                [ 5, 1], [ 6, 0], [ 6, 2] //左下緑
            ];
    var nY = [  [ 0, 6], [ 1, 5], [ 1, 7],//上赤
                [ 7, 5], [ 7, 7], [ 8, 6],//下赤
                [ 2,10], [ 2,12], [ 3,11],//右上緑
                [ 5, 1], [ 6, 0], [ 6, 2] //左下緑
            ];
    var nG = [  [ 0, 6], [ 1, 5], [ 1, 7],//上赤
                [ 7, 5], [ 7, 7], [ 8, 6],//下赤
                [ 2, 0], [ 2, 2], [ 3, 1],//左上黄
                [ 5,11], [ 6,10], [ 6,12] //右下黄
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

