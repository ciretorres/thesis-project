# Requerimientos

- [Requerimientos](#requerimientos)
  - Básicos, intermedios y avanzados. [Técnicos](#técnicos). Consejos.
- [Fuente de información](#fuentes-de-información)

## Necesidades básicas, intermedias y avanzadas para el sistema interactivo:

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
  - Cómo sincronizar la rotación de la cámara con un html canvas overlay que dibuje el grid de lineas sobre los ejes proyectados.
  - Cómo utilizar un shader pesonalizado en una esfera transparente que dibuje las líneas RA/Dec basados en UV/spherical coordinates.
- **Carga de posiciones astronómicas**
  - ✅ Crear menos de 10 instancias de esferas o sprites y posicionarlas aleatoriamente en un radio no mayor de 50 unidades.
  - ✅ Leer y generar dinámicamente los puntos con la posición de las estrellas en una escala logarítmica (1, 10, 100).
  - 📈 Integrar un módulo de análisis de datos astronómicos en notebooks para calcular la posición, las coordenadas, la distancia y el brillo de las estrellas.

- **Interactividad.**
  - ✅ Lograr seleccionar objetos celestes, obtener y mostrar información sobre estos (nombre, distancia, tamaño, brillo, etc.).
  - ✅ Cambiar o modificar el brillo/distancia de una estrella mediante la selección de elementos como botones y menús.
  - Filtrar objetos por tipo (estrellas, brillo, distancia, etc.), buscar objetos específicos por nombre o coordenadas, voltear a verlos y acercarse.
  - Al buscar y seleccionar una estrella, tener la posibilidad enfocar la cámara a esta y viajar hasta allá.
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
- **Desplegar la app en línea.** ✈️ Utilizar github pages para deplegarlo como sitio.
- **Descarga de app.** Descarga la aplicación para móvil en android.
- **Integrar app.** Integrar la aplicación en otros sitios instalando la herramienta o mediante `<iframe>`.

[Ir arriba](#requerimientos)

## Técnicos

Los requerimientos técnicos que tendría que tener como mínimo son:

- ✅ Vivir en un **repositorio** en línea de git.
- ✅ Usar un **manejador de paquetes** para instalar librerías y usarse como dependencias del archivo `package.json`, en lugar de usar un cdn o subir las librerías al repositorio de la aplicación. Un **entorno de ejecución** para actualizar y recargar instantáneamente el servidor local al realizar cambios en la aplicación. Un **builder** para compilar y minificar el código en archivos desplegables para distribución de la app en producción.
- ✅ Utilizar herramientas para el **linteo**, **formateo** y revisión de **sintaxis** del código.
- ✅ Colocar el `<canvas />` dentro del la etiqueta `<main />`.
- ✅ Ajustar y reescalar **resize** del ancho del canvas al ancho de la pantalla con `window.innerWidth` y `window.innerHeight`.
- Utilizar un entorno de **pruebas** unitarias y de componentes.
- 🐳 Utilizar una configuración con **docker** para la creación de una imagen del entorno de ejecucción con un backend en node, mongodb o django, postgress. Propesta de estructura de archivos:

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

## Consejos

- Comienza con un planetario básico y añade funcionalidades gradualmente.
- Aprovecha los recursos disponibles en líneas. Como los datos astronómicos.
- Mantenlo técnico pero accionable.
- 🖼 Mantén los fragmentos del código minimalista, pero ilustrativos.
- Mantenlo práctico y alineado con el Three.js actual.

[Ir arriba](#requerimientos)

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

---

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

[Ir arriba](#requerimientos)
