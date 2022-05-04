let w = 640;
let h = 480;
let capture;
let threshold = 120; // lower threshold means letters will only stop on very dark spots
const fallRate = 2; // higher == faster letters
let fallingLetters = [];

function setup() {
  createCanvas(w, h);

  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  const size = 14;
  textSize(size);

  let sourceText = "It's raining text all over the place. Look at all these little letters!";

  for (let i = 0; i < sourceText.length; i++) {
    let currentLetter = new FallingLetter(sourceText[i], i * size, 0);
    fallingLetters.push(currentLetter);
  }
}

function draw() {
  background(255);
  capture.loadPixels();
  if (capture.pixels.length > 0) {

    // loop through all the fallingLetters
    for (let i = 0; i < fallingLetters.length; i++) {

      // while the current fallingLetter is greater than 0 AND the brightness of the current pixel where the letter is falling is less than our threshold (which means the letter has encountered a dark pixel), then continue to raise the letter up.
      while (fallingLetters[i].y > 0 && getBrightness(capture.pixels, i) < threshold) {
        fallingLetters[i].y--;
      }

      // if the letter reaches the bottom of the screen, loop back around to the top and keep falling
      if (fallingLetters[i].y >= h) {
        fallingLetters[i].y = 0;
      }
      
      // else, the fallingLetter keeps falling
      else {
        fallingLetters[i].y+=fallRate;
      }
    }
  }

  // flip and draw the camera feed to the screen
  push();
    translate(w, 0);
    scale(-1, 1);
    image(capture, 0, 0);
  pop();

  // draw the fallingLetters to the screen
  for(let f of fallingLetters) {
    fill(0, 255, 0);
    text(f.char, f.x, f.y-2);
  }
}

class FallingLetter {
  constructor(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;
  }
}

// get the brightness of the pixel at the current position of the letter
function getBrightness(capturePixels, currentLetter) {
  
  // store the current falling letter
  const fl = fallingLetters[currentLetter];
  
  // calculate the index of the pixel where the letter is (note the "w-fl.x", which accounts for the mirrored webcam image)
  const index = ((w-fl.x) + fl.y * width) * 4
  let r = capturePixels[index + 0];
  let g = capturePixels[index + 1];
  let b = capturePixels[index + 2];
  
  return (r + g + b) / 3;
}
