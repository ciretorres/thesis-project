# thesis-project

![](https://img.shields.io/badge/status-in%20progress-yellow)
![](https://img.shields.io/badge/npm%20v1.0.1-orange)

refactorización javascript

```json
{
  "dependencies": {
    "three": "^0.176.0"
  },
  "devDependencies": {
    "vite": "^6.4.1"
  }
}
```

[three.js - npm](https://www.npmjs.com/package/three?activeTab=versions)

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

---

- [Instalar y ejecutar](#instalar)
- [Estructura de archivos](#estructura-de-archivos)
- [Requerimientos](#requerimientos)
  - Básicos, intermedios y avanzados.
  - [Técnicos](#técnicos)
- [Pasos para la Implementación](#pasos-para-la-implementación)
  - Escena, Cámara, Renderer, Controles, Luces.
  - [Retícula](#retícula)
    - [Declinación](#declinación)
    - [Ascensión Recta](#ascensión-recta)
      - [Ángulos rectos](#ángulos-rectos)
    - [Etiquetas](#etiquetas)
- [Estrellas](#estrellas)
- [Three.js](#threejs)
- [Referencias](#referencias)
- [Fuentes de información](#fuentes-de-información)

## Instalar

Clonar repositorio

```
git clone https://github.com/ciretorres/thesis-project.git
```

Instalar dependencias

```
npm install
```

```
bun install
```

### Ejecutar

Compilar y _Hot-Reload_ para desarrollo

```
bun run dev
```

## Estructura de archivos

```md
thesis-project/
├── src/
| ├── assets/
| ├── components/
| ├── composables/
| ├── mixins/
| ├── scripts/
| ├── utils/
| ├── index.html
| ├── script.js
| └── style.css
|
├── static/
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

[Ir al inicio](#thesis-project)

Se utilizaron modelos como `gemma3:27b, gemma2:27b, qwen3.6:27b, qwen3.5:9b, mistral-small3.2:24b, mistral:7b, granite3.3:8b, ` para realizar consultas sobre el desarrollo de un planetario interactivo mediante el uso de la librería de Javascript [Three.js](https://threejs.org/docs/)

[Ir al inicio](#thesis-project)

### Respuestas

Entre las similitudes y capacidades de uno y otro. En general todos me ayudaron por comenzar a estructurar mejor la arquitectura del sistema, a definir las necesidades básicas y requerimientos técnicos generales del desarrollo e implementación completa de la interfaz-interativa.

Planeación y documentación.

Los modelos `qwen3.6:27b` y `mistral-small3.2:24b` me dieron ejemplos de código para calcular una retícula geométrica en 3d mediante líneas de espacio esféricas o superficie curvas.

#### Conversión de sistemas de coordenadas

Las coordenadas ecuatoriales son un sistema de referencia astronómico. En la astronomía estándar (ICRS/J2000) o sistemas ecuatoriales las coordenas son la ascensión recta y la declinación.

- **Ascensión Recta (RA).** Es el ángulo del ecuadro mediddo desde el equinoccio vernal (0,0) hasta el meridiano. Equivale a la coordenada de longitud angular en el plano Norte. Crece hacia el Este. Y va desde los 0° hasta los 360° o desde 0h hasta 24h.
- **Declinación (Dec).** Es la distancia angular desde el plano ecuatorial al Sur (-90°) o Norte (90°). Equivale a la coordenada de latitud.

Se trata de transformar **coordenas ecuatoriales** (ra, dec) a **coordenas esféricas** (x, y, z). Utilizando la información sobre la Ascensión Recta para los meridianos que pasan por los ejes (0° a 360°) y la Declinación 0 paralelos al ecuador celeste (-90° a +90°) :

#### Conveciones de sistemas de coordenadas

Un sistema cartesiano estándar (x,y) la Y siempre es arriba 'Y-Up.' En modelos celestes se usa la 'Z-Up' como arriba para representar la dirección del polo Norte o eje vertical celeste.

Las coordenadas unitarias para una esfera son:

- x = verano
- y = norte
- z = arriba

En Three.js el estándar es:

- x = eje vertical hacia la derecha
- y = arriba

#### Pasos a seguir:

- Definir el sistema de coordenadas Y-up o Z-up para la fórmula matemática de conversión.
- Determinar el rango para RA (0 a 2π) y Dec (-π/2 a π/2).
- Convertir los a vectores para cada dimensión xyz. La conversión a 3D se debe ajustar a la orientación de Three.js Si alineamos el ecuador celeste con el plano XZ, entonces `y = r * sin(dec)`, y `x,z` de `cos(dec)` y `ra`.

```bash
# Se normaliza a radio con `R = radius`

x = radius * cos(phi = φ) * cos(theta = θ)
y = radius * sin(phi = φ)
z = radius * cos(phi = φ) * sin(theta = θ)
```

- Construcción geométrica eficiente con segmentos de líneas conectando los puntos y vectores.
- Agregar etiquetas de texto a cada intersección clave.

Three.js no incluye funciones astronómicas nativas. Las matemáticas deben hacerse de manera externa. Sin embargo; su arquitectura de escena, sistemas de coordenas, shaders, controles de cámara y demás, permiten construirlo desde cero o integrando librerías efímeras.

```js
// ejemplo de función para convertir valores
function raDecToVec3(ra, dec, radius) {
  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.sin(dec),
    radius * Math.cos(dec) * Math.sin(ra),
  );
}
```

[Ir al inicio](#thesis-project)

## Requerimientos

Necesidades básicas, intermedias y avanzadas para el desarrollo e implementación del sistema interactivo:

- **Planetario simple.**
  - Mostrar/Visualizar una esfera de estrellas fijas.
  - ✅ La cámara puede moverse alrededor de la escena para explorar el cielo.
  - ✅ Un movimiento básico de rotación sobre el eje polar para la esfera de estrellas.

    (Cuando en la interfaz no haya actividad, se prenden. Al interactuar con la interfaz se apaga la rotación y se prende después de un medio minuto).

  - El fondo de la escena puede ser la vía láctea o el color negro.

- **Retícula geométrica con coordenadas ecuatoriales.**
  - ✅ Calcular y convertir los puntos de las líneas en función del sistema de coordenadas ecuatoriales a coordenadas esféricas (x,y,z).
  - ✅ Dibujar las líneas a partir de los puntos de las coordenas esféricas.
  - ✅ Agregar etiquetas a las líneas (ra, dec).
- **Carga de posiciones astronómicas.**
  - ✅ Integrar un módulo de análisis de datos astronómicos para calcular la posición de las estrellas. Este existe en un notebook de python.

    (Es un conjunto de datos con información de las estrellas para convertir coordenas galácticas a coordenas esféricas y obtener sus magnitudes de brillo aparente y brillo absoluto).

  - ✅ Leer y generar dinámicamente los puntos para representar la posición de las estrellas en una escala logarítmica.

- **Optimización.**
  - Considerar técnicas de optimización y rendimiento estable como instancing, LOD (Level of Detail), o frustum culling. Para las escenas con gran cantidad de objetos en una cúpula o domo celeste esférico de estrellas.
- **Interactividad.**
  - Lograr seleccionar objetos celestes, obtener y mostrar información sobre estos (nombre, distancia, tamaño, brillo, etc.).
  - ✅ Cambiar o modificar el brillo/distancia de una estrella mediante botones y menús.
  - Filtrar objetos por tipo (estrellas, brillo, distancia, etc.), buscar objetos específicos por nombre o coordenadas.
- **Controles de movimiento.**
  - ✅ Integrar controles de cámara en órbita para permitir con el ratón o teclado moverse, navegar, hacer zoom, girar, rotar y cambiar el ángulo de la vista del planetario en escena.
  - Fijar distancia mínima/máxima. No zoom más allá del cielo.
  - ✅ Resetear 0,0,0.
  - Añadir controles para interfaz (interactiva, II) gráfica (UI) HUD (HeadsUpDisplay) como botones, sliders o menús.
- **Testeo.**
- **Realidad virtual (VR) / Realidad aumentada (AR).** Integrar soporte para VR/AR utilizando bibliotecas como WebXR para crear una experiencia inmersiva. La integración en interfaz gráfica UI es más flexible con mejor performance para actualizaciones dinámicas.
- **Sistema de color.** Añadir botones para cambiar entre diferentes sistemas de colores. Claro, oscuro, rojo. Realizar análisis como parte de la accesibilidad web.
- **Descarga de app.** Descarga la aplicación para móvil en android.
- **Integrar app.** Integrar la aplicación en otros sitios instalando la herramienta o mediante `<iframe>`.

[Ir al inicio](#thesis-project)

### Técnicos

Los requerimientos técnicos que tendría que tener como mínimo son:

- ✅ Vivir en un **repositorio** en línea de git.
- ✅ Utilizar un **manejador de paquetes** para instalar las librerías y usarse como dependencias del archivo `package.json` (en lugar de utilizar un cdn o subir las librerías al repositorio de la aplicación).
- ✅ Utilizar un **entorno de ejecución** para actualizar y recargar instantáneamente el servidor local al realizar cambios en la aplicación.
- ✅ Utilizar un **builder** para compilar y minificar el código en archivos desplegables para distribución de la app en producción.
- Utilizar un entorno de **pruebas** unitarias y de componentes.
- Utilizar una configuración en **docker** para la creación de una imagen del entorno de ejecucción.
- ✅ Utilizar herramientas para el **linteo**, **formateo** y revisión de **sintaxis** del código.
- ✅ Colocar el `<canvas />` dentro del la etiqueta `<main />`.
- ✅ Ajustar y reescalar **resize** del ancho del canvas al ancho de la pantalla con `window.innerWidth` y `window.innerHeight`.
- Ordenar folders y archivos por jerarquía, tipo, extensión, js, css, etc.

[Ir al inicio](#thesis-project)

### Pasos para la implementación

- Definir una [escena](./src/components/escena/index.js), [cámara](./src/components/camara/index.js), [renderer](./src/components/renderer/index.js).
- Validar compatibilidad con [WebGL](./src/utils/warning.js).
- Definir [controles](./src/components/controls/index.js) de órbita y [luces](./src/components/lights/index.js).

[Ir al inicio](#thesis-project)

#### Retícula

Construir y visualizar con trigonometría una retícula ecuatorial con líneas RA/Dec detallada. Calcular, transformar y convertir los puntos del sistema de coordenadas ecuatoriales (ra, dec) a coordenadas esféricas (x, y, z).

- ###### Declinación

Calcular los puntos para nueve líneas de Declinación desde -90° hasta 90° en pasos de 20° en 20° grados.

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
     * Cartesianas Tridimensionales (RA/Dec -> XYZ) en la forma Y-up
     */
    const x = radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    points.push(new Vector3(x, y, z));
  }
  // Geometría, material y mesh
  //
}
```

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.51.17.webp" width="800">

[Ir al inicio](#thesis-project)

- ###### Ascensión Recta

Calcular los puntos para veinticuatro líneas de Ascensión Recta desde 0° hasta 360° en pasos de 15° en 15° grados.

```js
// Líneas de longitud (ascensión recta)
for (let ra = 0; ra <= 360; ra += 15) {
  const points = [];

  for (let dec = -90; dec <= 90; j++) {
    // convirtiendo grados a radians
    const phi = dec * (Math.PI / 180);
    const theta = ra * (Math.PI / 180);

    // Fórmula para transformar coordenas de la forma Y-up
    const x = radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    points.push(new Vector3(x, y, z));
  }
  // Geometría, material y mesh
  //
}
```

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.52.41.webp" width="800">

Para asignar los puntos a una geometría, crear el mesh de las líneas y agregarlas a la escena se usa:

```js
// Geometría, material, mesh y agregar a escena
const geometry = new BufferGeometry().setFromPoints(points);

const line = new Line(
  geometry,
  new LineBasicMaterial({
    color: 0xff0000,
  }),
);

line.updateMatrix();
scene.add(line);
```

Utilizar `LineSegments` para líneas independientes por tramo mejor para LOD o culling. `BufferGeometry`.

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.36.webp" width="800">

[Ir al inicio](#thesis-project)

- ###### Ángulos rectos

Ajustar que las líneas de RA con ángulos rectos de 0°, 90°, 180°, 270° y 360° lleguen hasta los ejes polares. Y los demás hasta -70° y 70° respectivamente.

```js
const angulosRectos = [0, 90, 180, 270, 360];

if (angulosRectos.includes(i)) {
  for (let j = -90; j <= 90; j++) {
    const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);

    points.push(sphericalCoords);
  }
} else {
  // esto soluciona que las líneas no lleguen hasta -90° o 90
  for (let j = -70; j <= 70; j++) {
    const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);

    points.push(sphericalCoords);
  }
}
```

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.52.webp" width="800">

Añadir etiquetas de texto en las intersecciones clave para indicar los valores de las líneas paralelas y meridianas.

[Ir al inicio](#thesis-project)

- ###### Etiquetas

Three.js no renderiza texto nativamente en WebGL, se trata de posicionar etiquetas en las intersecciones de las declinaciones y ascensiones rectas, normalizar un margen de espacio y evaluar el mejor método entre Sprite o CSS2DObject.

```js
// Método para agregar etiqueta mediante Sprite
const createSpriteLabel = (type, pos, text, radius) => {
  const group = new Group();

  const spriteMaterial = new SpriteMaterial({
    map: createTextTexture(text, type),
    transparent: true,
    // rotar 90° si es línea ra
    rotation: type === "ra" ? (90 * Math.PI) / 180 : 0,
  });
  const sprite = new Sprite(spriteMaterial);

  // Ajustar márgenes de las etiquetas
  ajustarMargenes(type, pos, sprite);

  sprite.scale.set(0.9375, 0.3125, 1.25); // Ajusta según distancia
  group.add(sprite);

  return sprite;
};
```

Ventajas de Sprite

- Más rápido apra rotar, más eficiente. Escala y rotación local.
- Ideal para muchas etiquetas. Mejor rendimiento.
- Usa texto 2d.
- Carga la fuente asíncrona o previamente.
- Crea etiqueta visual para ver desde fuera sin invertir lectura. Sigue a la cámara. Pero puede requerir LookAt(camera).
- Mejor rendimiento de TextGeometry.
- Convierte canvas a textura 2d.
- Usa sprites instanciados.

```js
// Método para agregar etiqueta mediante CSS2DObject
const addLabelCSS2DObject = (type, pos, text, radius) => {
  const group = new Group();

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper-label";

  const labelElement = document.createElement("div");
  labelElement.className = "label";
  labelElement.id = `labelid-${Math.random().toString(36).substring(2)}`;
  labelElement.textContent = `${type === "dec" && text > 0 ? "+" : ""}${text}°`;
  labelElement.style.backgroundColor = "#ff0000";
  if (type === "ra") {
    labelElement.style.transform = "rotate(-90deg)";
  }

  // Anidando para poder rotar
  wrapper.appendChild(labelElement);

  // CSS2DObject
  const label = new CSS2DObject(wrapper);

  ajustarMargenesCSS2D(type, pos, label);

  label.center.set(0, 1);
  group.add(label);

  return group;
};
```

Ventajas de CSS2DObject

- Recomendada para legibilidad.
- Las etiquetas siguen al objeto 3d y se mantienen siempre frontales a la cámara.
- Se agrega al dom como un div.
- Usar con culling manual.
- Las etiquetas se actualizan automáticamente con orbitControls.

--

- Hacer que solo se vean hacia las de los extremos
- Cómo sincronizar la rotación de la cámara con un html canvas overlay que dibuje el grid de lineas sobre los ejes proyectados.
- Cómo utilizar un shader pesonalizado en una esfera transparente que dibuje las líneas RA/Dec basados en UV/spherical coordinates.

[Ir al inicio](#thesis-project)

### Estrellas

`Get Star Field` Instancias de esferas/estrellas.

[Ir al inicio](#thesis-project)

## Three.js

Es una librería en Javascript que facilita la creación y visualización de gráficos en navegadores web. Permite renderizar escenas 3d utilizando WebGL (una API para renderizar gráficos acelerados por hardware en el navegador). Three.js abstrae gran parte de la complejidad de WebGL haciéndolo más accesible y fácil de usar.

### Arquitectura y características clave

- **Escenas:** contenedores con objetos 3d, luces, cámara.
- **Objetos 3D:** formas geométricas (cubo, esferas, planos).
- **Materiales:** define los objetos en color, textura, brillo, etc.
- **Luces:** iluminan la escena con sombras y efectos.
- **Cámaras:** definen el punto de vista de la escena.
- **Renderizador:** WebGL toma la escena y la pasa a 2d en el navegador.
- **Animación:** mecanismos para animar objetos, cámaras, luces.
- **Importación de modelos 3d:** de Blender, Maya en gltF, OBJ, FBX.

La ventaja de usar Three.js para el desarrollo de un planetario interactivo es la creación de una experiencia interactiva donde el usuario puede navegar por el cielo, seleccionar objetos, obtener información, etcétera.

Además, la compatibilidad con navegadores web es suficiente, puesto que funciona con la mayoría de los navegadores modernos sin necesidad de plugins adicionales. Una comunidad activa de desarrolladores ofrecen soporte, ejemplos y recursos.Por lo que, crear un planetario interactivo con Three.js es un proyecto totalmente viable.

[Ir al inicio](#thesis-project)

## Consejos

- Comienza con un planetario básicos y añade funcionalidades gradualmente.
- Aprovecha los recursos disponibles en líneas. Como los datos astronómicos.
- Mantenlo técnico pero accionable.
- Mantén los fragmentos del código minimalista, pero ilustrativos.
- Mantenlo práctico y alineado con el Three.js actual.

[Ir al inicio](#thesis-project)

## Por qué se dejó de mantener el proyecto de processing

- Utiliza un IDE Processing que se tiene que descargar de la página oficial.
- Es necesario importar una librería peasy para la creación de una cámara virtual desde el IDE.
- Escribir código con el IDE de Processing es un tanto robusto. Incluso algunos atajos con el teclado no funcionan.
- Al final son archivos con extensión .pde de processing development, pero en su interior son clases en java.
- Es mucho más robusto mantener las funciones como hacer click en un botón que con el uso de html js.
- La sintáxis de java es mucho más extensa que la de js.
- Es más fácil encontrar la documentación de las librerías de js que de java.

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. Recuperada de: http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf

## Fuentes de información

[35 incredible dataviz tools](https://www.creativebloq.com/design-tools/data-visualization-712402)

[https://babylonjs.com/](https://babylonjs.com/)

[https://threejs.org/docs/](https://threejs.org/docs/)

[https://ollama.com/](https://ollama.com/)

[https://www.tutorialspoint.com/threejs](https://www.tutorialspoint.com/threejs/index.htm)

[https://threejs.org/docs/#SphereGeometry](https://threejs.org/docs/#SphereGeometry)

[https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js#L74C27-L74C41](https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js#L74C27-L74C41)

[Three.js Geometry Tutorial (Day 3) – Box, Sphere, Plane & Cylinder | Create 3D Shapes with Three.js](https://www.youtube.com/watch?v=Pglky4obBIk)

[Coding Challenge 25: Spherical Geometry](https://www.youtube.com/watch?v=RkuBWEkBrZA)

[Create a 3D Globe with Three.js](https://www.youtube.com/watch?v=f4zncVufL_I)

[Create Point sphere animation in WebGL, THREE JS & GSAP](https://www.youtube.com/watch?v=K3WCGUO1uu8)

[Create star system - particles animation in THREE JS, WebGL and STATS JS](https://www.youtube.com/watch?v=k0npZq07afw)

[https://threejs.org/docs/#GridHelper](https://threejs.org/docs/#GridHelper)

[https://github.com/mrdoob/three.js/blob/master/src/helpers/GridHelper.js](https://github.com/mrdoob/three.js/blob/master/src/helpers/GridHelper.js)

[https://threejs.org/examples/?q=css2d#css2d_label](https://threejs.org/examples/?q=css2d#css2d_label)

[https://threejs.org/examples/?q=css3d#css3d_sprites](https://threejs.org/examples/?q=css3d#css3d_sprites)

--

[Ir al inicio](#thesis-project)
