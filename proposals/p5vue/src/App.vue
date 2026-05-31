<script setup>
import p5 from 'p5';
import { onMounted, ref } from 'vue';
import P5Component from './components/P5Component.vue';

// import './sketches/index.js';

// import WebGL from 'three/addons/capabilities/WebGL.js';
// const webGL = WebGL
const sketch = ref();

const generateSketch = () => {
  sketch.value = (s) => {
    let x = 0;
    let y = 0;
    let z = 0;
    s.setup = function () {
      const canvas = s.createCanvas(100, 100, this.WEBGL);
      canvas.id('idcanvassketch');
      // colocando texto para distinguir
      const canvasById = document.querySelector('#idcanvassketch');
      const paragraph = document.createElement('p');
      paragraph.innerText =
        'Sketch desde src/App.vue \nimport p5 from "p5"; \n\n const generateSketch = () => {};\n onMounted(() => { generateSketch(); });';
      canvasById.before(paragraph);
    };
    s.draw = () => {
      // s.background(0);
      s.background(255);
      // Enable orbiting with the mouse.
      s.orbitControl();
      // Set the style's sphere.
      // s.noStroke();
      s.stroke(0, 255, 0);
      s.fill(255);
      s.translate(x, y, z);
      // Draw the sphere.
      // Set its radius to 30.
      s.sphere(30);
    };
  };
  // let myp5 = new p5(sketch.value, canvas.value);
  // new p5(sketch.value, canvas.value);
  new p5(sketch.value);
};

onMounted(() => {
  //
  generateSketch();

  // new p5((sketch) => {
  //   let x = 0;
  //   let y = 0;
  //   let z = 0;
  //   sketch.setup = function () {
  //     console.log(this.WEBGL);
  //     sketch.createCanvas(100, 100, this.WEBGL);
  //   };
  //   sketch.draw = () => {
  //     sketch.background(0);
  //     // Enable orbiting with the mouse.
  //     sketch.orbitControl();
  //     // Set the style's sphere.
  //     // sketch.noStroke();
  //     sketch.stroke(255, 0, 0);
  //     sketch.fill(255);
  //     sketch.translate(x,y,z);
  //     // Draw the sphere.
  //     // Set its radius to 30.
  //     sketch.sphere(30);
  //   };
  // });
});
</script>

<template>
  <main>
    Hola
    <P5Component />
  </main>
</template>

<style scoped></style>
