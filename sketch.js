const cols = 24;
const rows = 20;
const size = 40;
const totalBombs = 50;
const gridOffsetY = 100;

const buttonSize = size * 1.3;
let buttonX;
const buttonY = gridOffsetY / 2 - buttonSize / 2;

let state = 'ongoing';

/*

three difficulties:

cols 10, 20, 24
rows 8, 18, 20
totalbombs 10, 39, 99

*/

// grid
let grid;

// images
let blockImg;

// fonts
let sevenSegmentFont;

// set timer
let time = 0;

let timeInterval = setInterval(() => {
  time++;
}, 1000);

// sounds
let revealSound;
let gameOverSound;


// prevent from menu to show on right click
document.addEventListener('contextmenu', event => event.preventDefault());

// buttun faces
let winningFace;
let smilingFace;
let deadFace;
let midClickFace;

function preload() {
  blockImg = loadImage('assets/unrevealed_block.png');
  sevenSegmentFont = loadFont('assets/Seven_Segment_Bold.ttf');
  defaultFont = loadFont('assets/Minesweeper_Regular_Font.ttf');
  revealSound = loadSound('assets/shatter.mp3');
  gameOverSound = loadSound('assets/explosion.mp3');
  
  winningFace = loadImage('assets/faces/winning.png');
  smilingFace = loadImage('assets/faces/smiling.png');
  deadFace = loadImage('assets/faces/dead.png');
  midClickFace = loadImage('assets/faces/mid_click.png');
}

function setup() {
  createCanvas(cols * size, rows * size + gridOffsetY).center('horizontal');
  textSize(size / 1.8);
  textAlign(CENTER, CENTER);

  arrangeGrid();

  revealSound.setVolume(0.4);

  // set pickaxe cursor
  cursor('assets/Pickaxe_Cursor.cur');

  textFont(defaultFont);

  // button location
  buttonX = width / 2 - buttonSize / 2;
}

function draw() { 
  console.log(state);

  // background
  background(revealedColor);
  
  // menu
  push();

  fill(255, 0, 0);
  noStroke();
  textSize(40);
  textFont(sevenSegmentFont);
  textAlign(LEFT, CENTER);

  // show timer
  fill(10, 0, 0, 50);
  text('888', 50, 50);
  fill(255, 0, 0);
  text(nf(time, 3), 50, 50);

  // show flags left
  fill(10, 0, 0, 50);
  textAlign(RIGHT);
  text('888', width - 35, 50);
  fill(255, 0, 0);
  text(nf(flagsLeft(), 3), width - 35, 50);

  pop();

  // face button
  showButton();

  // grid
  showGrid();
}

async function showButton() {
  let smily;
  switch(state) {
    case 'ongoing':
      smily = await smilingFace;
      break;
    case 'gameover':
      smily = await deadFace;
      break;
    case 'midclick':
      smily = await midClickFace;
      break;
    case 'winning':
      smily = await winningFace;
  }

  image(smily, buttonX, buttonY, buttonSize, buttonSize);
}

function reset() {
  // reset grid
  arrangeGrid();

  // reset time and interval
  time = 0;
  setInterval(timeInterval);

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

function addBombs() {
  const options = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      options.push({
        x: i,
        y: j
      });
    }
  }

  for (let k = 0; k < totalBombs; k++) {
    const index = floor(random(options.length));
    const choice = options[index];
    grid[choice.x][choice.y].isBomb = true;
    options.splice(index, 1);
  }
}


function arrangeGrid() {
  createGrid();
  addBombs();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].countNeighbors();
    }
  }
}

function mousePressed() {
  // click button
  if (mouseX > buttonX && mouseX < buttonX + buttonSize
    && mouseY > buttonY && mouseY < buttonY + buttonSize) {

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
  if (state == 'gameover') return;

  state = 'ongoing';

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // check if cursor is on the cell
      if (grid[i][j].mouseHover() && !grid[i][j].revealed) {

        if (mouseButton == LEFT && !grid[i][j].isFlagged) {
          // left click
          grid[i][j].reveal();

          // check if player revealed bomb
          if (grid[i][j].isBomb) gameOver();
          else revealSound.play();
        }
      }
    }
  }
}
 
function gameOver() {
  state = 'gameover';
  gameOverSound.play();
  clearInterval(timeInterval);

  // TODO: reveal all remaining bombs
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