
let model;
let faces;
let distance;
var sound;


const w = 640;
const h = 480;



function setup() {
    createCanvas(innerWidth, innerHeight);

    capture = createCapture(VIDEO);
    capture.size(w, h);
    capture.hide();

    loadFaceModel();
    song = loadSound("4_01.mp3", loaded);

}

function loaded() {
    song.play();
}

function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
}

function setScale() {
    if (innerWidth / w >= innerHeight / h) {
        return innerWidth / w;
    } else {
        return innerHeight / h;
    }
}


function draw() {
    background(200);
    if (capture.loadedmetadata && model !== undefined) {
        getFaces();
    }

    push();
    scale(setScale(), setScale());
    translate(w, 0);
    scale(-1, 1);
    image(capture, 0, 0);
    pop();


    if (faces !== undefined) {


        for (const f of faces) {


            let rightEyeIris = f.annotations.rightEyeIris;
            let leftEyeIris = f.annotations.leftEyeIris;

            let rightEyeP1 = createVector(rightEyeIris[1][0], rightEyeIris[1][1])
            let rightEyeP3 = createVector(rightEyeIris[3][0], rightEyeIris[3][1])
            let rightEyeP2 = createVector(rightEyeIris[2][0], rightEyeIris[2][2])
            let rightEyeP4 = createVector(rightEyeIris[4][0], rightEyeIris[4][2])
        


            let d = rightEyeP1.dist(rightEyeP3);
            let d2 = rightEyeP2.dist(rightEyeP4);

            //   console.log(d);
            //   console.log(d2);


            if (d > 11.3 & d2 > 1.3) {

                // console.log('positive');
            } else {
                // console.log('negative');
                stroke(0, 1500, 1300);
                strokeWeight(20);
                noFill();
                rect(0, 0, width, height);

                song.play();

            }

            textSize(1);
            for (let i = 0; i < rightEyeIris.length; i++) {
                noStroke()
                text(i, rightEyeIris[i][0], rightEyeIris[i][1])
                text(i, leftEyeIris[i][0], leftEyeIris[i][1])

            }
        }
    }
}





async function loadFaceModel() {
    model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh)

    console.log(model);
}

async function getFaces() {
    const predictions = await model.estimateFaces({
        input: document.querySelector("video"),
        returnTensors: false,
        flipHorizontal: true,
        predictIrises: true // set to 'false' if sketch is running too slowly
    })

    if (predictions.length === 0) {
        faces = undefined;
    } else {
        faces = predictions;
    }
}

