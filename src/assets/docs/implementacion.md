# Implementación

- [Implementación](#implementación)
  - Escena, Cámara, Renderer, Controles, Luces.
  - [Estrellas](#estrellas)
  - [Retícula](#reticula) (Declinación, Ascensión Recta, [Etiquetas](#etiquetas))

---

- Definición del setup mediante una **escena**, una **cámara** y un **renderer**.
- Validar compatibilidad del navegador con [WebGL](./src/utils/warning.js).
- Definir un CSS2DRenderer para el etiquetado en el grid.
- Definir **controles** para la cámara.
- Definir **luces** para la escena.

## Modelos

### Estrellas ⭐️

`Get Star Field` Instancias o Sprites de estrellas.

<img src="../../../static/capturas/Screen Shot 2026-06-24 at 0.26.26.webp" width="800">

```js
const createSpritedStars = (numStars = 500) => {
  const stars = new THREE.Object3D();

  // crea y calcula la posición de los sprites
  for (let i = 0; i < numStars; i++) {
    const starMaterial = new THREE.SpriteMaterial({ color: 0xffffff });
    const starSprite = new THREE.Sprite(starMaterial);

    // Genera una posición aleatoria dentro de un rango deseado;
    const x = Math.ceil(Math.random() * 200 - 100);
    const y = Math.ceil(Math.random() * 200 - 100);
    const z = Math.ceil(Math.random() * 200 - 100);

    starSprite.position.set(x, y, z);
    starSprite.scale.set(0.1, 0.1, 0.1); // Tamaño pequeño

    stars.add(starSprite);
  }
  return stars;
};
```

[Ir arriba](#implementación)

### Reticula

Con la ayuda de la geometría analítica y la trigonometría se construye una figura esférica como retícula ecuatorial con líneas RA/Dec detallada en 3D. Por lo que se calcula y transforman la posición de los puntos del sistema de coordenadas ecuatoriales (ra, dec) al cartesianas esféricas (x, y, z).

- Declinación

Se trazan nueve líneas para representar la declinación a partir de -90° hasta 90° en pasos de 20° en 20° grados.

<img src="../../../static/capturas/Screen Shot 2026-06-14 at 16.51.17.webp" width="800">

```js
// Líneas de latitud (declinación)
for (let dec = -90; dec <= 90; dec += 20) {
  const points = [];

  for (let ra = 0; ra <= 360; ra++) {
    // convirtiendo grados a radians
    const phi = dec * (Math.PI / 180);
    const theta = ra * (Math.PI / 180);

    /**
     * Fórmula para transformar Coordenadas Ecuatoriales en
     * Cartesianas Tridimensionales (RA/Dec -> XYZ) en la forma Z-up
     */
    const x = radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi) * Math.sin(theta);
    const z = radius * Math.sin(phi);

    points.push(new THREE.Vector3(x, y, z));
  }
  // Line Geometry
  //
}
```

- Ascensión Recta

Se trazan veinticuatro líneas para representar la ascensión recta de 0° a 360° en pasos de 15° en 15° grados.

<img src="../../../static/capturas/Screen Shot 2026-06-14 at 16.52.41.webp" width="800">

```js
// Líneas de longitud (ascensión recta)
for (let ra = 0; ra <= 360; ra += 15) {
  const points = [];

  for (let dec = -90; dec <= 90; j++) {
    // convirtiendo grados a radians
    const phi = dec * (Math.PI / 180);
    const theta = ra * (Math.PI / 180);

    // Fórmula para transformar coordenas de la forma Z-up
    const x = radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi) * Math.sin(theta);
    const z = radius * Math.sin(phi);

    points.push(new THREE.Vector3(x, y, z));
  }
  // Line Geometry
  //
}
```

Para asignar los puntos a una geometría de línea y agregarlas a la escena se usa:

```js
// Line Geometry
const geometry = new THREE.BufferGeometry().setFromPoints(points);

// línea
const line = new THREE.Line(
  geometry,
  new THREE.LineBasicMaterial({
    color: 0xff0000,
  }),
);
line.updateMatrix();

// agrega a escena
scene.add(line);
```

<img src="../../../static/capturas/Screen Shot 2026-06-14 at 16.53.36.webp" width="800">

Se utiliza `BufferGeometry` y `LineSegments` para líneas independientes. Mejor LOD o culling.

[Ir arriba](#implementación)

Se ajustan las líneas de RA (0°, 90°, 180°, 270°, 360°) que están en ángulos rectos para que lleguen hasta los ejes polares y las demás solo hasta los -70° y 70° en Dec respectivamente.

<img src="../../../static/capturas/Screen Shot 2026-06-14 at 16.53.52.webp" width="800">

```js
const angulosRectos = [0, 90, 180, 270, 360];

if (angulosRectos.includes(i)) {
  for (let j = -90; j <= 90; j++) {
    const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);

    points.push(sphericalCoords);
  }
} else {
  // esto temporal que las líneas no lleguen hasta -90° o 90
  for (let j = -70; j <= 70; j++) {
    const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);

    points.push(sphericalCoords);
  }
}
```

[Ir arriba](#implementación)

### Etiquetas

Debido a que Three.js no renderiza texto nativamente en WebGL. Se añaden etiquetas entre las intersecciones de las líneas paralelas (dec) y las meridianas (ra). Normalizando un espacio de margen entre la línea y la etiqueta. Y se evalua el mejor método para agregarlas entre TextGeometry, Sprite y **CSS2DObject**.

Ventajas de usar Sprite:

- Crea una textura de texto con un elemento **canvas** de html: `new CanvasTexture(canvas)`. Por lo que al método `fillText()` del contexto 2D se le pasa el texto.
- Para rotar la etiqueta se hace desde la propiedad del material del sprite. Tanto la escala como la rotación son locales.
- Crea una etiqueta visual para ver desde fuera sin tener que invertir la posición de lectura. Es decir, la etiqueta sigue a la cámara, pero podría requerir lookAt(camera).
- Ideal para muchas etiquetas. Mejor rendimiento. Más rápido. Más eficiente.
- Se recomienda cargar la fuente tipográfica asíncrona o previamente en el contexto.
- Mejor rendimiento de TextGeometry.

Ventajas de **CSS2DObject**:

- Recomendada para legibilidad.
- Se agregan al html del dom como un div.
- Las etiquetas siguen al objeto 3d y se mantienen siempre frontales a la cámara.
- Las etiquetas se actualizan automáticamente con el objeto orbitControls.
- Se recomienda usar con culling manual.

```js
// Método para agregar una etiqueta mediante CSS2DObject
const addLabelCSS2DObject = (type, pos, text, radius) => {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper-label";

  const labelElement = document.createElement("div");
  labelElement.id = `labelid-${Math.random().toString(36).substring(2)}`;
  labelElement.className = "label";
  // texto
  labelElement.textContent = `${text}`;

  // Anidando para poder rotar
  wrapper.appendChild(labelElement);

  // CSS2DObject
  const label = new THREE.CSS2DObject(wrapper);

  // ajustar posición
  label.position.copy(pos);
  label.center.set(0, 1);

  return label;
};
```

[Ir arriba](#implementación)
