class Cell {
  constructor(i, j) {

    this.i = i;
    this.j = j;

    this.x = i * size;
    this.y = j * size + gridOffsetY;

    this.revealed = false;
    this.value = null;
    this.isBomb = false;
    this.isFlagged = false;

    this.bombPressed = false;
    this.falseFlag = false;
  }

  countNeighbors() {
    if (this.isBomb) {
      return;
    }

    let sum = 0;
    for (let i = this.i - 1; i <= this.i + 1; i++) {
      for (let j = this.j - 1; j <= this.j + 1; j++) {
        if (i >= 0 && i < cols && j >= 0 && j < rows && grid[i][j].isBomb) {
          sum++;
        }
      }
    }

    this.value = sum;
  }

  show() {
    if (this.revealed) {
      fill(this.bombPressed ? color(250, 10, 0) : revealedColor);
      stroke(strokeColor);
      strokeWeight(3);
      rect(this.x, this.y, size, size);

      // add value numbers if cell is not a bomb or has a value of 0
      const textToShow = !this.isBomb && this.value != 0 ? this.value : this.isBomb ? '*' : '';

      // show text
      noStroke();
      // if value is not none fill with corresponding color, otherwize fill with black
      fill(this.value ? colors[this.value - 1] : color(0, 0, 0));
      text(textToShow, this.x + size / 2, this.y + size / 2);
    } else {

      if (this.mouseHover() && state == 'midclick' && !this.isFlagged) {
        fill(revealedColor);
        rect(this.x, this.y, size, size);
      } else {

        image(blockImg, this.x, this.y, size, size);

        // flag
        if (this.isFlagged) {
          if (this.falseFlag) {
            // false flag
            noStroke();
            fill(0);
            text('*', this.x + size / 2, this.y + size / 2);
            strokeWeight(3);
            stroke(250, 10, 0);
            line(this.x + 7, this.y + 7, this.x + size - 7, this.y + size - 7);
            line(this.x + size - 7, this.y + 7, this.x + 7, this.y + size - 7);
          } else {
            // regular flag
            noStroke();
            fill(0);
            push();
            textFont('sans serif');
            text('🚩', this.x + size / 2, this.y + size / 2);
            pop();
          }
        }
      }
    }
  }

  update() {
    if (this.mouseHover() && mouseIsPressed && mouseButton == LEFT 
    && state == 'ongoing' && !this.revealed) {
      state = 'midclick';
    }
  }

  mouseHover() {
    return (mouseX > this.x && mouseX < this.x + size &&
      mouseY > this.y && mouseY < this.y + size);
  }

  reveal() {
    this.revealed = true;

    // reveal neighbors if value is 0
    if (this.value == 0) {
      for (let i = this.i - 1; i <= this.i + 1; i++) {
        for (let j = this.j - 1; j <= this.j + 1; j++) {
          if (i >= 0 && i < cols && j >= 0 && j < rows &&
            // reveal neighbor only if it's not a bomb or already revealed
            !grid[i][j].isBomb && !grid[i][j].revealed) {

            // repeat the process with recursion
            grid[i][j].reveal();
          }
        }
      }
    }
  }
}