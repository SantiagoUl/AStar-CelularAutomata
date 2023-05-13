let w;
let columns;
let rows;
let board;
let next;
var startEndTracker = 0;

function setup() {
  frameRate(10);
  createCanvas(1200,800);
  w = 5;
  columns = floor(width / w);
  rows = floor(height / w);
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init_();
}

function draw() {
}

function keyPressed() {
  if(key == 'r'){
    init_();
  }
}

function init_() {
  startEndTracker = 0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let rand = floor(random(100))
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      else{
        if(rand < 45){
          board[i][j] = 1;
        }
        else board[i][j] = 0;
      }
      next[i][j] = 0;
    }
  }
  for(let i = 0; i < 5; i++){
    generate();
  }
  background('#8020BC');
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == 1)) fill('#8020BC')
      else fill(31,31,31);
      noStroke();
      rect(i * w, j * w, w, w);
    }
  }
}

function generate() {
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }
      
      neighbors -= board[x][y];
      if      ((board[x][y] == 1) && (neighbors >=  4)) next[x][y] = 1;
      else if ((board[x][y] == 0) && (neighbors >=  5)) next[x][y] = 1;
      else                                             next[x][y] = board[x][y];
    }
  }

  let temp = board;
  board = next;
  next = temp;
}

