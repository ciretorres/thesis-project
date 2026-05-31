# proto

- Importa el módulo desde las dependencias del `package.json`, mediante un manejador de paquetes.

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

- Se levanta en un servidor local de vite con hot refresh cada que se realiza un cambio en los scripts.

[Ir al inicio](#proto)

<h3>Enlaces</h3>

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

[Volver a arriba](#proto)
