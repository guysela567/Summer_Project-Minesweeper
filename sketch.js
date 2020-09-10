const cols = 30;
const rows = 16;
const size = 40;
const totalBombs = 99;
const gridOffsetY = 100;

const buttonSize = size * 1.3;
const buttonX = (cols * size) / 2 - buttonSize / 2;
const buttonY = gridOffsetY / 2 - buttonSize / 2;

let state = 'ongoing';

// grid
let grid;
let gridArranged = false;

// set timer
let freezeTime = true;
let time = 0;

let timeInterval = setInterval(() => {
  if (!freezeTime) time++;
}, 1000);

// prevent from menu to show on right click
document.addEventListener('contextmenu', event => event.preventDefault());

// sounds
let revealSound;
let gameOverSound;
// images
let blockImg;
let buttonFaces;
// fonts
let sevenSegmentFont;

function preload() {
  // function containing loading files

  blockImg = loadImage('assets/images/unrevealed_block.png');

  sevenSegmentFont = loadFont('assets/fonts/Seven_Segment_Bold.ttf');
  defaultFont = loadFont('assets/fonts/MINE-SWEEPER.ttf');

  revealSound = loadSound('assets/sounds/shatter.mp3');
  gameOverSound = loadSound('assets/sounds/explosion.mp3');

  buttonFaces = {
    winning: loadImage('assets/images/faces/winning.png'),
    ongoing: loadImage('assets/images/faces/smiling.png'),
    gameover: loadImage('assets/images/faces/dead.png'),
    midclick: loadImage('assets/images/faces/mid_click.png')
  };
}

function setup() {
  // triggers when all files are loaded, after preload and before draw
  createCanvas(cols * size, rows * size + gridOffsetY).center('horizontal');

  createGrid();

  revealSound.setVolume(0.4);
  // set pickaxe cursor
  cursor('assets/Pickaxe_Cursor.cur');

  textFont(defaultFont);
  textSize(size / 1.8);
  textAlign(CENTER, CENTER);

  const dialogBtn = select('#instructions-button');
  dialogBtn.position(windowWidth / 2 - width / 2 - 3, 15);
  $(() => {
    $('#instructions-button').css('visibility', '');
    $('#instructions-button').css('width', width + 6);
  });

  const licenseLink = select('#license-link');
  licenseLink.position(windowWidth / 2 - width / 2 + 10, height + 100);
}

function draw() {
  // loops in 60 frames per second- main animations

  if ($('#instructions-dialog').dialog('isOpen')) {
    freezeTime = true;
    return;
  }

  if (gridArranged && freezeTime) freezeTime = false;

  if (time === 999) reset();

  // background
  background(revealedColor);
  drawMenu();
  showGrid();
  if (checkWin()) state = 'winning';
}

function mousePressed() {
  // triggers when mouse is pressed

  if ($('#instructions-dialog').dialog('isOpen')) return;

  // click button
  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
    mouseY > buttonY && mouseY < buttonY + buttonSize) reset();

  if (state == 'gameover') return;

  // add flag on right click
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (mouseButton == RIGHT && grid[i][j].mouseHover() && gridArranged) {
        grid[i][j].isFlagged = !grid[i][j].isFlagged;
      }
    }
  }
}

function mouseReleased() {
  // triggers when mouse is released

  if ($('#instructions-dialog').dialog('isOpen')) return;

  if (state == 'gameover' || state == 'winning') return;

  state = 'ongoing';

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // arrange grid if not arranged
      if (!gridArranged && grid[i][j].mouseHover() && mouseButton == LEFT) {
        arrangeGrid(i, j);
        gridArranged = true;
      }
      // check if cursor is on the cell
      if (grid[i][j].mouseHover() && !grid[i][j].revealed) {

        // left click
        if (mouseButton == LEFT && !grid[i][j].isFlagged) {
          grid[i][j].reveal();

          // unfreeze time on first click
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