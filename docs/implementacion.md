# Implementación

- [Implementación](#implementación)
  - Escena, Cámara, Renderer, Controles, Luces.
  - [Estrellas](#estrellas)
  - [Retícula](#reticula) (Declinación, Ascensión Recta, [Etiquetas](#etiquetas))

---

- Definición del setup mediante un **renderer** y su compatibilidad, una **escena**, una **cámara** y controles.
- Definición de un **CSS2DRenderer** HTML para el etiquetado de la retícula celeste.
- Preparación de la escena con **luces**, un ayudante que muestra los **ejes** de coordenadas, una **retícula ecuatorial** en forma de esfera celeste y **etiquetas** para los ángulos y puntos cardinales.

## Modelos

### Estrellas ⭐️

`crearCampoEstrellas` Puntos de estrellas.

<img src="../docs/capturas/Screen Shot 2026-11-02 at 16.24.57.webp" width="800">

```js
export function crearCampoEstrellas(datos) {
  const posiciones = new Float32Array(datos.length * 3);
  const colores = new Float32Array(datos.length * 3);

  datos.forEach((estrella, i) => {
    // escala distancia
    posiciones.set(
      aCoordenadasThree(estrella.x, estrella.y, estrella.z),
      i * 3,
    );

    // asigna color dependiendo el Vmag
    const color = colorPorVmag(estrella.vmag);
    colores.set([color.r, color.g, color.b], i * 3);
  });

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
  geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));

  const material = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    vertexColors: true,
  });

  return new THREE.Points(geometria, material);
}
```

[Ir arriba](#implementación)

### Reticula

Se construye una figura esférica como retícula ecuatorial para las líneas RA/dec detallada en 3D. Por lo que se calcula y transforman la posición de los puntos del sistema de coordenadas ecuatoriales (ra, dec) al cartesianas esféricas (x, y, z).

- Declinación

Se trazan nueve líneas para representar la declinación a partir de -80° hasta 80° en pasos de 10° en 10° grados.

<img src="../docs/capturas/Screen Shot 2026-10-25 at 20.00.25.webp" width="800">

```js
function crearDecLineas() {
  const vertices = [];

  // Añade los Paralelos (latitud)
  for (let dec = -80; dec <= 80; dec += 10) {
    const delta = aRad(dec);

    // Recorre la ascensión recta en tramos de 5° y cierra cada círculo.
    for (let alfa = 0; alfa < 360; alfa += PASO_PARALELO) {
      const inicio = aCoordenadasThree(aRad(alfa), delta);
      const fin = aCoordenadasThree(aRad(alfa + PASO_PARALELO), delta);

      // Cada par de puntos define un segmento independiente.
      vertices.push(...inicio, ...fin);
    }
  }

  return vertices;
}
```

- Ascensión Recta

Se trazan veinticuatro líneas para representar la ascensión recta de 0° a 360° en pasos de 15° en 15° grados.

<img src="../docs/capturas/Screen Shot 2026-10-25 at 19.58.27.webp" width="800">

```js
function crearARLineas() {
  const vertices = [];

  // Líneas de longitud (ascensión recta)
  for (let m = 0; m < MERIDIANOS; m++) {
    const alfa = aRad(m * 15);
    // Los cardinales (0h, 6h, 12h y 18h → m % 6 === 0) llegan a los polos (±90°);
    // los demás se detienen o terminan en ±80° para mantener despejada la vista polar.
    const limite = m % 6 === 0 ? 90 : 80;

    // Añade los Meridianos
    for (let dec = -limite; dec < limite; dec += PASO_MERIDIANO) {
      const inicio = aCoordenadasThree(alfa, aRad(dec));
      const fin = aCoordenadasThree(alfa, aRad(dec + PASO_MERIDIANO));

      // Cada par de puntos define un segmento independiente.
      vertices.push(...inicio, ...fin);
    }
  }

  return vertices;
}
```

Se utiliza `BufferGeometry` y `LineSegments` para líneas independientes. Mejor LOD o culling.
Se ajustan las líneas de RA (0°, 90°, 180°, 270°, 360°) que están en ángulos rectos para que lleguen hasta los ejes polares y las demás solo hasta los -70° y 70° en Dec respectivamente.

```js
export function crearEsferaCeleste() {
  const vertices = [];

  // Calcula las coordenadas
  const meridianos = crearARLineas();
  const paralelos = crearDecLineas();

  vertices.push(...meridianos);
  vertices.push(...paralelos);

  const geometria = new THREE.BufferGeometry();

  // Registra las posiciones de los extremos de todos los segmentos.
  geometria.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  );

  // Usa guiones o mtaerial punteado (dashSize 1.5 u, hueco 4.5 u) para dar a la retícula un aspecto discontinuo.
  // El color se recolorea en vivo vía registrarAplicacion (sin tocar opacity)
  const material = new THREE.LineDashedMaterial({
    transparent: true,
    opacity: OPACIDAD_RETICULA,
    depthWrite: false,
    dashSize: 1.5,
    gapSize: 4.5,
  });

  // El color se aplica por callback: valor inicial síncrono y
  // recoloreado en vivo al cambiar de perfil.
  suscribirColor((valor) => material.color.set(valor), "--reticula");

  const lineas = new THREE.LineSegments(geometria, material);

  // Calcula las distancias necesarias para que el material dibuje los guiones.
  lineas.computeLineDistances();

  return lineas;
}
```

<img src="../docs/capturas/Screen Shot 2026-10-25 at 20.21.37.webp" width="800">

[Ir arriba](#implementación)

### Etiquetas

Debido a que Three.js no renderiza texto nativamente en WebGL. Se añaden etiquetas a los bordes de la pantalla utilizando **CSS2DObject**.

Ventajas de **CSS2DObject**:

- Recomendada para legibilidad.
- Se agregan al html del dom como un div.
- Las etiquetas siguen al objeto 3d y se mantienen siempre frontales a la cámara.
- Las etiquetas se actualizan automáticamente con el objeto orbitControls.
- Se recomienda usar con culling manual.

<img src="../docs/capturas/Screen Shot 2026-11-02 at 16.21.14.webp" width="800">

[Ir arriba](#implementación)
