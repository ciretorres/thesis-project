// import * as THREE from "three";
import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
// módulo para comprobar si es compatible con webgl
import WebGL from "three/addons/capabilities/WebGL.js";
// módulo para mostrar estadísticas del render en el front
import Stats from "three/addons/libs/stats.module.js";
// módulo para rotar y zoom en la escena
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// variables globales
let camera, controls, orbit, scene, renderer, stats;

// Métodos para zoom
export const increasePositionZ = () => {
  camera.position.z += 5;
};
export const decreasePositionZ = () => {
  camera.position.z -= 5;
};
export const resetPosition = () => {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;
};

init();

// función de inicio
function init() {
  /**
   * a scene is the space in which you can places objects,cameras and lighting
   * @property {backgroundColor}: of the scene.
   * @see https://threejs.org/docs/#api/en/scenes/Scene
   */
  const createScene = (backgroundColor = new Color(0x444444)) => {
    let scene = new Scene();
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
   * new PerspectiveCamera(fov, aspect, near, far)
   * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
   */
  const createPerspectiveCamera = (
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 1,
    far = 1000,
  ) => {
    let perspectiveCamera = new PerspectiveCamera(fov, aspect, near, far);
    return perspectiveCamera;
  };

  /**
   * Renders a view that contains your camera's "picture"
   * @property {canvas}: in which will render the scene and camera.
   * @property {alpha}: Controls the default clear alpha value. When set totrue, the value is 0. Otherwise it's 1. Default is false.
   * @property {antialias}: Whether to use the default MSAA or not. Default is false.
   * @see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
   */
  const createWebGLRenderer = (canvas, alpha = false, antialias = true) => {
    return canvas === undefined
      ? new WebGLRenderer({
          alpha,
          antialias,
        })
      : new WebGLRenderer({
          canvas,
          alpha,
          antialias,
        });
  };

  /**
   * Creates a material that describe the appereance of objects
   * @property {color}:
   * @property {wireframe}:
   * @see https://threejs.org/docs/index.html#api/en/constants/Materials
   * @see https://threejs.org/manual/#en/materials
   */
  const createMeshBasicMaterial = (
    color = new Color("#ffffff"),
    wireframe = true,
  ) => {
    let hexadecimal = color.getHex();
    let material = new MeshBasicMaterial({
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
    let mesh = new Mesh(geometry, material);
    // scene.add(mesh);
    return mesh;
  };

  const getLight = (color = 0xffffff, intensity = 3) => {
    let light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    return light;
  };

  /**
   * Resize and update the size of render and camera aspect
   * @property {camera}:
   * * @property {renderer}:
   */
  function onWindowResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  main();

  // función principal
  function main() {
    // scene en donde puedes agregar luces, mesh o grupos
    scene = createScene(new Color(0x000000));
    // scene.fog = new FogExp2(0xcccccc, 0.002);

    // camera
    camera = createPerspectiveCamera(75);
    camera.near = 0.1;
    camera.far = 50;
    console.log(camera.position.y);
    camera.position.z = 1;

    // setup

    // selector html tags
    const mainid = document.querySelector("#mainid");
    const canvas = document.querySelector("#canvasid");
    const p = document.querySelector("#pid");
    const section = document.querySelector("#sectionid");

    // añade las stats
    stats = new Stats();
    mainid.appendChild(stats.dom).setAttribute("id", "statsid");
    const statsid = document.querySelector("#statsid");
    // statsid.setAttribute("style", "position:block");
    statsid.setAttribute(
      "style",
      "position: absolute; top: 0px; right: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;",
    );

    // renderer to render a view with camera contained
    renderer = createWebGLRenderer(canvas);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
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

    // orbit controls
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableZoom = true;
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

    // lights
    // const dirLight1 = getLight();
    // dirLight1.position.set(1, 1, 1);
    // const dirLight2 = getLight(0x002288);
    // dirLight2.position.set(-1, -1, -1);
    const color = 0xffffff;
    // const color = 0x555555;
    const intensity = 1;
    const light = new AmbientLight(color, intensity);
    // const light = new AmbientLight( 0x404040 ); // soft white light
    scene.add(light);
    const lights = [];
    lights[0] = new DirectionalLight(0xffffff, 3);
    lights[0].position.set(0, 200, 0);
    scene.add(lights[0]);

    // Implementación

    // Mesh para integrar a scene

    // Ejemplo de Código para Retícula Ecuatorial
    // Grid, Reticula Ecuatorial
    const radio = 20;
    // // La retícula se genera automáticamente sobre la esfera celeste
    // const R = 10; // radio de la esfera
    // const raStep = Math.PI / 6; // cada 30°
    // const decStep = Math.PI / 8; // cada 22.5°
    // const points = [];
    // console.log(R, raStep, decStep, points);
    // console.log(Math.PI / 2)
    // console.log(-Math.PI / 2 + decStep)
    // console.log(2 * Math.PI);
    // console.log(Math.PI / 36);
    // console.log(-Math.PI / 2 + Math.PI / 60);
    console.log(Math.PI / 60);

    // Líneas de Declinación (paralelos al ecuador celestial)
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
          points.push(new Vector3(x, y, z));
        }
        const geometry = new BufferGeometry().setFromPoints(points);
        // const material = createMeshBasicMaterial(new Color("#ff0000"));
        // const material = createMeshBasicMaterial(new Color("#7833aa"));

        // const mesh = createMesh(geometry, material);
        // mesh.updateMatrix();
        // mesh.matrixAutoUpdate = false;

        // const line = new Line(
        //   geometry,
        //   new LineBasicMaterial({ color: 0xff0000 }),
        // );
        const line = new LineSegments(
          geometry,
          new LineBasicMaterial({
            // color: 0x4488ff,
            color: 0xff0000,
            transparent: true,
            opacity: 0.6,
          }),
        );
        line.updateMatrix();
        scene.add(line);
      }
    }
    function linesDeclination(value = "all") {
      if (value === "all") {
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
    }
    linesDeclination();
    //
    // Líneas de Ascensión Recta (meridianos que pasan por los polos)
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
        // console.log(points);
        const geometry = new BufferGeometry().setFromPoints(points);
        const line = new Line(
          geometry,
          new LineBasicMaterial({ color: 0xff0000 }),
        );
        scene.add(line);
      }
    }
    function linesAscension(value = "all") {
      if (value === "all") {
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
    }
    linesAscension();
    //

    // console.log(
    //   radio * Math.cos((-90 * Math.PI) / 180) * Math.sin((0 * Math.PI) / 180),
    // );
    // console.log(
    //   radio * Math.cos((-90 * Math.PI) / 180) * Math.sin((1 * Math.PI) / 180),
    // );

    // Etiquetas en líneas paraleas al ecuador
    const spriteMap = new TextureLoader().load("/favicon.ico");
    const spriteMaterial = new SpriteMaterial({ map: spriteMap });
    for (let dec = -90; dec < 90; dec += 20) {
      for (let ra = 0; ra <= 360; ra++) {
        const sprite = new Sprite(spriteMaterial);
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

    // TODO: HUD/GUI
    // const gui = new GUI();

    //

    function render() {
      requestAnimationFrame(render);

      // group.rotation.x += 0.005;
      // group.rotation.y += 0.005;

      renderer.render(scene, camera);
    }

    function rotarMesh() {
      // // mesh.rotation.x += 0.001;
      // // mesh.rotation.y += 0.001;
      // //
      // mesh.rotation.x += 0.0001;
      // mesh.rotation.y += 0.0001;
      // line.rotation.x += 0.0001;
      // line.rotation.y += 0.0001;
      camera.rotation.x += 0.0001;
      camera.rotation.y += 0.0001;
    }

    // Resize
    window.addEventListener(
      "resize",
      function () {
        onWindowResize(camera, renderer);
      },
      false,
    );

    function animate() {
      // requestAnimationFrame(render);
      rotarMesh();

      render();
      p.innerText = `x: ${camera.position.x}; y: ${camera.position.y}; z: ${camera.position.z}`;

      // controls.update();
      // orbit.update();
      stats.update();
    }

    // // Líneas de Declinación (paralelos al ecuador celestial)
    // for (let dec = -Math.PI / 2 + decStep; dec < Math.PI / 2; dec += decStep) {
    //   console.log(dec);
    //   for (let ra = 0; ra < 2 * Math.PI; ra += Math.PI / 36) {
    //     const x = R * Math.cos(dec) * Math.sin(ra);
    //     const y = R * Math.sin(dec);
    //     const z = R * Math.cos(dec) * Math.cos(ra);
    //     points.push(new Vector3(x, y, z));
    //   }
    // }

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
    //     points.push(new Vector3(x, y, z));
    //   }
    // }

    //

    // // LINE
    // const lineBasicMaterial = new LineBasicMaterial({ color: 0xff0000 });
    // const points = [];
    // points.push(
    //   new Vector3(0, 0, -98.07852804032305),
    //   new Vector3(
    //     31.81896451432087,
    //     -76.81777567114163,
    //     -55.55702330196019,
    //   ),
    // );
    // const bufferGeometryPoints = new BufferGeometry().setFromPoints(
    //   points,
    // );
    // console.log(bufferGeometryPoints);
    // const lineVertical = new Line(
    //   bufferGeometryPoints,
    //   lineBasicMaterial,
    // );
    // scene.add(lineVertical);

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
    //     row[j] = new Vector3(x, y, z);
    //   }
    //   grid[i] = row;
    // }
    // // console.log(grid[0][0]);
    // // console.log(grid.length);

    // // LINE HORIZONTAL
    // const vertex = [];
    // for (let i = 0; i < grid.length; i++) {
    //   for (let j = 0; j < grid.length + 1; j++) {
    //     // console.log(i, j, grid[i][j]);
    //     let x = grid[i][j].x;
    //     let y = grid[i][j].y;
    //     let z = grid[i][j].z;
    //     vertex.push(new Vector3(x, y, z));
    //   }
    // }
    // // console.log(vertex);
    // const bufferGeometryVertex = new BufferGeometry().setFromPoints(
    //   vertex,
    // );
    // // console.log(bufferGeometryVertex);
    // const lineHorizontal = new Line(
    //   bufferGeometryVertex,
    //   lineBasicMaterial,
    // );
    // scene.add(lineHorizontal);
  }

  // utils
  // /**
  //  * Creates a geometry
  //  * @property {radius}:
  //  * @property {widthSegments}:
  //  * @property {heightSegments}:
  //  * @property {phiStart}:
  //  * @property {thetaStart}:
  //  * @property {thetaLength}:
  //  * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
  //  */
  // const createSphereGeometry = (
  //   radius = 1,
  //   widthSegments = 8,
  //   heightSegments = 8,
  //   phiStart = Math.PI * 2,
  //   thetaStart = 0,
  //   thetaLength = Math.PI,
  // ) => {
  //   const props = {
  //     radius: radius,
  //     widthSegments: widthSegments,
  //     heightSegments: heightSegments,
  //     phiStart: phiStart,
  //     thetaStart: thetaStart,
  //     thetaLength: thetaLength,
  //   };
  //   let geometry = new SphereGeometry(
  //     props.radius,
  //     props.widthSegments,
  //     props.heightSegments,
  //   );
  //   return geometry;
  // };
}
