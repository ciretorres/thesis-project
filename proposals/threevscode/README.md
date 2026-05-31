# threevscode

- Se importa el módulo de three.js en el body del index.html con la configuración:

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

- Se levanta en un servidor local asignado por vscode.

[Ir al inicio](#threevscode)
