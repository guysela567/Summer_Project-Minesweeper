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
  showButton();
  pop();
}

function showButton() {
  image(buttonFaces[state], buttonX, buttonY, buttonSize, buttonSize);
}