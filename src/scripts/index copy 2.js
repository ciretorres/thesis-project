import * as THREE from "three";
// módulo para comprobar si es compatible con webgl
import WebGL from "three/addons/capabilities/WebGL.js";
// módulo para mostrar estadísticas del render en el front
import Stats from "three/addons/libs/stats.module.js";
// módulo para rotar y zoom en la escena
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// variables globales
let camera, controls, scene, renderer, stats;

init();

// Métodos para zoom
export const increasePositionZ = () => {
  camera.position.z += 5;
};
export const decreasePositionZ = () => {
  camera.position.z -= 5;
};

// función de inicio
function init() {
  // setup
  const mainid = document.querySelector("#mainid");
  const canvas = document.querySelector("#canvasid");
  const p = document.querySelector("#pid");
  const section = document.querySelector("#sectionid");

  // añade las stats
  stats = new Stats();
  section.appendChild(stats.dom).setAttribute("id", "statsid");
  const statsid = document.querySelector("#statsid");
  statsid.setAttribute("style", "position:block");

  // función principal
  function main() {
    // Renders a view that contains your camera's "picture"
    renderer = createWebGLRenderer(canvas);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setAnimationLoop(animate);
    mainid.appendChild(renderer.domElement);

    //  Advertir si el navegador es compatible con WebGL
    if (WebGL.isWebGL2Available()) {
      // Initiate function or other initializations here
      // Manda lo que se debe actualizar cada cierto tiempo para animar
      renderer.setAnimationLoop(animate);
      console.log(WebGL.isWebGL2Available());
    } else {
      // Mostrar mensaje no compatible
      canvas.style.display = "none";
      const warning = WebGL.getWebGL2ErrorMessage();
      document.querySelector("mainid").appendChild(warning);
      const AdvertenciaWebGLNoCompatible = document.createElement("div");
      AdvertenciaWebGLNoCompatible.innerHTML += `
        <h2>
          Tu tarjeta gráfica parece no soportar
          <a
            href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation"
            target="_blank"
            rel="noopener noreferrer">
            WebGL 2
          </a>
        </h2>`;
      document
        .querySelector("#webglmessage")
        .appendChild(AdvertenciaWebGLNoCompatible);
    }

    // Implementación

    // Una scene es el lugar en donde puedes agregar luces, mesh o grupos
    scene = createScene(new THREE.Color(0x000000));
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    // Adds a camera
    // A perspective view that simulates the behaviour of a film camera in real life
    // const aspect = window.innerWidth / window.innerHeight;
    // camera = createPerspectiveCamera(60, aspect, 0.1);
    camera = createPerspectiveCamera(75);
    camera.position.z = 40;

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableZoom = false;

    // Ejemplo de Código para Retícula Ecuatorial
    const radio = 20;

    // for (let dec = -90; dec < 90; dec += 15) {
    //   const points = [];
    //   for (let ra = 0; ra <= 360; ra++) {
    //     const x =
    //       radio *
    //       Math.cos((dec * Math.PI) / 180) *
    //       Math.cos((ra * Math.PI) / 180);
    //     const y = radio * Math.sin((dec * Math.PI) / 180);
    //     const z =
    //       radio *
    //       Math.cos((dec * Math.PI) / 180) *
    //       Math.sin((ra * Math.PI) / 180);
    //     points.push(new THREE.Vector3(x, y, z));
    //   }
    //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //   const line = new THREE.Line(
    //     geometry,
    //     new THREE.LineBasicMaterial({ color: 0xff0000 }),
    //   );
    //   scene.add(line);
    // }
    lineasDec();
    function lineasDec() {
      // lineaDec(-90, -70);
      lineaDec(-70, -50);
      lineaDec(-50, -30);
      lineaDec(-30, -10);
      lineaDec(-10, 10);
      // lineaDec(0, 20); // línea horizontal 0,0
      lineaDec(10, 30);
      lineaDec(30, 50);
      lineaDec(50, 70);
      lineaDec(70, 90);
    }
    function lineaDec(inicial, condition) {
      // 9 líneas de declinación de -90° a 90° de 20° en 20°
      for (let dec = inicial; dec < condition; dec += 20) {
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
          points.push(new THREE.Vector3(x, y, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: 0xff0000 }),
        );
        scene.add(line);
      }
    }
    // Etiquetas en líneas paraleas al ecuador
    const spriteMap = new THREE.TextureLoader().load("../public/favicon.ico");
    const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });

    for (let dec = -90; dec < 90; dec += 20) {
      for (let ra = 0; ra <= 360; ra++) {
        const sprite = new THREE.Sprite(spriteMaterial);
        const x =
          radio *
          Math.cos((dec * Math.PI) / 180) *
          Math.cos((ra * Math.PI) / 180);
        const y = radio * Math.sin((dec * Math.PI) / 180);
        const z =
          radio *
          Math.cos((dec * Math.PI) / 180) *
          Math.sin((ra * Math.PI) / 180);
        // Posicionar la etiqueta en el punto correspondiente
        sprite.position.set(x, y + 0.5, z);
        // sprite.position.set(6.82, 19.79, 0.47);
        if ([253, 270, 287].includes(ra)) {
          scene.add(sprite);
        }
      }
      console.log("-", dec);
    }

    linesAsc();
    function linesAsc() {
      lineaAsc(0, 0);
      lineaAsc(0, 15);
      lineaAsc(15, 30);
      lineaAsc(30, 45);
      lineaAsc(45, 60);
      lineaAsc(60, 75);
      lineaAsc(75, 90);
      lineaAsc(90, 105); // línea vertical 90,90
      lineaAsc(105, 120);
      lineaAsc(120, 150);
      lineaAsc(150, 180); // mitad
      lineaAsc(180, 195);
      lineaAsc(195, 210);
      lineaAsc(210, 225);
      lineaAsc(225, 240);
      lineaAsc(240, 255);
      lineaAsc(255, 270);
      lineaAsc(270, 285); // línea vertical 90,-90
      lineaAsc(285, 300);
      lineaAsc(300, 315);
      lineaAsc(315, 330);
      lineaAsc(330, 345);
      lineaAsc(345, 360);
    }
    function lineaAsc(initialRa, conditionRa) {
      for (let ra = initialRa; ra < conditionRa; ra += 15) {
        // 24 lineas de ascención recta de 0° a 360° de 15° en 15°
        const points = [];
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
            points.push(new THREE.Vector3(x, y, z));
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
            points.push(new THREE.Vector3(x, y, z));
          }
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: 0xff0000 }),
        );
        scene.add(line);
      }
    }

    // console.log(
    //   radio * Math.cos((-90 * Math.PI) / 180) * Math.sin((0 * Math.PI) / 180),
    // );
    // console.log(
    //   radio * Math.cos((-90 * Math.PI) / 180) * Math.sin((1 * Math.PI) / 180),
    // );
    // console.log(points);

    // // La retícula se genera automáticamente sobre la esfera celeste
    // const R = 10; // radio de la esfera
    // const raStep = Math.PI / 6; // cada 30°
    // const decStep = Math.PI / 8; // cada 22.5°
    // const points = [];
    // console.log(R, raStep, decStep, points);

    // // Líneas de Declinación (paralelos al ecuador celestial)
    // for (let dec = -Math.PI / 2 + decStep; dec < Math.PI / 2; dec += decStep) {
    //   console.log(dec);
    //   for (let ra = 0; ra < 2 * Math.PI; ra += Math.PI / 36) {
    //     const x = R * Math.cos(dec) * Math.sin(ra);
    //     const y = R * Math.sin(dec);
    //     const z = R * Math.cos(dec) * Math.cos(ra);
    //     points.push(new THREE.Vector3(x, y, z));
    //   }
    // }
    // console.log(-Math.PI / 2);
    // console.log(points);

    // // Líneas de Ascensión Recta (meridianos que pasan por los polos)
    // for (let ra = 0; ra < 2 * Math.PI; ra += raStep) {
    //   for (
    //     let dec = -Math.PI / 2 + Math.PI / 60;
    //     dec < Math.PI / 2;
    //     dec += Math.PI / 60
    //   ) {
    //     const x = R * Math.cos(dec) * Math.sin(ra);
    //     const y = R * Math.sin(dec);
    //     const z = R * Math.cos(dec) * Math.cos(ra);
    //     points.push(new THREE.Vector3(x, y, z));
    //   }
    // }
    // console.log(points);

    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // const lines = new THREE.LineSegments(
    //   geometry,
    //   new THREE.LineBasicMaterial({
    //     // color: 0x4488ff,
    //     color: 0xff0000,
    //     transparent: true,
    //     opacity: 0.6,
    //   }),
    // );
    // scene.add(lines);

    //

    // // Creates a box, geometry, 3d model, cube or mesh
    // const radius = 24;
    // const widthSegments = 32;
    // const heightSegments = 32;
    // const geometry = createSphereGeometry(
    //   radius,
    //   widthSegments,
    //   heightSegments,
    // );
    // // const geometry = createSphereGeometry(1, 5, 3);
    // // Creates a material that describe the appereance of objects
    // const material = createMeshBasicMaterial(new THREE.Color("#ff0000"));
    // // const material = createMeshBasicMaterial(new THREE.Color("#7833aa"));
    // // Adds the geometry to the mesh and apply the material to it
    // const mesh = createMesh(geometry, material);
    // mesh.updateMatrix();
    // // // mesh.matrixAutoUpdate = false;
    // // scene.add(mesh);

    // // Calcula líneas de geometría grid
    // const ratio = 100;
    // const total = 16;
    // const grid = [];
    // for (let i = 0; i < total; i++) {
    //   const row = new Array(total + 1);
    //   for (let j = 0; j < total + 1; j++) {
    //     const latitude = ((i - 0) * (Math.PI - 0)) / (total - 0) + 0;
    //     const longitude = ((j - 0) * (Math.PI * 2 - 0)) / (total - 0) + 0;

    //     const x = ratio * Math.sin(latitude) * Math.cos(longitude);
    //     const y = ratio * Math.sin(latitude) * Math.sin(longitude);
    //     const z = ratio * Math.cos(latitude);

    //     row[j] = new THREE.Vector3(x, y, z);
    //   }
    //   grid[i] = row;
    // }
    // // console.log(grid[0][0]);
    // // console.log(grid.length);

    // // LINE VERTICAL
    // const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // const points = [];
    // points.push(
    //   new THREE.Vector3(0, 0, -98.07852804032305),
    //   new THREE.Vector3(
    //     31.81896451432087,
    //     -76.81777567114163,
    //     -55.55702330196019,
    //   ),
    // );

    // const bufferGeometryPoints = new THREE.BufferGeometry().setFromPoints(
    //   points,
    // );
    // console.log(bufferGeometryPoints);
    // const lineVertical = new THREE.Line(
    //   bufferGeometryPoints,
    //   lineBasicMaterial,
    // );
    // scene.add(lineVertical);

    // // LINE HORIZONTAL
    // const vertex = [];
    // for (let i = 0; i < grid.length; i++) {
    //   for (let j = 0; j < grid.length + 1; j++) {
    //     // console.log(i, j, grid[i][j]);
    //     let x = grid[i][j].x;
    //     let y = grid[i][j].y;
    //     let z = grid[i][j].z;
    //     vertex.push(new THREE.Vector3(x, y, z));
    //   }
    // }
    // // console.log(vertex);
    // const bufferGeometryVertex = new THREE.BufferGeometry().setFromPoints(
    //   vertex,
    // );
    // // console.log(bufferGeometryVertex);
    // const lineHorizontal = new THREE.Line(
    //   bufferGeometryVertex,
    //   lineBasicMaterial,
    // );
    // scene.add(lineHorizontal);

    // TODO: lights
    // const dirLight1 = getLight();
    // dirLight1.position.set(1, 1, 1);
    // const dirLight2 = getLight(0x002288);
    // dirLight2.position.set(-1, -1, -1);
    // const ambientLight = new THREE.AmbientLight(0x555555);
    // scene.add(ambientLight);
    // TODO: HUD/GUI
    // const gui = new GUI();
    //
    // Crear controles
    // TODO: Revisar documentación
    // createTrackballControls(camera);
    // //
    // function createTrackballControls(camera) {
    //   // controls = new TrackballControls(camera, renderer.domElement);
    //   // controls.rotateSpeed = 1.0;
    //   // controls.zoomSpeed = 1.2;
    //   // controls.panSpeed = 0.8;
    //   // controls.keys = ["KeyA", "KeyS", "KeyD"];
    // }

    //  Ajustar ancho de la pantalla al render
    window.addEventListener("resize", onWindowResize);
    //
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function rotarMesh() {
      // // mesh.rotation.x += 0.001;
      // // mesh.rotation.y += 0.001;
      // //
      // mesh.rotation.x += 0.0001;
      // mesh.rotation.y += 0.0001;
      // line.rotation.x += 0.0001;
      // line.rotation.y += 0.0001;
    }

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
      // requestAnimationFrame(render);
      rotarMesh();

      render();

      p.innerText = `x: ${camera.position.x}; y: ${camera.position.y}; z: ${camera.position.z}`;

      // controls.update();
      stats.update();
    }
  }

  // utils
  /**
   * Renders a view that contains your camera's "picture"
   * @see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
   */
  const createWebGLRenderer = (canvas) => {
    let alpha = true;
    return new THREE.WebGLRenderer({
      alpha: alpha,
      antialias: true,
      canvas,
    });
  };
  /**
   * a scene is the space in which you can places objects,cameras and lighting
   * @see https://threejs.org/docs/#api/en/scenes/Scene
   */
  const createScene = (backgroundColor = new THREE.Color(0x000000)) => {
    let scene = new THREE.Scene();
    scene.background = backgroundColor;
    return scene;
  };
  /**
   * Adds a camera
   * A perspective view that simulates the behaviour of a film camera in real life
   * @property {fov}: the vertical field of view.
   * @property {aspect}: this is the aspect ratio you use to create the horizontal field of view based off the vertical.
   * @property {near}: this is the nearest plane of view (where the camera's view begins) .
   * @property {far}: this is far plane of view (where the camera's view ends).
   * new THREE.PerspectiveCamera(fov, aspect, near, far)
   * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
   */
  const createPerspectiveCamera = (
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 1,
    far = 1000,
  ) => {
    let perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return perspectiveCamera;
  };
  /**
   * Creates a geometry
   * @property {radius}:
   * @property {widthSegments}:
   * @property {heightSegments}:
   * @property {phiStart}:
   * @property {thetaStart}:
   * @property {thetaLength}:
   * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
   */
  const createSphereGeometry = (
    radius = 1,
    widthSegments = 8,
    heightSegments = 8,
    phiStart = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
  ) => {
    const props = {
      radius: radius,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
      phiStart: phiStart,
      thetaStart: thetaStart,
      thetaLength: thetaLength,
    };
    let geometry = new THREE.SphereGeometry(
      props.radius,
      props.widthSegments,
      props.heightSegments,
    );
    return geometry;
  };
  /**
   * Creates a material that describe the appereance of objects
   * @property {color}:
   * @property {wireframe}:
   * @see https://threejs.org/docs/index.html#api/en/constants/Materials
   * @see https://threejs.org/manual/#en/materials
   */
  const createMeshBasicMaterial = (
    color = new THREE.Color("#ffffff"),
    wireframe = true,
  ) => {
    let hexadecimal = color.getHex();
    let material = new THREE.MeshBasicMaterial({
      color: hexadecimal,
      wireframe: wireframe,
    });
    return material;
  };
  /**
   * Adds the geometry to the mesh and apply the material to it
   * @property {geometry}:
   * @property {material}:
   */
  const createMesh = (geometry, material) => {
    let mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
    return mesh;
  };
  // lights
  // const getLight = (color = 0xffffff, intensity = 3) => {
  //   let light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(-1, 2, 4);
  //   scene.add(light);
  //   return light;
  // };

  main();
}
