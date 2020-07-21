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
			fill(revealedColor);
			stroke(strokeColor);
			strokeWeight(3);
			rect(this.x, this.y, size, size);

			// add value numbers if cell is not a bomb or has a value of 0

			// if (!this.isBomb && this.value != 0) textToShow = this.value;
			// else if (this.isBomb) textToShow = '💣';
			let textToShow = !this.isBomb && this.value != 0 ? this.value : this.isBomb ? '💣' : '';

			// text
			noStroke();
			fill(0);
			text(textToShow, this.x + size / 2, this.y + size / 2);
		} else {
			image(blockImg, this.x, this.y, size, size);

			// flag
			if (this.isFlagged) {
				// text
				noStroke();
				fill(0);
				text('🚩', this.x + size / 2, this.y + size / 2);
			}
		}
	}

	mouseHover() {
		return (mouseX > this.x && mouseX < this.x + size 
			&& mouseY > this.y && mouseY < this.y + size);
	}

	reveal() {
		this.revealed = true;

		if (this.value == 0) {
			for (let i = this.i - 1; i <= this.i + 1; i++) {
				for (let j = this.j - 1; j <= this.j + 1; j++) {
					if (i >= 0 && i < cols && j >= 0 && j < rows 
						&& !grid[i][j].isBomb && !grid[i][j].revealed) {

						grid[i][j].reveal();
					}
				}
			}
		}
	}
}