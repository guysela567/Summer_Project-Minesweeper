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

function draw() {
  // background
  background(revealedColor);

  // menu
  drawMenu();



  // grid
  showGrid();

  if (checkWin()) state = 'winning';
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
          } else revealSound.play();
        }
      }
    }
  }
}