# thesis-project

![](https://img.shields.io/badge/status-in%20progress-yellow)

refactorización javascript

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

---

- [Levantar](#levantar)
- [Ejecutar](#ejecutar)
- [Estructura de archivos](#estructura-de-archivos)
- [Requerimientos](#requerimientos)
  - [Técnicos](#técnicos)
- [Pasos para la Implementación](#pasos-para-la-implementación)
  - [Escena](#escena)
  - [Retícula](#retícula)
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
├── public/
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

[Ir al inicio](#thesis-project)

### Técnicos

Los requerimientos técnicos que tendría que tener como mínimo son:

- ✅ Vivir en un **repositorio** en línea de git.
- ✅ Utilizar un **manejador de paquetes** para instalar las librerías y usarse como dependencias del archivo `package.json`. En lugar de utilizar un cdn o subir las librerías al repositorio la aplicación.
- ✅ Utilizar un **entorno de ejecución** para actualizar y recargar instantáneamente el servidor local al realizar cambios en la aplicación.
- Utilizar un **builder** para compilar y minificar el código en archivos desplegables para la distribución de la app.
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

#### Escena

Definir una escena.

[Ir al inicio](#thesis-project)

#### Retícula

Realizar/visualizar una retícula ecuatorial detallada.

##### Sistema de coordenas ecuatorial

- Construir las líneas RA/Dec con trigonometría.
- Calcular, transformar y convertir los puntos del sistema de coordenadas ecuatoriales (ra, dec) a coordenadas esféricas (x,y,z). `Grid Generation Formula`

  ###### Declinación
  - Calcular las líneas de declinación paralelos al ecuador celeste
  - Crear una geometría a partir de los puntos
  - Crear los segmentos de líneas con `LineSegments, MeshLine o BufferGeometry. LineBasicMaterial`.
  - Agregarlas a la escena

  ```js
  // 9 líneas de declinación de -90° a 90° de 20° en 20°
  for (let dec = -90; dec < 90; dec += 20) {
    const points = [];
    for (let ra = 0; ra <= 360; ra++) {
      const x =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.cos((ra * Math.PI) / 180);
      const y = radio * Math.sin((dec * Math.PI) / 180);
      const z =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.sin((ra * Math.PI) / 180);
      points.push(new Vector3(x, y, z));
    }
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, new LineBasicMaterial({ color: 0xff0000 }));
    scene.add(line);
  }
  ```

  ###### Ascensión Recta
  - Calcular las líneas de ascensión recta meridianos que pasan por los ejes polares.
  - Crear una geometría a partir de los puntos
  - Crear los segmentos de líneas con `LineSegments, MeshLine o BufferGeometry. LineBasicMaterial`.
  - Agregarlas a la escena

  ```js
  // 24 lineas de ascención recta de 0° a 360° de 15° en 15°
  for (let ra = 0; ra < 360; ra += 15) {
    const points = [];
    for (let dec = -90; dec <= 90; dec++) {
      const x =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.cos((ra * Math.PI) / 180);
      const y = radio * Math.sin((dec * Math.PI) / 180);
      const z =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.sin((ra * Math.PI) / 180);
      points.push(new Vector3(x, y, z));
    }
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, new LineBasicMaterial({ color: 0xff0000 }));
    scene.add(line);
  }
  ```

  ###### Ángulos rectos
  - Ajustar que solo los ángulos de ra 0, 90, 180, 270 y 360 toquen el eje polar.

  ```js
  if (ra === 180 || ra === 360 || ra === 90 || ra === 270 || ra === 0) {
    for (let dec = -90; dec <= 90; dec++) {
      const x =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.cos((ra * Math.PI) / 180);
      const y = radio * Math.sin((dec * Math.PI) / 180);
      const z =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.sin((ra * Math.PI) / 180);
      points.push(new Vector3(x, y, z));
    }
  } else {
    for (let dec = -70; dec <= 70; dec++) {
      const x =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.cos((ra * Math.PI) / 180);
      const y = radio * Math.sin((dec * Math.PI) / 180);
      const z =
        radio *
        Math.cos((dec * Math.PI) / 180) *
        Math.sin((ra * Math.PI) / 180);
      points.push(new Vector3(x, y, z));
    }
  }
  ```

- Añadir etiquetas con texto para indicar los valores en las líneas los paralelos y meridianos.

  ###### Etiquetas
  - Calcular las etiquetas de las declinaciones
  - Posicionarlas con una desviación
  - Hacer que solo se vean hacia las de los extremos

- Cómo sincronizar la rotación de la cámara con un html canvas overlay que dibuje el grid de lineas sobre los ejes proyectados.
- Cómo utilizar un shader pesonalizado en una esfera transparente que dibuje las líneas RA/Dec basados en UV/spherical coordinates.

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

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. Recuperada de: http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf

## Fuentes de información

[35 incredible dataviz tools](https://www.creativebloq.com/design-tools/data-visualization-712402)

[https://babylonjs.com/](https://babylonjs.com/)

[https://threejs.org/docs/](https://threejs.org/docs/)

[https://ollama.com/](https://ollama.com/)
