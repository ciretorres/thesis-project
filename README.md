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

- [Instalar y ejecutar local](#instalación)
- [Estructura de archivos](#estructura-de-archivos)
- [Requerimientos](#requerimientos)
  - Básicos, intermedios y avanzados.
  - [Técnicos](#técnicos)
- [Implementación](#implementación)
  - Escena, Cámara, Renderer, Controles, Luces.
  - [Retícula](#retícula) ([Declinación](#declinación), [Ascensión Recta](#ascensión-recta), [Etiquetas](#etiquetas))
  - [Estrellas](#estrellas)
- [Three.js](#threejs)
- [Referencias](#referencias)
- [Fuentes de información](#fuentes-de-información)

## Instalación

1. Clona el repositorio

```
git clone https://github.com/ciretorres/thesis-project.git
```

2. Entra a la carpeta del proyecto

```
cd thesis-project
```

3. Dentro instala las dependencias del paquete

```
npm install
```

```
bun install
```

### Levantamiento local

4. Compila y levanta el proyecto en local

```
bun run dev
```

## Estructura de archivos

```md
thesis-project/
└── src/
│   ├── assets/
│   ├── componentes/
│   ├── notebooks/
│   ├── scripts/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── static/
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

[Ir al inicio](#thesis-project)

### Planteamiento y documentación

Los modelos de ollama `mistral-small3.2:24b`, `granite4.1:30b` y `qwen3.6:27b` me ayudaron con ejemplos en código para el desarrollo de un planetario interactivo y para el cálculo de una retícula geométrica en 3d mediante líneas de punto en el espacio esférico o superficie curva.

#### Conversión y convención de sistemas de coordenadas

Las coordenadas ecuatoriales son un sistema de referencia astronómico. En la astronomía estándar (ICRS/J2000) o en los sistemas ecuatoriales los ángulos de dirección de las coordenadas son:

- **Ascensión Recta (RA).** Es el ángulo del ecuador medido desde el equinoccio vernal (0,0) hasta el meridiano. Equivale a la coordenada de longitud angular en el plano Norte. Crece hacia el Este. Y va desde los 0° hasta los 360° así como de 0h hasta 24h.
- **Declinación (Dec).** Es la distancia angular desde el plano ecuatorial al Sur (-90°) y al Norte (90°). Equivale a la coordenada de latitud.

Para transformar las **coordenas ecuatoriales** (ra, dec) a **coordenas esféricas** (x, y, z), se utiliza la información sobre la RA para los meridianos que pasan por los ejes (0° a 360°) y la Dec paralelos al ecuador celeste (-90° a +90°).

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

#### Se define:

- Sistema de coordenadas 'Z-up' para la fórmula matemática de conversión.
- Rango para RA (0 a 2π) y Dec (-π/2 a π/2).
- Construcción geométrica y eficiente mediante segmentos de líneas, sprites, css2dobject, entre otros.

[Ir al inicio](#thesis-project)

## Requerimientos

Necesidades básicas, intermedias y avanzadas para la implementación del sistema interactivo:

- **Planetario simple**
  - ✅ Mostrar/Visualizar una esfera de estrellas fijas.
  - ✅ La cámara puede moverse alrededor de la escena para explorar el cielo.
  - 🌌 El fondo de la escena puede ser la vía láctea o el color negro.
  - 🤔 Un movimiento básico de rotación sobre el eje polar para la esfera de estrellas.

    (Cuando en la interfaz no haya actividad, comienza a rotar. Al interactuar se apaga la rotación y vuelve hasta después de medio minuto).

- **Retícula geométrica con coordenadas ecuatoriales**
  - ✅ Calcular y convertir los puntos de las líneas en función del sistema de coordenadas ecuatoriales (ra,dec) a coordenadas esféricas (x,y,z).
  - ✅ Dibujar los segmentos de las líneas a partir de los puntos de coordenadas esféricas.
  - ✅ Agregar etiquetas a las líneas clave de ra y dec.
  - 🐛 Mostrar las etiquetas a los extremos y ocultarlas del centro de la cámara.
  - 🦋 A veces se desposicionan las etiquetas, hacen una transición cuando se rota a los 90 grados.
  - 🦋 Que el grid siga a la cámara cuando haga zoom o se desplace. Y pueda rotar para ver los ángulos.
  - Cómo sincrsonizar la rotación de la cámara con un html canvas overlay que dibuje el grid de lineas sobre los ejes proyectados.
  - Cómo utilizar un shader pesonalizado en una esfera transparente que dibuje las líneas RA/Dec basados en UV/spherical coordinates.
- **Carga de posiciones astronómicas**
  - ✅ Crear menos de 10 instancias de esferas o sprites y posicionarlas aleatoriamente en un radio no mayor de 50 unidades.
  - ✅ Leer y generar dinámicamente los puntos con la posición de las estrellas en una escala logarítmica (1, 10, 100).
  - 📈 Integrar un módulo de análisis de datos astronómicos para calcular la posición de las estrellas. Este existe en un módulo de notebooks en python.

- **Interactividad.**
  - ✅ Lograr seleccionar objetos celestes, obtener y mostrar información sobre estos (nombre, distancia, tamaño, brillo, etc.).
  - Cambiar o modificar el brillo/distancia de una estrella mediante la selección de elementos como botones y menús.
  - Filtrar objetos por tipo (estrellas, brillo, distancia, etc.), buscar objetos específicos por nombre o coordenadas, voltear a verlos y acercarse.
  - 🐛 Al buscar y seleccionar una estrella, tener la posibilidad enfocar la cámara a esta y viajar hasta allá.
- **Controles de movimiento.**
  - 💻 Integrar controles de cámara en órbita para permitir con el ratón o teclado moverse o navegar:
    - Hacer zoom
    - Girar
    - Rotar
    - Paneo
    - y cambiar el ángulo de la vista del planetario en escena.
  - Fijar distancia mínima/máxima. No zoom más allá del cielo.
  - ✅ Resetear 0,0,0.
  - 💻 Añadir controles para interfaz (interactiva, II) gráfica (UI) HUD (HeadsUpDisplay) como botones, sliders o menús.
- **Optimización.**
  - ⚡️ Considerar técnicas de optimización y rendimiento estable como instancing, LOD (Level of Detail), o frustum culling. Para las escenas con gran cantidad de objetos en una cúpula o domo celeste esférico de estrellas.
  - 🦋 Revisar frustum culling personalizado y no renderizar objetos fuera del campo de visión de la cámara.
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
- Utilizar una configuración con **docker** para la creación de una imagen del entorno de ejecucción con un backend en node, mongodb o django, postgress. Propesta de estructura de archivos:

```md
thesis-project/
└── backend/
│   ├── api/
│   ├── chat/
│   └── src/
│      ├── requirements
│      └── README.md
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── componentes/
│   │   ├── scripts/
│   │   ├── utils
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   ├── static/
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── compose.yml
├── Dockerfile
├── LICENSE
└── README.md
```

- Ordenar folders y archivos por jerarquía, tipo, extensión, js, css, etc.

[Ir al inicio](#thesis-project)

### Implementación

- Definición del setup mediante una **escena**, una **cámara** y un **renderer**.
- Validar compatibilidad del navegador con [WebGL](./src/utils/warning.js).
- Definir un CSS2DRenderer para el etiquetado en el grid.
- Definir **controles** para la cámara.
- Definir **luces** para la escena.

#### Modelos

##### Retícula 🌐

Con la ayuda de la geometría analítica y la trigonometría se construye una figura esférica como retícula ecuatorial con líneas RA/Dec detallada en 3D. Por lo que se calcula y transforman la posición de los puntos del sistema de coordenadas ecuatoriales (ra, dec) al cartesianas esféricas (x, y, z).

- Declinación

Se trazan nueve líneas para representar la declinación a partir de -90° hasta 90° en pasos de 20° en 20° grados.

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

    points.push(new THREE.Vector3(x, y, z));
  }
  // Line Geometry
  //
}
```

- Ascensión Recta

Se trazan veinticuatro líneas para representar la ascensión recta de 0° a 360° en pasos de 15° en 15° grados.

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

<img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.36.webp" width="800">

Se utiliza `BufferGeometry` y `LineSegments` para líneas independientes. Mejor LOD o culling.

[Ir al inicio](#thesis-project)

Se ajustan las líneas de RA (0°, 90°, 180°, 270°, 360°) que están en ángulos rectos para que lleguen hasta los ejes polares y las demás solo hasta los -70° y 70° en Dec respectivamente.

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

[Ir al inicio](#thesis-project)

#### Estrellas

`Get Star Field` Instancias o Sprites de estrellas.

<img src="./static/capturas/Screen Shot 2026-06-24 at 0.26.26.webp" width="800">

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

La ventaja de usar Three.js para el desarrollo de un planetario interactivo es la creación de una experiencia interactiva donde el usuario puede navegar por el cielo, seleccionar objetos, obtener información, etcétera. Además, la compatibilidad con navegadores web es suficiente, puesto que funciona con la mayoría de los navegadores modernos sin necesidad de plugins adicionales. Una comunidad activa de desarrolladores ofrecen soporte, ejemplos y recursos.

Por lo que, crear un planetario interactivo con Three.js es un proyecto totalmente viable.

Three.js no incluye funciones astronómicas nativas. Las matemáticas se realizan de manera externa. Sin embargo; su arquitectura de escena, sistemas de coordenas, shaders, controles de cámara y entre otras, permiten construirlo desde cero o integrando librerías efímeras.

### Consejos

- Comienza con un planetario básico y añade funcionalidades gradualmente.
- Aprovecha los recursos disponibles en líneas. Como los datos astronómicos.
- Mantenlo técnico pero accionable.
- Mantén los fragmentos del código minimalista, pero ilustrativos.
- Mantenlo práctico y alineado con el Three.js actual.

[Ir al inicio](#thesis-project)

## Por qué se dejó de mantener el proyecto de Processing

- Processing utiliza un IDE que se tiene que descargar de la página. Desarrollar en el IDE es pesado.
- Los archivos de la aplicación ejecutable pesan 520.5MB para **macos-aarch64**, 277.9MB **macos-x86_64** , 277MB **windows-amd64** y 277.4MB **linux-amd64**.
- Los archivos de extensión .pde (processing development) son clases en java.
- Me resulta mejor la sintáxis en javascript o typescript en java.
- Me resulta más fácil encontrar y entender la documentación de librerías js que paquetes java.
- Mantener funciones básicas como hacer click en un botón en Processing es más rápido con elementos de html y js que en Processing.
- Para correr el proyecto con el IDE es necesario instalar e importar la librería peasy para la creación de una cámara virtual en el ambiente.

Lo anterior me llevó a la reflexión de hacerlo mejor en un ambiente más abierto y controlado con frameworks o librerías flexibles y modernas para el desarrollo de gráficos en 3D.

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
