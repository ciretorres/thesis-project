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

- [Instalar y ejecutar local](#instalar)
- [Estructura de archivos](#estructura-de-archivos)
- [Requerimientos](#requerimientos)
  - Básicos, intermedios y avanzados.
  - [Técnicos](#técnicos)
- [Implementación](#implementación)
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

1. Clonar repositorio

```
git clone https://github.com/ciretorres/thesis-project.git
```

2. Entrar a la carpeta con el proyecto

```
cd thesis-project
```

3. Dentro instalar dependencias

```
npm install
```

```
bun install
```

### Ejecutar

4. Para compilar y levantar el proyecto local

```
bun run dev
```

## Estructura de archivos

```md
thesis-project/
├── src/
| ├── assets/
| ├── components/
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

### Planeación y documentación.

Los modelos de ollama `mistral-small3.2:24b`, `granite4.1:30b` y `qwen3.6:27b` me ayudaron con ejemplos en código para el cálculo de una retícula geométrica en 3d mediante líneas de punto en el espacio esférico o superficie curva.

#### Conversión de sistemas de coordenadas

Las coordenadas ecuatoriales son un sistema de referencia astronómico. En la astronomía estándar (ICRS/J2000) o los sistemas ecuatoriales las coordenadas son:

- **Ascensión Recta (RA).** Es el ángulo del ecuador medido desde el equinoccio vernal (0,0) hasta el meridiano. Equivale a la coordenada de longitud angular en el plano Norte. Crece hacia el Este. Y va desde los 0° hasta los 360° así como de 0h hasta 24h.
- **Declinación (Dec).** Es la distancia angular desde el plano ecuatorial al Sur (-90°) y al Norte (90°). Equivale a la coordenada de latitud.

Se trata de transformar las **coordenas ecuatoriales** (ra, dec) a **coordenas esféricas** (x, y, z). Utilizando la información sobre la RA para los meridianos que pasan por los ejes (0° a 360°) y la Dec paralelos al ecuador celeste (-90° a +90°).

##### Conveciones de sistemas de coordenadas

En un sistema cartesiano estándar (x,y) la 'Y' siempre es arriba 'Y-Up.' En modelos celestes se usa 'Z-Up' como arriba para representar la dirección del polo Norte o el eje vertical celeste.

```bash
# Se normaliza el radio de la esfera mediante `R = radius`

# ecuador celeste con el plano XZ
x = radius * cos(phi = φ) * cos(theta = θ)
y = radius * sin(phi = φ)
z = radius * cos(phi = φ) * sin(theta = θ)

# ecuador celeste con el plano XY
x = radius * cos(phi = φ) * cos(theta = θ)
y = radius * cos(phi = φ) * sin(theta = θ)
z = radius * sin(phi = φ)

```

```js
// ejemplo de función para convertir valores
function raDecToVec3(ra, dec, radius) {
  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.cos(dec) * Math.sin(ra),
    radius * Math.sin(dec),
  );
}
```

#### Definición:

- Sistema de coordenadas 'Z-up' para la fórmula matemática de conversión.
- Rango para RA (0 a 2π) y Dec (-π/2 a π/2).
- Construcción geométrica eficiente mediante segmentos de líneas, sprites, css2dobject.
- Agregar etiquetas de texto a cada intersección clave.

[Ir al inicio](#thesis-project)

## Requerimientos

Necesidades básicas, intermedias y avanzadas para el desarrollo e implementación del sistema interactivo:

- **Planetario simple**
  - ✅ Mostrar/Visualizar una esfera de estrellas fijas.
  - ✅ La cámara puede moverse alrededor de la escena para explorar el cielo.
  - 🌌 El fondo de la escena puede ser la vía láctea o el color negro.
  - 🤔 Un movimiento básico de rotación sobre el eje polar para la esfera de estrellas.

    (Cuando en la interfaz no haya actividad, comienza a rotar. Al interactuar se apaga la rotación y vuelve hasta después de medio minuto).

- **Retícula geométrica con coordenadas ecuatoriales**
  - ✅ Calcular y convertir los puntos de las líneas en función del sistema de coordenadas ecuatoriales (ra,dec) a coordenadas esféricas (x,y,z).
  - ✅ Dibujar los segmentos de llas líneas a partir de los puntos de coordenadas esféricas.
  - ✅ Agregar etiquetas a las líneas clave de ra y dec.
- **Carga de posiciones astronómicas**
  - ✅ Crear menos de 10 instancias de esferas o sprites y posicionarlas aleatoriamente en un radio no mayor de 50 unidades.
  - ✅ Leer y generar dinámicamente los puntos con la posición de las estrellas en una escala logarítmica (1, 10, 100).
  - 📈 Integrar un módulo de análisis de datos astronómicos para calcular la posición de las estrellas. Este existe en un notebook de python.

    (Es un conjunto de datos con información de las estrellas para convertir coordenas galácticas a coordenas esféricas con el módulo de `SkyCoord` y obtener sus magnitudes de brillo aparente y brillo absoluto).

- **Interactividad.**
  - ✅ Lograr seleccionar objetos celestes, obtener y mostrar información sobre estos (nombre, distancia, tamaño, brillo, etc.).
  - Cambiar o modificar el brillo/distancia de una estrella mediante botones y menús.
  - Filtrar objetos por tipo (estrellas, brillo, distancia, etc.), buscar objetos específicos por nombre o coordenadas, voltear a verlos y acercarse.
- **Controles de movimiento.**
  - ✅ Integrar controles de cámara en órbita para permitir con el ratón o teclado moverse, navegar, hacer zoom, girar, rotar y cambiar el ángulo de la vista del planetario en escena.
  - Fijar distancia mínima/máxima. No zoom más allá del cielo.
  - ✅ Resetear 0,0,0.
  - 💻 Añadir controles para interfaz (interactiva, II) gráfica (UI) HUD (HeadsUpDisplay) como botones, sliders o menús.
- **Optimización.**
  - ⚡️ Considerar técnicas de optimización y rendimiento estable como instancing, LOD (Level of Detail), o frustum culling. Para las escenas con gran cantidad de objetos en una cúpula o domo celeste esférico de estrellas.
- **Testeo.**
- **Realidad virtual (VR) / Realidad aumentada (AR).** Integrar soporte para VR/AR utilizando bibliotecas como WebXR para crear una experiencia inmersiva. La integración en interfaz gráfica UI es más flexible con mejor performance para actualizaciones dinámicas.
- **Sistema de color.** Añadir botones para cambiar entre diferentes sistemas de colores. Claro, oscuro, rojo. Realizar análisis como parte de la accesibilidad web.
- **Descarga de app.** Descarga la aplicación para móvil en android.
- **Integrar app.** Integrar la aplicación en otros sitios instalando la herramienta o mediante `<iframe>`.

[Ir al inicio](#thesis-project)

### Técnicos

Los requerimientos técnicos que tendría que tener como mínimo son:

- ✅ Vivir en un **repositorio** en línea de git.
- ✅ Usar un **manejador de paquetes** para instalar librerías y usarse como dependencias del archivo `package.json`, en lugar de usar un cdn o subir las librerías al repositorio de la aplicación. Un **entorno de ejecución** para actualizar y recargar instantáneamente el servidor local al realizar cambios en la aplicación. Un **builder** para compilar y minificar el código en archivos desplegables para distribución de la app en producción.
- ✅ Utilizar herramientas para el **linteo**, **formateo** y revisión de **sintaxis** del código.
- ✅ Colocar el `<canvas />` dentro del la etiqueta `<main />`.
- ✅ Ajustar y reescalar **resize** del ancho del canvas al ancho de la pantalla con `window.innerWidth` y `window.innerHeight`.
- Utilizar un entorno de **pruebas** unitarias y de componentes.
- Utilizar una configuración en **docker** para la creación de una imagen del entorno de ejecucción.
- Ordenar folders y archivos por jerarquía, tipo, extensión, js, css, etc.

[Ir al inicio](#thesis-project)

### Implementación

- Definir el setup con una **escena**, **cámara** y un **renderer**.
- Validar compatibilidad del navegador con [WebGL](./src/utils/warning.js).
- Definir un CSS2DRenderer para las etiquetas en el grid ecuatorial.
- Definir **controles** para la cámara y **luces** para la escena.

#### Retícula 🌐

Trigonometría para una retícula ecuatorial con líneas RA/Dec detallada en 3D. Calcular y transformar la posición de los puntos del sistema de coordenadas ecuatoriales (ra, dec) a cartesianas esféricas (x, y, z).

- ##### Declinación

Nueve líneas para la declinación a partir de -90° hasta 90° en pasos de 20° en 20° grados.

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.51.17.webp" width="800">

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

    points.push(new Vector3(x, y, z));
  }
  // Line Geometry
  //
}
```

[Ir al inicio](#thesis-project)

- ##### Ascensión Recta

Veinticuatro líneas para la ascensión recta de 0° a 360° en pasos de 15° en 15° grados.

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.52.41.webp" width="800">

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

    points.push(new Vector3(x, y, z));
  }
  // Line Geometry
  //
}
```

Para asignar los puntos a una geometría de línea y agregarlas a la escena se usa:

```js
// Line Geometry
const geometry = new BufferGeometry().setFromPoints(points);

// línea
const line = new Line(
  geometry,
  new LineBasicMaterial({
    color: 0xff0000,
  }),
);
line.updateMatrix();

// agrega a escena
scene.add(line);
```

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.36.webp" width="800">

Se utiliza `BufferGeometry` y `LineSegments` para líneas independientes. Mejor LOD o culling.

[Ir al inicio](#thesis-project)

Se ajustaron las líneas de RA (0°, 90°, 180°, 270°, 360°) que están en ángulos rectos para que lleguen hasta los ejes polares y las demás solo hasta los -70° y 70° en Dec respectivamente.

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.52.webp" width="800">

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

[Ir al inicio](#thesis-project)

##### Etiquetas

Three.js no renderiza texto nativamente en WebGL. Se trata de añadir etiquetas entre las intersecciones de las líneas paralelas (dec) y las meridianas (ra). Normalizar un espacio de margen entre la línea y la etiqueta. Evaluar el mejor método para agregarlas entre TextGeometry, Sprite y **CSS2DObject**.

Ventajas de usar Sprite:

- Se crea una textura de texto con un elemento html **canvas**: `new CanvasTexture(canvas)`. Al método `fillText()` del contexto 2D se le pasa el texto.
- Para rotar se hace en la propiedad del material del sprite. Esto es, la escala y rotación son locales.
- Crea una etiqueta visual para ver desde fuera sin tener que invertir la posición de lectura. Es decir, sigue a la cámara, pero puede requerir lookAt(camera).
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
  const label = new CSS2DObject(wrapper);

  // ajustar posición
  label.position.copy(pos);
  label.center.set(0, 1);

  return label;
};
```

###### Bugs

- 🐛 Mostrar las etiquetas a los extremos y ocultarlas del centro de la cámara.
- 🐛 Background de la vía láctea
- 🐛 Al buscar y seleccionar una estrella, tener la posibilidad enfocar la cámara a esta y viajar hasta allá.
- Cómo sincronizar la rotación de la cámara con un html canvas overlay que dibuje el grid de lineas sobre los ejes proyectados.
- Cómo utilizar un shader pesonalizado en una esfera transparente que dibuje las líneas RA/Dec basados en UV/spherical coordinates.
- 🦋 A veces se desposicionan las etiquetas, hacen una transición cuando se rota a los 90 grados.
- 🦋 Que el grid siga a la cámara cuando haga zoom o se desplace. Y pueda rotar para ver los ángulos.
- 🦋 Revisar frustum culling personalizado y no renderizar objetos fuera del campo de visión de la cámara.

###### Issues

- Al revisar el framerate.
- El desarrollo del planetario interactivo en Three.js no es viable.
- Se generan 500 Sprites con posición aleatoria a escala de tamaño a 0.1
- Culling manual personalizado de visibilidad tanto para Sprites como el grid de LineSegments y etiquetas CSS2DObjet. Este grid se actualiza cada que cámara se mueve.
- El framerate inicia en el navegador con 20 frames por segundo y en menos de 1 minuto se cae hasta los 2 frames. A consecuencia de esto la interacción se vuelve lenta.
- Si quisiéramos mostrar 107,380 sprites, que es en donde alcanzamos a ver a Polaris en el catálogo, el rendimiento comienza desde 1 frame, aun con el culling manual.
- Quizá se pueda hacer la prueba posteriomente en Unity o Unreal utilizando una arquitectura similar, los códigos y flujos de este.

[Ir al inicio](#thesis-project)

#### Estrellas

`Get Star Field` Instancias o Sprites de estrellas.

<img src="./static/capturas/Screen Shot 2026-06-24 at 0.26.26.webp" width="800">

```js
const createSpritedStars = (numStars = 500) => {
  const stars = new Object3D();

  // crea y calcula la posición de los sprites
  for (let i = 0; i < numStars; i++) {
    const starMaterial = new SpriteMaterial({ color: 0xffffff });
    const starSprite = new Sprite(starMaterial);

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

La ventaja de usar Three.js para el desarrollo de un planetario interactivo es la creación de una experiencia interactiva donde el usuario puede navegar por el cielo, seleccionar objetos, obtener información, etcétera. Además, la compatibilidad con navegadores web es suficiente, puesto que funciona con la mayoría de los navegadores modernos sin necesidad de plugins adicionales. Una comunidad activa de desarrolladores ofrecen soporte, ejemplos y recursos. Por lo que, crear un planetario interactivo con Three.js es un proyecto totalmente viable.

Three.js no incluye funciones astronómicas nativas. Las matemáticas deben hacerse de manera externa. Sin embargo; su arquitectura de escena, sistemas de coordenas, shaders, controles de cámara y demás, permiten construirlo desde cero o integrando librerías efímeras.

### Consejos

- Comienza con un planetario básico y añade funcionalidades gradualmente.
- Aprovecha los recursos disponibles en líneas. Como los datos astronómicos.
- Mantenlo técnico pero accionable.
- Mantén los fragmentos del código minimalista, pero ilustrativos.
- Mantenlo práctico y alineado con el Three.js actual.

[Ir al inicio](#thesis-project)

## Por qué se dejó de mantener el proyecto de Processing

- Processing utiliza un IDE que se tiene que descargar de la página. Desarrollar en el IDE es pesado y aburrido.
- Los archivos de la aplicación ejecutable pesan 520.5MB para **macos-aarch64**, 277.9MB **macos-x86_64** , 277MB **windows-amd64** y 277.4MB **linux-amd64**.
- Los archivos de extensión .pde (processing development) son clases en java.
- La sintáxis de java no es tan amihable como la de javascript.
- Es más fácil encontrar y entender la documentación de librerías js que paquetes java.
- Darle mantenimiento a funciones básicas como hacer click en un botón en Processing es muy lento que con elementos de html y javascript. Para correr el proyecto con el IDE es necesario instalar e importar la librería peasy para la creación de una cámara virtual en el ambiente.

Esto último me llevó a la reflexión de mejor hacerlo en un ambiente más abierto y controlado con frameworks o librerías flexibles y modernas para el desarrollo de gráficos en 3D.

Se utilizaron modelos como `gemma3:27b, gemma2:27b, qwen3.6:27b, qwen3.5:9b, mistral-small3.2:24b, mistral:7b, granite3.3:8b` para realizar consultas sobre el desarrollo de un planetario interactivo mediante el uso de la librería de Javascript [Three.js](https://threejs.org/docs/)

Entre las similitudes y capacidades de uno y otro en sus respuestas. En general todos me ayudaron por comenzar a estructurar mejor la arquitectura del sistema, a definir las necesidades básicas y requerimientos técnicos generales del desarrollo e implementación completa de la interfaz-interativa.

[Ir al inicio](#thesis-project)

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. [http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf](http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf)

[Ir al inicio](#thesis-project)

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

[https://threejs.org/examples/webgl_raycaster_sprite.html](https://threejs.org/examples/webgl_raycaster_sprite.html)

--

[Ir al inicio](#thesis-project)
