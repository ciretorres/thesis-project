# thesis-project

## Propuestas

Cinco propuestas para mejorar el código, refactorizar la arquitectura, legibilidad y optimización del software para visualizar un fenómeno astronómico que traduzca la relación brillo y distancia estelar. Las propuestas son las siguientes:

### threevscode

Utiliza **three.js** directamente con el visor de código **visual studio code** mediante el cdn para presentarlo en el navegador. La configuración es la siguiente:

```html
<!DOCTYPE html>
<html lang="es-mx">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>threevscode</title>
  </head>
  <body>
    <main>
      <canvas id="canvasid"></canvas>
    </main>

    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/"
        }
      }
    </script>
    <script type="module">
      import * as THREE from "three";
      const canvas = document.querySelector("#canvasid");

      const renderer = new THREE.WebGLRenderer({ canvas });
    </script>
  </body>
</html>
```

### Prototype_v2

Es una propuesta para refactorizar el código realizado en **processing.js** mediante su ide integrado.

### threevite

Utiliza [three.js](https://threejs.org/) **(0.171.0)** con el poder de **vite (6.0.3)** para desplegarlo en el navegador.

- **Ventajas**:

  - levanta un servidor local con **live server** que es el mismo que se instala en vscode, pero no funciona solo.
  - creo que con solo **vite** es más ligero. En lugar de vue, react u otros frameworks.
  - instala los módulos de javascript y paquetes de nodejs como dependencias mediante **node package manager**, npm. En lugar de utilizar el cdn o subir las librerías al repo.

  ```json
  {
    "dependencies": {
      "three": "^0.171.0"
    },
    "devDependencies": {
      "vite": "^6.0.3"
    }
  }
  ```

  - carga las hojas de estilos css mediante el archivo `main.js`.

  ```js
  import "./assets/main.css";
  ```

  - coloca una etiqueta `canvas` en el html y se lo asigna al render webgl de threejs. Ejemplo:

  ```html
  <main>
    <canvas id="idcanvas"></canvas>
  </main>
  ```

  ```js
  import * as THREE from "three";

  const canvas = document.querySelector("#idcanvas");

  const renderer = new THREE.WebGLRenderer({ canvas });
  ```

[Ver enlaces](#e1)

### p5vscode

Utiliza [p5.js](https://p5js.org/) **(1.11.2)** y **visual studio code** para desarrollar la interfaz interactiva en el navegador.

- **Ventajas**:

  - importa la librería p5js mediante el cdn hasta abajo del `body` en el html.

    ```html
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.2/lib/p5.min.js"></script>
    ```

  - define las funciones `setup` y `draw` sin necesidad de crear un objeto que las contega y las llame mediante parámetro como con vuejs. Ejemplo:

    ```html
    <script>
      const main = document.querySelector("main");

      function setup() {
        createCanvas(main.clientWidth, main.clientHeight, WEBGL);
        describe("A white sphere on a gray background.");
      }

      function draw() {
        background(255);
        // Set the style's sphere.
        stroke(255, 0, 0);
        strokeWeight(0.1);
        fill(255);
        // Draw the sphere.
        // Set its radius to 10.
        sphere(10);
      }
    </script>
    ```

  - automáticamente agrega el `<canvas>` dentro de `<main>`.
  - para `WEBGL` no necesito agregarle el `this` antes como con vuejs.

### p5vue

Utiliza [p5.js](https://p5js.org/) a través del ecosistema de **vue.js (3.5.13)** para visualizar la interfaz interactiva en el navegador.

**Ventajas**

- instala dependencias mediante npm en lugar de usar el cdn o subir las librerías al repo.

```json
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

- el `<canvas>` lo agrega dentro del `<main>` en auto porque la jerarquía de vue me permite colocar el main y luego mandar un componente o archivo vue anidado.
- permite utilizar los ciclos de vue (hooks) `onMounted` y las propiedades reactivas de vue `ref`.

- **Desventajas**:

  - el número de advertencias en la consola del browser.
  - usar `this.WEBGL` para crear el canvas.
  - tienes que regresar una función objeto con dos métodos por instancia de parámetro para el `setup` y el `draw`. Ejemplo:

  ```js
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
  ```

[Ver enlaces](#e)

## Propuesta ideal

Tendría que contener lo siguiente:

- importar las librerías mediante cdn o npm
- tener un package.json
- instalar eslint y prettier para la formateo y sintaxis de código.
- colocar el `canvas` dentro del `main`.
- ajustar y reescalar el ancho del canvas al ancho de la pantalla.
- tener el folder `.vscode` para agregar los settings y extensions.
- levantar un servidor local.
- compilar el código para despliegue.
- ordenar en folders la jerarquía de los archivos js, css, etc. Ejemplo:

  ```
  src/
  ├── assets/
  |   ├── base.css
  |   └──main.css
  ├── sketches/
  |   └── index.js
  ├── index.html
  └── main.js
  ```

<!-- ## Instrucciones:

1. Descarga [Processing](https://processing.org/download) de la página oficial

<img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-12-27 a la(s) 19.30.21.png" width="800">

2. Clona el repositorio o descarga el ZIP del proyecto de https://github.com/ciretorres/thesis-project en tu computadora :octocat:

  <img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-03-24 a la(s) 16.01.03.png" width="800">

3. Abre el archivo thesis-project/Prototype_v1/Prototype_v1.pde

  <img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-03-24 a la(s) 14.49.27.png" width="800">

4. Selecciona añadir biblioteca de:

  <img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-12-27 a la(s) 19.36.13.png" width="800">

5. Instala la librería [Peasycam](https://www.mrfeinberg.com/peasycam/#about) desde el Contribution Manager

  <img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-03-24 a la(s) 14.47.04.png" width="800">

6. Ejecuta el proyecto

  <img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-03-24 a la(s) 14.47.16.png" width="800">

7. Disfruta la experiencia :sparkles:

  <img src="./Prototype_v1/data/captures/Captura de Pantalla 2021-12-27 a la(s) 19.41.36.png" width="800"> -->

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. Recuperada de: http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf

<!-- El análisis de datos se puede consultar y contribuir desde: [thesis-project/Prototype_v1/data/HipparcosMainCatalogue.ipynb](https://github.com/ciretorres/thesis-project/blob/main/Prototype_v1/data/HipparcosMainCatalogue.ipynb) -->

<!-- ## Notas

La interfaz-interactiva funciona para plataformas Windows, Mac y Linux. Incluso se puede instalar en dispositivo Android utilizando el modo debug en el ambiente de Processing :metal: -->

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

---

<h3 id="e">Enlaces p5vue</h3>

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

[Volver a p5vue](#p5vue)

<h3 id="e1">Enlaces threevite</h3>

- https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
- https://codepen.io/rachsmith/pen/EKLVvp
- https://threejs.org/examples/#webgl_animation_keyframes
- https://www.npmjs.com/package/three?activeTab=readme
- https://threejs.org/manual/#en/backgrounds
- https://threejs.org/manual/#en/tips#tabindex
- https://threejs.org/manual/#en/picking
- https://threejs.org/manual/#en/cameras
- https://threejs.org/docs/#api/en/geometries/SphereGeometry
- https://threejs.org/manual/#en/prerequisites
- https://threejs.org/manual/#en/responsive
- https://github.com/mrdoob/three.js

[Volver a threevite](#threevite)

Otros enlaces
[35 incredible dataviz tools](https://www.creativebloq.com/design-tools/data-visualization-712402)

[babylonjs](https://babylonjs.com/)
