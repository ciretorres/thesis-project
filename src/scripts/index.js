/**
 * @see https://www.npmjs.com/package/three?activeTab=versions
 * */
// import * as THREE from "three";
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Vector3,
} from "three";

// módulo para rotar y zoom en la escena

import camara from "../components/camara";
import newControls from "../components/controls";
import escena from "../components/escena";
import newLights from "../components/lights";
import newRenderer from "../components/renderer";
import newStats from "../components/stats";
import onWindowResize from "../utils/resize.js";
import checaWebGLCompatibilidad from "../utils/warning.js";

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
  // setup
  // selector html tags
  const p = document.querySelector("#pid");

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

  main();

  // función principal
  function main() {
    // scene en donde puedes agregar luces, mesh o grupos
    scene = escena();

    // camera
    camera = camara();

    // añade las stats
    stats = newStats("#mainid");

    // renderer to render a view with camera contained
    renderer = newRenderer("#mainid", "#canvasid");

    //  Advertir si el navegador es compatible con WebGL
    checaWebGLCompatibilidad(renderer, animate, "maindid", "#canvasid");

    // orbit controls
    orbit = newControls(camera, renderer);

    // lights
    newLights(scene);

    // Implementación

    // Mesh para integrar a scene

    // Ejemplo de Código para Retícula Ecuatorial
    // Grid, Reticula Ecuatorial

    const group = new Group();

    // Declinación
    function gridDeclinationLines() {
      // 9 líneas de declinación de -90° a 90° de 20° en 20°
      const start1 = -90;
      const condition1 = 90;
      const step1 = 20;
      const start2 = 0;
      const condition2 = 360;

      const radio = 20;

      for (let i = start1; i <= condition1; i += step1) {
        const pi = Math.PI;
        const points = [];

        for (let j = start2; j <= condition2; j++) {
          // aquí cambia con declination
          const dec = (i * pi) / 180;
          const ra = (j * pi) / 180;

          // forma uno z-up
          // const x = radio * Math.sin(lat) * Math.cos(lon);
          // const y = radio * Math.sin(lat) * Math.sin(lon);
          // const z = radio * Math.cos(lat);
          // forma dos y-up
          // const x = radio * Math.sin(lat) * Math.cos(lon);
          // const y = radio * Math.cos(lat);
          // const z = radio * Math.sin(lat) * Math.sin(lon);
          // forma tres x-up
          // const x = radio * Math.cos(lat);
          // const y = radio * Math.sin(lat) * Math.cos(lon);
          // const z = radio * Math.sin(lat) * Math.sin(lon);

          // forma cuatro y-up
          const x = radio * Math.cos(dec) * Math.cos(ra);
          const y = radio * Math.sin(dec);
          const z = radio * Math.cos(dec) * Math.sin(ra);

          // if ([70, 50].includes(i)) {
          //   // console.log(x, y, z);
          //   points.push(new Vector3(x, y, z));
          // }
          points.push(new Vector3(x, y, z));
        }

        const geometry = new BufferGeometry().setFromPoints(points);

        // const material = createMeshBasicMaterial(new Color("#ff0000"));
        // const material = createMeshBasicMaterial(new Color("#7833aa"));
        // const material = createMeshBasicMaterial(new Color("#4488ff"));
        const material = new LineBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.6,
        });

        // const mesh = createMesh(geometry, material);
        // mesh.updateMatrix();
        // mesh.matrixAutoUpdate = false;
        const line = new Line(geometry, material);

        line.updateMatrix();
        // scene.add(line);
        group.add(line);
        scene.add(group);
      }
    }

    // Ascesión recta
    function gridAscesionLines() {
      // 24 lineas de ascención recta de 0° a 360° de 15° en 15°
      const start1 = 0;
      const condition1 = 360;
      const step1 = 15;
      const start2 = -90;
      const condition2 = 90;

      const radio = 20;

      for (let i = start1; i <= condition1; i += step1) {
        const pi = Math.PI;
        const points = [];
        const angulosRectos = [0, 90, 180, 270, 360];

        if (angulosRectos.includes(i)) {
          for (let j = start2; j <= condition2; j++) {
            // aquí cambia con ascensión
            const ra = (i * pi) / 180;
            const dec = (j * pi) / 180;

            // forma cuatro y-up
            const x = radio * Math.cos(dec) * Math.cos(ra);
            const y = radio * Math.sin(dec);
            const z = radio * Math.cos(dec) * Math.sin(ra);
            // Para visualizar una por una
            // if ([0, 180].includes(i)) {
            //   // // console.log(x, y, z);
            //   points.push(new Vector3(x, y, z));
            // }
            points.push(new Vector3(x, y, z));
          }
        } else {
          // esto soluciona que las líneas no lleguen hasta -90° o 90
          for (let j = -70; j <= 70; j++) {
            // aquí cambia con ascensión
            const ra = (i * pi) / 180;
            const dec = (j * pi) / 180;

            // forma cuatro y-up
            const x = radio * Math.cos(dec) * Math.cos(ra);
            const y = radio * Math.sin(dec);
            const z = radio * Math.cos(dec) * Math.sin(ra);
            // Para visualizar una por una
            // if ([15, 30].includes(i)) {
            //   // console.log(x, y, z);
            //   points.push(new Vector3(x, y, z));
            // }
            points.push(new Vector3(x, y, z));
          }
        }

        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.6,
        });

        const line = new Line(geometry, material);

        line.updateMatrix();
        // scene.add(line);
        group.add(line);
        scene.add(group);
      }
    }

    function gridEcuatorialLines(coordinates) {
      if (coordinates === "declination") {
        gridDeclinationLines();
      } else {
        if (coordinates === "ascension") {
          gridAscesionLines();
        } else {
          gridDeclinationLines();
          gridAscesionLines();
        }
      }
    }

    // Líneas de Declinación (paralelos al ecuador celestial)
    // gridEcuatorialLines("declination");

    // Líneas de Ascensión Recta (meridianos que pasan por los polos)
    // gridEcuatorialLines("ascension");

    // Todas
    gridEcuatorialLines();

    // Etiquetas en líneas paraleas al ecuador
    const spriteMap = new TextureLoader().load("/favicon.ico");
    const spriteMaterial = new SpriteMaterial({ map: spriteMap });
    const radio = 20;
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
        sprite.position.set(x, y + 0.6, z);
        // sprite.position.set(6.82, 19.79, 0.47);
        if ([253, 270, 287].includes(ra)) {
          // scene.add(sprite);
          group.add(sprite);
          scene.add(group);
        }
      }
      // console.log("-", dec);
    }

    // const sphereRadius = 1;
    //   const widthSegments = 5;
    //   const heightSegments = 3;
    //   const geometry = new THREE.SphereGeometry(sphereRadius, widthSegments, heightSegments);

    // TODO: HUD/GUI
    // const gui = new GUI();

    // TODO: Instancias de esferas/estrellas
    // const sphereRadius = 1;
    //   const widthSegments = 5;
    //   const heightSegments = 3;
    //   const geometry = new THREE.SphereGeometry(sphereRadius, widthSegments, heightSegments);

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
      // camera.rotation.x += 0.0001;
      // camera.rotation.y += 0.0001;
      // cubes.forEach((cube, ndx) => {
      //   const speed = 1 + ndx * 0.1;
      //   const rot = time * speed;
      //   cube.rotation.x = rot;
      //   cube.rotation.y = rot;
      // });
      // cube.rotation.x = time;
      // cube.rotation.y = time;
      group.rotation.x += 0.001;
      group.rotation.y += 0.001;
    }

    // Resize
    window.addEventListener(
      "resize",
      () => onWindowResize(camera, renderer),
      false,
    );

    // animation
    function animate(time) {
      // console.log((time *= 0.001));
      // time *= 0.001; // convert time to seconds

      // requestAnimationFrame(render);
      // controls.update();
      orbit.update();

      rotarMesh();

      render();
      p.innerText = `x: ${camera.position.x}; y: ${camera.position.y}; z: ${camera.position.z}`;

      stats.update();
    }

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
  }

  // utils
  // function makeInstance(geometry, color, x) {
  // /**
  //  * Creates a material that describe the appereance of objects
  //  * @see https://threejs.org/docs/index.html#api/en/constants/Materials
  //  * @see https://threejs.org/manual/#en/materials
  //  */
  // const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  //   const material = new THREE.MeshPhongMaterial({ color });
  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);
  //   cube.position.x = x;
  //   return cube;
  // }
  // const cubes = [
  //   makeInstance(geometry, 0x44aa88, 0),
  //   makeInstance(geometry, 0x8844aa, -2),
  //   makeInstance(geometry, 0xaa8844, 2),
  // ];
  // /**
  //  * Creates a material that describe the appereance of objects
  //  * @see https://threejs.org/docs/index.html#api/en/constants/Materials
  //  * @see https://threejs.org/manual/#en/materials
  //  */
  // function crearInstancia(geometria, color, posicionX, scene) {
  //   const wireframe = true;
  //   const material = new THREE.MeshBasicMaterial({
  //     color,
  //     wireframe: wireframe,
  //   });
  //   // adds the geometry to the mesh and apply the material to it
  //   const esfera = new THREE.Mesh(geometria, material);
  //   scene.add(esfera);
  //   // scene.add( mesh );
  //   esfera.position.x = posicionX;
  //   return esfera;
  // }
  // function obtenerEsferas(scene, geometria) {
  //   let colorEsfera = new THREE.Color("#7833aa");
  //   let hexadecimal = colorEsfera.getHex();
  //   return [
  //     crearInstancia(geometria, hexadecimal, 0, scene),
  //     // crearInstancia( geometry, 0x8844aa, - 2 ),
  //     // crearInstancia( geometry, 0xaa8844, 2 ),
  //   ];
  // }
  // function obtenerGeometria(gui) {
  //   /**
  //    * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
  //    */
  //   const twoPi = Math.PI * 2;
  //   const props = {
  //     // radius: 1,
  //     // widthSegments: 8,
  //     // heightSegments: 8,
  //     radius: 24,
  //     widthSegments: 32,
  //     heightSegments: 32,
  //     phiStart: Math.PI * 2,
  //     thetaStart: 0,
  //     thetaLength: Math.PI,
  //   };

  //   // TODO: hacer que cambien los valores y se actualice la geometría
  //   const folder = gui.addFolder("THREE.SphereGeometry");
  //   folder.open();
  //   // folder.close();
  //   folder.add(props, "radius", 1, 30).step(1);
  //   folder.add(props, "widthSegments", 3, 64).step(1);
  //   folder.add(props, "heightSegments", 2, 32);
  //   // folder.add( props, 'phiStart', 0, twoPi ).onChange( generateGeometry );
  //   // folder.add( props, 'phiLength', 0, twoPi ).onChange( generateGeometry );
  //   // folder.add( props, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
  //   // folder.add( props, 'thetaLength', 0, twoPi ).onChange( generateGeometry );

  //   return new THREE.SphereGeometry(
  //     props.radius,
  //     props.widthSegments,
  //     props.heightSegments,
  //   );
  // }
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
export const exportCamera = () => {
  // console.log(camera);
  return camera;
};
