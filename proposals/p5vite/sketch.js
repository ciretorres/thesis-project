// function setup() {
//   createCanvas(100, 100, WEBGL);
//   describe("A white sphere on a gray background.");
// }
// function draw() {
//   // background(200);
//   background(0);
//   // Enable orbiting with the mouse.
//   orbitControl();
//   // Set the style's sphere.
//   // noStroke();
//   stroke(255, 0, 0);
//   fill(255);
//   // translate(0,0, 0);
//   // Draw the sphere.
//   // Set its radius to 30.
//   sphere(30);
// }

console.log("imprimiendo desde src/sketches/index.js");
import p5 from "p5";
console.log(p5); // it's found

// const canvas = document.querySelector('#e');
// console.log(canvas)
// let testP;
// forma 1 crear un objeto sketch de p5
new p5((sketch) => {
  let x = 0;
  let y = 0;
  let z = 0;

  sketch.setup = function () {
    // sketch.createCanvas(500, 200, this.WEBGL);
    const foregroundCanvas = sketch.createCanvas(100, 100, this.WEBGL);
    foregroundCanvas.id("idforegroundsketch");
    // foregroundCanvas.position(0, 0);

    // colocando texto para distinguir
    const canvasById = document.querySelector("#idforegroundsketch");
    const paragraph = document.createElement("p");
    paragraph.innerText =
      'Sketch desde foregroundsketch sketches.js \n import * from "p5js;"\n\nnew p5( (sketch) => { ... } );';
    canvasById.before(paragraph);
    sketch.normalMaterial();
    sketch.angleMode(sketch.RADIANS);
  };
  sketch.draw = () => {
    sketch.clear();

    //drag to move the world.
    sketch.push();
    sketch.background(255);
    // Enable orbiting with the mouse.
    sketch.orbitControl();

    // Set the style's sphere.
    sketch.stroke(255, 0, 255);
    sketch.fill(255);
    sketch.translate(x, y, z);

    // Draw the sphere. Set its radius to 30.
    sketch.sphere(30);

    // let rotateAngle = sketch.sin(sketch.frameCount / 50);
    // sketch.rotateX(rotateAngle / 2);
    // sketch.rotateY(-rotateAngle);
    // sketch.rotateZ(rotateAngle);
    // sketch.box(200, 100, 40);
    sketch.pop();
  };
}, "foregroundSketch");

// forma 2 crear un objeto sketch de p5
const sketch = (s) => {
  let x = 0;
  let y = 0;
  let z = 0;
  s.setup = function () {
    const canvas = s.createCanvas(100, 100, WEBGL);
    canvas.id("idsketch");

    // colocando texto para distinguir
    const canvasById = document.querySelector("#idsketch");
    const paragraph = document.createElement("p");
    paragraph.innerText =
      'Sketch desde sketches.js \n import * from "p5js;"\n\nconst sketch = (s) => {};\nnew p5(sketch);';
    canvasById.before(paragraph);
  };
  s.draw = () => {
    s.clear();

    //drag to move the world.
    s.push();
    s.background(255);
    // Enable orbiting with the mouse.
    s.orbitControl();

    // Set the style's sphere.
    s.stroke(0, 0, 255);
    s.fill(255);
    s.translate(x, y, z);

    // Draw the sphere. Set its radius to 30.
    s.sphere(30);
    s.pop();
  };
};
// let myp5 = new p5(sketch, canvas);
new p5(sketch);
