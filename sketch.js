const cols = 24;
const rows = 20;
const size = 40;
const totalBombs = 50;
const gridOffsetY = 100;

// colors
const revealedColor = 189;
const strokeColor = 123;

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

setInterval(() => {
	time++;
}, 1000)

// sounds
let revealSound;
let gameOverSound;


// prevent from menu to show on right click
document.addEventListener('contextmenu', event => event.preventDefault());

function preload() {
	blockImg = loadImage('assets/unrevealed_block.png');
	sevenSegmentFont = loadFont('assets/Seven_Segment_Bold.ttf');
	revealSound = loadSound('assets/shatter.mp3');
	gameOverSound = loadSound('assets/explosion.mp3');
}

function setup() {
	createCanvas(cols * size, rows * size + gridOffsetY);
	textSize(size / 1.4);
	textAlign(CENTER, CENTER);

	arrangeGrid();

	revealSound.setVolume(0.4);
}

function draw() {
	background(revealedColor);

	// menu
	push();

	fill(255, 0, 0);
	noStroke();
	textSize(40);
	textFont(sevenSegmentFont);
	textAlign(LEFT, CENTER);

	// show timer
	fill(50, 0, 0, 100);
	text('888', 50, 50);
	fill(220, 0, 0);
	text(nf(time, 3), 50, 50);

	// show flags left
	fill(50, 0, 0, 100);
	text('888', width - 120, 50);
	fill(220, 0, 0);
	text(nf(flagsLeft(), 3), width - 120, 50);

	pop();

	showGrid();
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
		}
	}
}

function addBombs() {
	const options = [];
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			options.push({x: i, y: j});
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
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			if (grid[i][j].mouseHover()) {
				if (mouseButton == LEFT && !grid[i][j].isFlagged) {
					// left click
					grid[i][j].reveal();

					if (grid[i][j].isBomb) gameOver() 
					else revealSound.play();

				} else if (mouseButton == RIGHT && !grid[i][j].revealed) {
					// right click
					grid[i][j].isFlagged = !grid[i][j].isFlagged;
				}
			}
		}
	}
}

function gameOver() {
	gameOverSound.play();
	noLoop();
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
