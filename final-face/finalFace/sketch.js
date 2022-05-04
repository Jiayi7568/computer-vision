// The actual helpful link: https://www.npmjs.com/package/@tensorflow-models/face-landmarks-detection

// TO-DO: Make a recursive function for "collision detection"

let model;
let faces;

const w = 640;
const h = 480;

function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  colorMode(HSB, 255);

  loadFaceModel();
}

function draw() {
  background(200);

  if (capture.loadedmetadata && model !== undefined) {
    getFaces();
  }

  // draw the camera feed
  push();
  translate(w, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();

  // where the magic happens
  if (faces !== undefined) {
    const distanceThreshold = 350;
    
    

    if (faces.length == 1) {
      scrambleFace(faces[0]);
    } else {
      for (let i = 0; i < faces.length; i++) {
        for (let j = (i + 1); j < faces.length; j++) {
          
          let nose1 = createVector(
            faces[i].scaledMesh[0][0],
            faces[i].scaledMesh[0][1]
          );
          let nose2 = createVector(
            faces[j].scaledMesh[0][0],
            faces[j].scaledMesh[0][1]
          );

          let d = p5.Vector.dist(nose1, nose2);

          if (d > distanceThreshold) {
            scrambleFace(faces[i]);
          } else {
            linkFaces(faces[i], faces[j]);
          }
        }
      }
    }
    text(faces.length, 10, 10);
  }
}

// create a scramble of randomly generated lines on an individual's face

function scrambleFace(face) {
  for (let i = 0; i < face.scaledMesh.length; i += 2) {
    let ri1 = floor(random(face.scaledMesh.length)); // random index 1
    let ri2 = floor(random(face.scaledMesh.length)); // random index 2

    let rlm1 = createVector(face.scaledMesh[ri1][0], face.scaledMesh[ri1][1]); // random landmark 1
    let rlm2 = createVector(face.scaledMesh[ri2][0], face.scaledMesh[ri2][1]); // random landmark 2

    stroke(127, 255, 255);
    beginShape(LINES);
    vertex(rlm1.x, rlm1.y);
    vertex(rlm2.x, rlm2.y);
    endShape();
  }
}

// link two faces together. This function makes it easy to apply face linking to 2 or more faces dynamically.
// the code is basically the same as the scrambleFace function above, but instead of picking to random indices from the same face, one random index is chosen from one face, and one random index is chosen from the other face

function linkFaces(face1, face2) {
  for (let i = 0; i < face1.scaledMesh.length; i += 2) {
    let ri1 = floor(random(face1.scaledMesh.length)); // random index 1
    let ri2 = floor(random(face2.scaledMesh.length)); // random index 2

    let rlm1 = createVector(face1.scaledMesh[ri1][0], face1.scaledMesh[ri1][1]); // random landmark on face 1
    let rlm2 = createVector(face2.scaledMesh[ri2][0], face2.scaledMesh[ri2][1]); // random landmark on face 2

    let h = map(faces.length, 2, 6, 0, 255);
    stroke(h, 255, 255);
    beginShape(LINES);
    vertex(rlm1.x, rlm1.y);
    vertex(rlm2.x, rlm2.y);
    endShape();
  }
}

async function loadFaceModel() {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );
}

async function getFaces() {
  const predictions = await model.estimateFaces({
    input: document.querySelector("video"),
    returnTensors: false,
    flipHorizontal: true,
    predictIrises: false, // set to 'false' if sketch is running too slowly
  });

  if (predictions.length === 0) {
    faces = undefined;
  } else {
    faces = predictions;
  }
}
