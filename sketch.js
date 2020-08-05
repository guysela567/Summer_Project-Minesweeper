const cols = 30;
const rows = 16;
const size = 40;
const totalBombs = 99;
const gridOffsetY = 100;

const buttonSize = size * 1.3;
let buttonX;
const buttonY = gridOffsetY / 2 - buttonSize / 2;

let state = 'ongoing';
let buttonFaces;

/*

three difficulties:

cols 10, 20, 24
rows 8, 18, 20
totalbombs 10, 39, 99

*/

// grid
let grid;
let gridArranged = false;

// images
let blockImg;

// fonts
let sevenSegmentFont;

// set timer
let freezeTime = true;
let time = 0;

let timeInterval = setInterval(() => {
  if (!freezeTime) time++;
}, 1000);

// sounds
let revealSound;
let gameOverSound;

// prevent from menu to show on right click
document.addEventListener('contextmenu', event => event.preventDefault());

function preload() {
  blockImg = loadImage('assets/unrevealed_block.png');
  sevenSegmentFont = loadFont('assets/Seven_Segment_Bold.ttf');
  defaultFont = loadFont('assets/Minesweeper_Regular_Font.ttf');
  revealSound = loadSound('assets/shatter.mp3');
  gameOverSound = loadSound('assets/explosion.mp3');

  buttonFaces = {
    'winning': loadImage('assets/faces/winning.png'),
    'ongoing': loadImage('assets/faces/smiling.png'),
    'gameover': loadImage('assets/faces/dead.png'),
    'midclick': loadImage('assets/faces/mid_click.png')
  }
}

function setup() {
  createCanvas(cols * size, rows * size + gridOffsetY).center('horizontal');
  textSize(size / 1.8);
  textAlign(CENTER, CENTER);

  createGrid();

  revealSound.setVolume(0.4);

  // set pickaxe cursor
  cursor('assets/Pickaxe_Cursor.cur');

  textFont(defaultFont);

  // button location
  buttonX = width / 2 - buttonSize / 2;
}     
         
function showTimer() {
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(10, 10, width - 20, gridOffsetY - 20);
  
  fill(255, 0, 0);
  noStroke();
  textSize(40);
  textAlign(LEFT, CENTER);
  
  fill(0);
  rect(50, gridOffsetY * 1 / 4, 100, gridOffsetY * 1 / 2, 5);
  
  // show timer
  fill(255, 0, 0, 100);
  text('888', 50, 50);
  fill(255, 0, 0);
  text(nf(time, 3), 50, 50);
}

function showFlagLeft() {
  // show flags left
  let nfAmount;
  let rectW = 0;
  let rectX = 0;
  if (flagsLeft() >= 0) {
    nfAmount = 3;
    rectW = 100;
    rectX = width - 135;
  } else if (flagsLeft() < 0 && flagsLeft() >= -99) {
    nfAmount = 2;
    rectW = 100;
    rectX = width - 135;
  } else if (flagsLeft() < -99) {
    nfAmount = 2;
    rectW = 130;
    rectX = width - 165;
  }
  
  fill(0);
  rect(rectX, gridOffsetY * 1 / 4, rectW, gridOffsetY * 1 / 2, 5);
  fill(255, 0, 0, 100);
  textAlign(RIGHT);
  text('888', width - 35, 50);
  fill(255, 0, 0);
  text(nf(flagsLeft(), nfAmount), width - 35, 50);
}

function drawMenu() {
  push();
  // menu frame
  textFont(sevenSegmentFont);
  showTimer();
  showFlagLeft();
  pop();
}

function draw() {
  // background
  background(revealedColor);

  // menu
  drawMenu();

  // face button
  showButton();

  // grid
  showGrid();

  if (checkWin()) state = 'winning';
}

function showButton() {
  image(buttonFaces[state], buttonX, buttonY, buttonSize, buttonSize);
}

function reset() {
  // reset grid
  createGrid();
  gridArranged = false;

  // freez time
  freezeTime = true;

  // reset time and freez 
  time = 0;
  freezeTime = true;

  // change state back to ongoing
  state = 'ongoing';
}

function createGrid() {
  grid = Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = Array(rows);
  }

  // add cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }
}

function showGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
      grid[i][j].update();
    }
  }
}

function getNeighbors(x, y){
  // add cell and neighbors locations to an array
  let locations = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < cols && j >= 0 && j < rows) {
        const index = i + (j * cols);
        locations.push(index);
      }
    }
  }
  // sort in descending order
  locations = locations.sort((a, b) => b - a);
  return locations;
}

function addBombs(x , y) {
  const options = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      options.push({ x: i, y: j });
    }
  }

  // remove from options
  for (let index of getNeighbors(x, y)) {
    options.splice(index, 1);
  }
  
  // add all bombs
  for (let i = 0; i < totalBombs; i++) {
    const index = floor(random(options.length));
    const choice = options[index];
    grid[choice.x][choice.y].isBomb = true;
    // remove chosen index from options
    options.splice(index, 1);
  }
}

function arrangeGrid(x, y) {
  addBombs(x, y);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].countNeighbors();
    }
  }
}

function mousePressed() {
  // click button
  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
    mouseY > buttonY && mouseY < buttonY + buttonSize) {

    reset();
  }

  if (state == 'gameover') return;

  // add flag on right click
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (mouseButton == RIGHT && grid[i][j].mouseHover()) {
        grid[i][j].isFlagged = !grid[i][j].isFlagged;
      }
    }
  }
}

function mouseReleased() {
  if (state == 'gameover' || state == 'winning') return;
  
  state = 'ongoing';

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      // arrange grid if not arranged
      if (!gridArranged && grid[i][j].mouseHover()) {
        arrangeGrid(i, j);
        gridArranged = true;
      }

      
      // check if cursor is on the cell
      if (grid[i][j].mouseHover() && !grid[i][j].revealed) {

        // left click
        if (mouseButton == LEFT && !grid[i][j].isFlagged) {
          grid[i][j].reveal();
          
          // unfreez time on first click
          if (freezeTime) freezeTime = false;

          // check if player revealed bomb
          if (grid[i][j].isBomb) {
            // mark pressed bomb with red background
            grid[i][j].bombPressed = true;
            gameOver();
          }
          else revealSound.play();
        }
      }
    }
  }
}

function gameOver() {
  firstPrees = false;
  state = 'gameover';
  gameOverSound.play();
  freezeTime = true;


  // reveal all remaining bombs
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      
      // reveal all bombs
      if (grid[i][j].isBomb && !grid[i][j].isFlagged) {
        grid[i][j].reveal();
      }

      // mark false flags
      if (grid[i][j].isFlagged && !grid[i][j].isBomb) {
        grid[i][j].falseFlag = true;
      }
    }
  }
}

function flagsLeft() {
  let totalFlags = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].isFlagged) totalFlags++;
    }
  }
  return totalBombs - totalFlags;
}

function checkWin() {
  let revealedCells = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].revealed && !grid[i][j].isBomb) revealedCells++;
    }
  }

  if (revealedCells == cols * rows - totalBombs) {
    freezeTime = true;
    return true
  } else {
    return false;
  }
}