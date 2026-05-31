<script setup>
import p5 from 'p5';
import { onMounted, ref } from 'vue';

const sketch = ref();

const id = new Date().toLocaleDateString();

onMounted(() => {
  sketch.value = (s) => {
    let x = 0;
    let y = 0;
    let z = 0;
    s.setup = function () {
      const canvas = s.createCanvas(100, 100, this.WEBGL);
      canvas.id('idp5component');
      const canvasById = document.querySelector('#idp5component');
      const paragraph = document.createElement('p');
      paragraph.innerText =
        'Sketch desde src/components/P5component.vue \nimport p5 from "p5"; \n\n const sketch = ref();\n onMounted(() => { sketch.value = (s) => {}; new p5(sketch.value); });';
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
});
</script>

<template>
  <div ref="canvas" :id="id">P5Component</div>
</template>
