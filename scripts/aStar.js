var S = 20;
let height = 800;
let width = 1200;
let start;
let end;
var board = new Array(width/S);
var startEndTracker = 0;
var path = [];
var toStart = false;
var openSet = [];
var closedSet = [];



function removeFromArray(arr, elt) {
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.x, a.y, b.x, b.y);
  return d;
}
function setup() {
  createCanvas(width, height);
  drawBoard();
}
function spot(x, y, wall){
  this.x = x;
  this.y = y;
  this.wall = wall;
  this.f = 0;
  this.g = 0;
  this.h = 0;

  // Neighbors
  this.neighbors = [];

  // Where did I come from?
  this.previous = undefined;

  this.show = function(col = null){
    if(!col){
      if(wall){
        fill(100);
      }
      else if(!wall)fill(255);
    }
    else{
      fill(col);
    }
    square(x*S, y*S, S);
  }
  this.addNeighbors = function(board) {
    var x = this.x;
    var y = this.y;
    if (x < width/S - 1) {
      this.neighbors.push(board[x + 1][y]);
    }
    if (x > 0) {
      this.neighbors.push(board[x - 1][y]);
    }
    if (y < height/S - 1) {
      this.neighbors.push(board[x][y + 1]);
    }
    if (y > 0) {
      this.neighbors.push(board[x][y - 1]);
    }
  }
}

function drawBoard(){
  for(var i = 0; i < width/S; i++){
    board[i] = new Array(height/S);
    for(var j = 0; j < height/S; j++){
      let rand = round(random(100));
      if(rand < 30){
        fill(255,0,0);
        board[i][j] = new spot(i, j, true);
      }
      else {
        fill(255);
        board[i][j] = new spot(i, j, false);
      }
      square(S*i, S*j, S);
    }
  }
  for (var i = 0; i < width/S; i++) {
    for (var j = 0; j < height/S; j++) {
      board[i][j].addNeighbors(board);
    }
  }
}
function mousePressed(){
  if((mouseX <= width && mouseX >= 0) && (mouseY <= height && mouseY >=0)){
    let mx = floor(mouseX/S);
    let my = floor(mouseY/S);
    if(startEndTracker == 0){
      fill(0,255,0);
      start = board[mx][my];
      openSet.push(start);
    }
    else if(startEndTracker == 1){
      fill(0,0,255);
      end = board[mx][my];
      toStart=true;
    }
    startEndTracker++;
    if(startEndTracker < 3){
      square(mx*S, my*S, S);
    }
  }
}
function checkCells(){
  for(var i = 0; i < width/S; i++){
    for(var j = 0; j < board[i].length; j++){
      if(board[i][j] === start){
        board[i][j].show(color(0,255,0));
      }
      else if(board[i][j] === end){
        board[i][j].show(color(0,0,255));
      }
      else{
        board[i][j].show();
      }
    }
  }
}
function keyPressed(){
  if(key == 'r'){
    drawBoard();
    startEndTracker=0;
  }
  if(key == 'c'){
    checkCells();
  }
}
function draw(){
  if(toStart){
    if (openSet.length > 0) {
      // Best next option
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];

      // Did I finish?
      if (current === end) {
        noLoop();
        console.log("DONE!");
      }

      // Best option moves from openSet to closedSet
      removeFromArray(openSet, current);
      closedSet.push(current);

      // Check all the neighbors
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        // Valid next spot?
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + heuristic(neighbor, current);

          // Is this a better path than before?
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          // Yes, it's a better path
          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }

      }
      // Uh oh, no solution
    } else {
      console.log('no solution');
      noLoop();
      return;
    }

    for(var i = 0; i < width/S; i++){
      for(var j = 0; j < board[i].length; j++){
        if(board[i][j] === start){
          board[i][j].show(color(0,255,0));
        }
        else if(board[i][j] === end){
          board[i][j].show(color(0,0,255));
        }
        else{
          board[i][j].show();
        }
      }
    }

    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(255, 0, 0, 50));
    }

    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0, 255, 0, 50));
    }


    // Find the path by working backwards
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    beginShape();
    for (var i = 0; i < path.length; i++) {
      strokeWeight(4);
      stroke(0);
      vertex(path[i].x * S + S / 2, path[i].y * S + S / 2);
      noFill();
    }
    endShape(); 
    noStroke();
    strokeWeight(1);
  }
}