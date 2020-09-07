function createGrid() {
  // creates the grid 2d array and initializes it with cell objects

  grid = Array(cols);
  for (let i = 0; i < cols; i++) grid[i] = Array(rows);

  // add cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }
}

function showGrid() {
  // shows and updates every cell in the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
      grid[i][j].update();
    }
  }
}

function getNeighborsIndexes(x, y) {
  // returns all neghbors indexes in 1d form

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

function addBombs(x, y) {
  // add bombs to grid array

  const options = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      options.push({
        x: i,
        y: j
      });
    }
  }

  // remove from options
  for (let index of getNeighborsIndexes(x, y))
    options.splice(index, 1);

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
  // added the bombs and non-bomb cell vaules of the cells in the grid

  addBombs(x, y);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].countNeighbors();
    }
  }
}

function gameOver() {
  // triggers when player lost

  state = 'gameover';
  gameOverSound.play();
  freezeTime = true;

  // reveal all remaining bombs
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      // reveal all bombs
      if (grid[i][j].isBomb && !grid[i][j].isFlagged)
        grid[i][j].reveal();
      // mark false flags
      if (grid[i][j].isFlagged && !grid[i][j].isBomb)
        grid[i][j].falseFlag = true;
    }
}

function flagsLeft() {
  // returns amount of flags left to mark
  let totalFlags = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].isFlagged) totalFlags++;
    }
  }

  return totalBombs - totalFlags;
}

function checkWin() {
  // checks if the player has won, if he did, freeze time
  let revealedCells = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].revealed && !grid[i][j].isBomb) revealedCells++;
    }
  }

  if (revealedCells == cols * rows - totalBombs) {
    freezeTime = true;
    return true
  } else return false;
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