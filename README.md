# thesis-project

Refactorización js

- [threevscode](#threevscode)
- [threevite](#threevite)
- [p5vscode](#p5vscode)

## Propuestas

```md
thesis-project/
├── .vscode
├── Prototype_v1
├── docs
├── proposals/
| ├── \_p5vue
| ├── \_Prototype_v2
| ├── p5svcode
| ├── proto
| ├── threevite
| └── thressvscode
├── .gitignore
├── README.md
└── package.json/
```

A continuación las cinco propuestas:

### threevscode

- Importa el módulo de three.js mediante:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js"></script>
```

La configuración es la siguiente:

```html
<!DOCTYPE html>
<html lang="es-mx">
  <head>
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
      //
    </script>
  </body>
</html>
```

[Ir al inicio](#thesis-project)

### threevite

- Importa las dependencias con un manejador de paquetes desde el `package.json`

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

En lugar de utilizar un cdn o subir las librerías al repositorio.

- Configuración:

```html
<!DOCTYPE html>
<html lang="es-mx">
  <head>
    <title>threevite</title>

    <link rel="stylesheet" href="./assets/main.css" />
    <style></style>
  </head>

  <body>
    <main id="">
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
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

- carga las hojas de estilos css mediante el archivo `main.js` y coloca una etiqueta `<canvas>` en el html para asignar el lugar de render con webgl. Ejemplo:

```js
import "./assets/main.css";

import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

const canvas = document.querySelector("#canvasid");
const renderer = new THREE.WebGLRenderer({ canvas });
```

[Lista enlaces externos](#e1)

[Ir al inicio](#thesis-project)

### p5vscode

- Importa la librería de [p5.js](https://p5js.org/) v1.11.2 del cdn.

```html
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.2/lib/p5.min.js"></script>
```

- define las funciones `setup` y `draw` sin necesidad de crear un objeto que las contega y las llame mediante parámetro como con vuejs. Ejemplo:

```html
<!DOCTYPE html>
<html lang="es-mx">
  <head>
    <title>p5vscode</title>
  </head>

  <body>
    <main>p5vscode</main>

    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.2/lib/p5.min.js"></script>

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
  </body>
</html>
```

- automáticamente agrega el `<canvas>` dentro de `<main>`.
- para `WEBGL` no necesito agregarle el `this` antes como con vuejs.

[Ir al inicio](#thesis-project)

## Propuesta ideal

Tendría que contener lo siguiente:

Utilizar un manejador de paquetes seguro para poder instalar las librerías por dependencias desde un archivo `package.json`

Actualizar y recargar el puerto del servidor local instantáneamente del entorno de ejecución al realizar cambios en los script e interfaz.

Compilar y minificar el código de despliegue para la versión de distribución con el builder.

Realizar pruebas de componentes y unitarias.

Realizar una imagen en docker para ejecutarse.

Realizar linteo, formateo y sintaxis de código.

- que permita colocar el `canvas` dentro del la etiqueta `main`.
- ajustar y reescalar el ancho del canvas al ancho de la pantalla.
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

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. Recuperada de: http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf

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
