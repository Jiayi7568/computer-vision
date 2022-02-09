let particles = [];
let letters =["👁"]
let capture;
const w = 640;
const h = 360;
const stepSize = 20; /* declare stepSize as a global variable so we can use it in setup() and draw() */





function setup() {
  createCanvas(w, h);
  background(10);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  rectMode(CENTER)
  
 /*
    Using the particles array, we push randomly-chosen letters into the array;
    how do we know how many letters to generate? the width * height of the feed divided by
    the stepSize squared. Once we've stored the random letters in the particles array, change
    "setLetters" to false to ensure that doesn't happen again.
  */
  
  const NUM_LETTERS = floor((w * h)/(stepSize*stepSize)) // floor rounds the number down (basically doing what int() does)
  for(let i = 0; i < NUM_LETTERS; i++) {
    let randomLetter = random(letters) // returns a random letter from the letters array
    particles.push(randomLetter);
  }
  console.log("array of random letters: ", particles)
}

function draw() {
  background(0);
  noStroke();
  
  
  capture.loadPixels(); // automatically calls an array of pixels (from the input video source)

    
  push()
  translate(width, 0);
  scale(-1, 1)

  /*
    The "letterIndex" is a quick way to keep track of which letter should be pulled from the particles array.
    It increments through each step of the nested for-loop, and then is reset back to 0 with each frame
  */
  let letterIndex = 0;
  for(let y = 0; y < capture.height; y+=stepSize) {
    for(let x = 0; x < capture.width; x+=stepSize) {

      const i = (x + y * width) * 4;

      const r = capture.pixels[i]; // red channel
      const g = capture.pixels[i+1]; // green channel
      const b = capture.pixels[i+2]; // blue channel
      // capture.pixels[i+3] = 1; // alpha channel

      const brightness = (r + g + b) / 3 

      const size = map(brightness, 0, 255, 5, 20)
      const rotation = map(brightness, 0, 255, 0, 2*PI)
      const j = int(map(brightness,0,255,0,25));

      push();
        translate(x,y);
        rotate(rotation);
        fill(brightness+30);
        textSize(size);
        textAlign(CENTER);

        text(particles[letterIndex], 0, 0); /* use the letterIndex to access the correct letter */
      pop();
      letterIndex++;
    }
  }
  pop();
}


