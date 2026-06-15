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

- [Levantar](#levantar)
- [Ejecutar](#ejecutar)
- [Estructura de archivos](#estructura-de-archivos)
- [Requerimientos](#requerimientos)
  - [Técnicos](#técnicos)
- [Pasos para la Implementación](#pasos-para-la-implementación)
  - Escena
  - Cámara
  - Renderer
  - Controles
  - Luces
  - [Retícula](#retícula)
- [Estrellas](#estrellas)
- [Three.js](#threejs)
- [Referencias](#referencias)
- [Fuentes de información](#fuentes-de-información)

## Levantar

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

## Ejecutar

Compilar y _Hot-Reload_ para desarrollo

```
bun run dev
```

## Estructura de archivos

```md
thesis-project/
├── static/
├── src/
| ├── assets/
| ├── components/
| ├── composables/
| ├── mixins/
| ├── scripts/
| ├── utils/
| └── main.js
|
├── .gitignore
├── index.html/
├── package.json
└── README.md
```

[Ir al inicio](#thesis-project)

Utilicé cuatro modelos `gemma3:27b, gemma2:27b, qwen3.6:27b, mistral-small3.2:24b` para realizar una consulta sobre el desarrollo de un planetario interactivo mediante el uso de la librería three de Javascript. Les pedí que revisaran la documentación y ejemplos para que me dieran dos ideas sobre cómo construirlo, comenzando por la implementación de una retícula o rejilla/grid con coordenadas ecuatoriales.

[Ir al inicio](#thesis-project)

### Respuestas

Entre las similitudes y capacidades de uno y otro. En general todos me ayudaron por comenzar a estructurar mejor la arquitectura del sistema y a definir las necesidades básicas y los requerimientos técnicos generales del desarrollo de la visualización tomando en cuenta Three.js

Por lo que se comienzan a planear y documentar los pasos generales a seguir para el desarrollo y la implementación completa del planetario o interfaz-interativa.

Por su parte, los modelos `qwen3.6:27b` y `mistral-small3.2:24b` destacaron en darme ejemplos de código para el cálculo de una retícula geométrica 3d mediante líneas de espacio tridimensional o esféricas.

- aquí se abre un tema de discusión sobre la conversión de sistemas de coordenadas.

  Es decir, transformar **coordenas ecuatoriales**, con la información de Ascensión Recta (ra) para los meridianos que pasan por los ejes polares (0° a 360°) y la Declinación (dec) paralelos al ecuador celeste (-90° a +90°), a **coordenas esféricas** (x, y, z):

  La conversión a 3D se debe ajustar a la orientación de Three.js

  ```
  x = radius * cos(dec) * sin(ra)
  y = radius * sin(dec)
  z = radius * cos(dec) * cos(ra)
  ```

  Three.js utiliza el sistema de coordenadas 'Y-up' predeterminado, pero en astronomía se suele usar la convensión de 'Z-up' o los sistemas ecuatoriales J2000. Three.js no incluye funciones astronómicas nativas. Todas las matemáticas deben hacerse de manera externa. Pero su arquitectura de escena, sistemas de coordenas, shader y controles de cámara permiten construirlo desde cero o integrando librerías efímeras.

  Si alineamos el ecuador celeste con el plano XZ, entonces `y = r * sin(dec)`, y `x,z` de `cos(dec)` y `ra`.

  ```
  x = radius * cos(dec) * cos(ra)
  y = radius * sin(dec)
  z = radius * cos(dec) * sin(ra)
  ```

  ```
  /* Formula for obtaining spheric dimensions values
      x = r sin(θ) cos(Φ/φ)
      y = r sin(θ) sin(Φ/φ)
      z = r cos(θ)
  */
  ```

  Quizá sea necesario hacer la conversión o ajustar la 'camera.up'. Alinear el eje polar terreste vector(0,1,0) o rotar la escena.

  ```js
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

Las necesidades básicas, intermedias y avanzadas para el desarrollo e implementación del sistema de interfaz interactivo son:

- **Planetario simple.**
  - Mostrar/Visualizar una esfera de estrellas fijas.
  - ✅ La cámara puede moverse alrededor de la escena para explorar el cielo.
  - ✅ Un movimiento básico de rotación sobre el eje polar para la esfera de estrellas.

    (Cuando en la interfaz no haya actividad, se prenden. Al interactuar con la interfaz se apaga la rotación y se prende después de un medio minuto).

  - ✅ El fondo de la escena puede ser la vía láctea o el color negro.

- **Retícula geométrica con coordenadas ecuatoriales.**
  - Calcular y convertir los puntos de las líneas en función del sistema de coordenadas ecuatoriales a coordenadas esféricas (x,y,z).
  - Dibujar las líneas a partir de los puntos de las coordenas esféricas.
  - Agregar etiquetas a las líneas (ra, dec).
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
- ✅ Utilizar un **manejador de paquetes** para instalar las librerías y usarse como dependencias del archivo `package.json`. En lugar de utilizar un cdn o subir las librerías al repositorio la aplicación.
- ✅ Utilizar un **entorno de ejecución** para actualizar y recargar instantáneamente el servidor local al realizar cambios en la aplicación.
- Utilizar un **builder** para compilar y minificar el código en archivos desplegables para distribución de la app en producción.
- Utilizar un entorno de **pruebas** unitarias y de componentes.
- Utilizar una configuración en **docker** para la creación de una imagen del entorno de ejecucción.
- ✅ Utilizar herramientas para el **linteo**, **formateo** y revisión de **sintaxis** del código.
- ✅ Colocar el `<canvas />` dentro del la etiqueta `<main />`.
- ✅ Ajustar y reescalar **resize** del ancho del canvas al ancho de la pantalla con `window.innerWidth` y `window.innerHeight`.
- Ordenar con folders la jerarquía de los archivos js, css, etc. Ejemplo:

```
src/
├── assets/
| ├── base.css
| └──main.css
├── sketches/
| └── index.js
├── index.html
└── main.js
```

[Ir al inicio](#thesis-project)

### Pasos para la implementación

- Definir una [escena](./src/components/escena/index.js).
- Definir una [cámara](./src/components/camara/index.js).
- Definir un [renderer](./src/components/renderer/index.js).
- Validad compatibilidad con [WebGL](./src/utils/warning.js).
- Definir [controles](./src/components/controls/index.js) de órbita.
- Definir [luces](./src/components/lights/index.js).

[Ir al inicio](#thesis-project)

#### Retícula

Realizar/visualizar una retícula ecuatorial detallada.

##### Sistema de coordenas ecuatorial

- Construir las líneas RA/Dec con trigonometría.
- Calcular, transformar y convertir los puntos del sistema de coordenadas ecuatoriales (ra, dec) a coordenadas esféricas (x,y,z).

  ###### Declinación
  - Calcular los puntos de las líneas de declinación.

  ```js
  // 9 líneas para la declinación desde -90° hasta 90° en pasos de 20° en 20° grados
  for (let i = -90; i <= 90; i += 20) {
    const pi = Math.PI;
    const points = [];

    for (let j = 0; j <= 360; j++) {
      // // aquí cambia con declination
      const dec = (i * pi) / 180;
      const ra = (j * pi) / 180;

      // Fórmula para transformar las coordenadas de la forma Y-up
      const x = radio * Math.cos(dec) * Math.cos(ra);
      const y = radio * Math.sin(dec);
      const z = radio * Math.cos(dec) * Math.sin(ra);

      points.push(new Vector3(x, y, z));
    }
    // Genera geometría, material, mesh y agrega a escena
    //
  }
  ```

    <img src="./static/capturas/Screen Shot 2026-06-14 at 16.51.17.webp" width="800">

  [Ir al inicio](#thesis-project)

  ###### Ascensión Recta
  - Calcular los puntos para las líneas de ascensión recta.

  ```js
  // 24 lineas de ascención recta desde 0° hasta 360° en pasos de 15° en 15° grados
  for (let i = 0; i <= 360; i += 15) {
    const pi = Math.PI;
    const points = [];

    for (let j = -90; j <= 90; j++) {
      // // aquí cambia con ascensión
      const ra = (i * pi) / 180;
      const dec = (j * pi) / 180;

      // Fórmula para transformar coordenas de la forma Y-up
      const x = radio * Math.cos(dec) * Math.cos(ra);
      const y = radio * Math.sin(dec);
      const z = radio * Math.cos(dec) * Math.sin(ra);

      points.push(new Vector3(x, y, z));
    }
    // Genera geometría, material, mesh y agrega a escena
    //
  }
  ```

    <img src="./static/capturas/Screen Shot 2026-06-14 at 16.52.41.webp" width="800">
    - Para asignar los puntos a una geometría, crear el mesh de las líneas y agregarlas a la escena se usa:

  ```js
  // Genera geometría, material, mesh y agrega a escena
  const geometry = new BufferGeometry().setFromPoints(points);

  const line = new Line(
    geometry,
    new LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.6,
    }),
  );

  line.updateMatrix();
  scene.add(line);
  ```

  - Opciones `Line`, `LineSegments`, `MeshLine`. `BufferGeometry`. `LineBasicMaterial`.

  <img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.36.webp" width="800">

  [Ir al inicio](#thesis-project)

  ###### Ángulos rectos
  - Ajustar que las líneas de Ascensión Recta con ángulos rectos de 0, 90, 180, 270 y 360 lleguen hasta los ejes polares. Y los demás hasta -70° / 70°.

  ```js
  const angulosRectos = [0, 90, 180, 270, 360];

  if (angulosRectos.includes(i)) {
    for (let j = -90; j <= 90; j++) {
      // aquí cambia con ascensión
      const ra = (i * pi) / 180;
      const dec = (j * pi) / 180;

      // Fórmula para transformar coordenas de la forma Y-up
      const x = radio * Math.cos(dec) * Math.cos(ra);
      const y = radio * Math.sin(dec);
      const z = radio * Math.cos(dec) * Math.sin(ra);

      points.push(new Vector3(x, y, z));
    }
  } else {
    // esto soluciona que las líneas no lleguen hasta -90° o 90
    for (let j = -70; j <= 70; j++) {
      // aquí cambia con ascensión
      const ra = (i * pi) / 180;
      const dec = (j * pi) / 180;

      // Fórmula para transformar coordenas de la forma Y-up
      const x = radio * Math.cos(dec) * Math.cos(ra);
      const y = radio * Math.sin(dec);
      const z = radio * Math.cos(dec) * Math.sin(ra);

      points.push(new Vector3(x, y, z));
    }
  }
  ```

  <img src="./static/capturas/Screen Shot 2026-06-14 at 16.53.52.webp" width="800">

- Añadir etiquetas con texto para indicar los valores en las líneas los paralelos y meridianos.

  ###### Etiquetas
  - Calcular las etiquetas de las declinaciones
  - Posicionarlas con una desviación
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

Además, la compatibilidad con navegadores web es suficiente, puesto que funciona con la mayoría de los navegadores modernos sin necesidad de plugins adicionales. Una comunidad activa de desarrolladores ofrecen soporte, ejemplos y recursos.

Crear un planetario interactivo con Three.js es un proyecto totalmente viable.

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

--

[Ir al inicio](#thesis-project)
