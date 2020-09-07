function showTimer() {
  // shows a timer on the menu

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

  // draw the timer
  fill(255, 0, 0, 100);
  text('888', 50, 50);
  fill(255, 0, 0);
  text(nf(time, 3), 50, 50);
}

function showFlagLeft() {
  // show amount of flags left on the menu

  const nfAmount = flagsLeft() >= 0 ? 3 : 2;
  const rectW = flagsLeft() < -99 ? 130 : 100;
  const rectX = flagsLeft() < -99 ? width - 165 : width - 135;

  fill(0);
  rect(rectX, gridOffsetY * 1 / 4, rectW, gridOffsetY * 1 / 2, 5);
  fill(255, 0, 0, 100);
  textAlign(RIGHT);
  text('888', width - 35, 50);
  fill(255, 0, 0);
  text(nf(flagsLeft(), nfAmount), width - 35, 50);
}

function drawMenu() {
  /// shows the top menu

  push();
  /// menu frame
  textFont(sevenSegmentFont);
  showTimer();
  showFlagLeft();
  showButton();
  pop();
}

function showButton() {
  // shows the smily button on the middle of the menu
  image(buttonFaces[state], buttonX, buttonY, buttonSize, buttonSize);
}