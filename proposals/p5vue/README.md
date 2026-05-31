# p5vue

This template should help get you started developing with Vue 3 in Vite.

Esta propuesta de template permite desarrollar código:

- [p5.js](https://p5js.org/) v1.11.2
- con vue.js v3.5.13 en vite v6.0.1.

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun run dev
```

### Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun run lint
```

Dependencias del `package.json`:

```json
"scripts": {
  "clean": "rm -rf node_modules && rm -f package-lock.json && npm cache clean -f && npm cache verify && npm i",
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --fix",
  "format": "prettier --write src/"
},
"dependencies": {
  "p5": "^1.11.2",
  "vue": "^3.5.13"
},
"devDependencies": {
  "@eslint/js": "^9.14.0",
  "@vitejs/plugin-vue": "^5.2.1",
  "@vue/eslint-config-prettier": "^10.1.0",
  "eslint": "^9.14.0",
  "eslint-plugin-vue": "^9.30.0",
  "prettier": "^3.3.3",
  "vite": "^6.0.1",
  "vite-plugin-vue-devtools": "^7.6.5"
},
```

Aspectos generales:

- el `<canvas>` lo agrega dentro del `<main>` en automático porque la jerarquía de vue me permite colocar el main y luego mandar un componente o archivo vue anidado.
- permite utilizar los ciclos de vue (hooks) `onMounted` y las propiedades reactivas de vue `ref`.

Puntos en desventaja:

- Al ejecutar el servidor corre primero lo que está desde un script puro en js.
- Al hacer un cambio en un archivo .vue se pierde lo del script puro en js y no viceverza.
- Para recuperar lo que muestra el script es necesario refrescar el navegador cuando se modifica un .vue
- usar `this.WEBGL` para crear el canvas.
- tienes que regresar una función objeto con dos métodos por instancia de parámetro para el `setup` y el `draw`. Ejemplo:

```js
import p5 from 'p5';

const sketch = ref();

const generateSketch = () => {
  sketch.value = (s) => {
    s.setup = function () {
      s.createCanvas(100, 100, this.WEBGL);
    };
    s.draw = () => {
      s.background(255);
      // Set the style's sphere.
      s.stroke(0, 255, 0);
      s.fill(255);
      // Draw the sphere.
      // Set its radius to 30.
      s.sphere(30);
    };
  };
  new p5(sketch.value);
};

onMounted(() => {
  //
  generateSketch();
});
```

Incluso funciona con el componetizado de vue.

- https://stackblitz.com/edit/angular-zkpdzeso-having-a-problem-loading-setti-sl2qiekl?file=src%2Fapp%2Fhello.component.ts
- https://stackoverflow.com/questions/59295824/having-a-problem-loading-setting-webgl-to-the-createcanvas-method-in-p5-js
- https://threejs.org/docs/index.html#manual/en/introduction/Installation
- https://threejs.org/docs/#manual/en/introduction/WebGL-compatibility-check
- https://stackoverflow.com/questions/59111286/uncaught-referenceerror-webgl-is-not-defined
- https://github.com/processing/p5.js/blob/main/src/core/main.js#L39
- https://github.com/processing/p5.js/wiki/Global-and-instance-mode
- https://github.com/Kinrany/vue-p5/blob/main/src/p5.vue
- https://medium.com/@mhiratsuka/explore-p5-js-with-webgl-755a019be2b4
- https://github.com/Nico-Mayer/p5-vue/blob/main/src/App.vue
- https://medium.com/@mariorobertofortunato/integrate-p5-js-sketches-in-vue-f5f4e2c48c25
- https://medium.com/js-dojo/experiment-with-p5-js-on-vue-7ebc05030d33
- https://github.com/processing/p5.js
- https://www.npmjs.com/package/p5?activeTab=code
- https://cdn.jsdelivr.net/npm/p5@1.11.2/
- https://github.com/antiboredom/p5.vscode
- https://github.com/antiboredom/p5.js/tree/master
- https://p5js.org/libraries/
- https://p5js.org/sketches/
- https://p5js.org/examples/
- https://p5js.org/tutorials/
- https://p5js.org/reference/p5/sphere/
