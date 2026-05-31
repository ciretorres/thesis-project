# p5vite

Importa la librería de [p5.js](https://p5js.org/) v1.11.2 mediante la siguiente configuración:

```html
<!DOCTYPE html>
<html lang="es-mx">
  <head>
    <title>p5vscode</title>
  </head>

  <body>
    <main>p5vscode</main>

    <script type="module" src="sketch.js"></script>
    <script>
      const main = document.querySelector("main");
      function setup() {
        const canvas = createCanvas(100, 100, WEBGL);
      }
      function draw() {
        clear();

        push();
        background(255);

        // Enable orbiting with the mouse.
        orbitControl();

        // Set the style's sphere.
        stroke(255, 0, 0);
        fill(255);
        translate(0, 0, 0);

        // Draw the sphere. Set its radius to 30.
        sphere(30);
        pop();
      }
    </script>
  </body>
</html>
```

- define las funciones `setup` y `draw` sin necesidad de crear un objeto que las contega y las llame mediante parámetro como con vuejs.
- automáticamente agrega el `<canvas>` dentro de `<main>`.
- para `WEBGL` no necesito agregarle el `this` antes como con vuejs.
- lo levanta en un servidor local con vite con hot refresh al modificar scripts y visualizando en el navegador.

[Ir al inicio](#p5vite)
