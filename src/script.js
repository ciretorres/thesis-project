// import * as THREE from "three";
import { Mesh, MeshBasicMaterial } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// componentes
import camara from "./components/camara";
import newControls from "./components/controls";
import escena from "./components/escena";
import newLights from "./components/lights";
import implementacion from "./components/models/index.js";
import newRenderer from "./components/renderer";
import newStats from "./components/stats";

// utils
import onWindowResize from "./utils/resize.js";

// variables globales
let camera, controls, orbit, scene, renderer, stats;

init();

// función de inicio
function init() {
  // setup
  // selector html tags
  const p = document.querySelector("#pid");

  function rotarMesh(object = new Mesh(), value = 0.001) {
    // // mesh.rotation.x += 0.001;
    // // mesh.rotation.y += 0.001;
    // //
    object.rotation.x += value;
    object.rotation.y += value;
    //
    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * 0.1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });
  }

  main();

  function main() {
    // SCENE
    scene = escena();
    // scene.background = new Color("#302a73");

    // CAMERA
    camera = camara();
    // camera.position.z = 1;
    camera.position.z = 80;
    // camera.position.y = 0;
    // camera.position.x = 0;
    // sc.add(camera);

    // STATS
    stats = newStats("#mainid");

    // RENDERER
    renderer = newRenderer(animate, "#mainid", "#canvasid");

    // CONTROLS
    orbit = newControls(camera, renderer);
    orbit.enableDamping = true;

    // LIGHTS
    newLights(scene);

    // Ejemplo de texto
    let fontLoader = new FontLoader();
    fontLoader.load("helvetiker_regular.typeface.json", (font) => {
      let textG = new TextGeometry("Hellow orld", {
        font: font,
        size: 1,
        depth: 0,
        curveSegments: 12,
      });
      textG.center();
      let materialt = new MeshBasicMaterial({ color: "white" });
      let mesht = new Mesh(textG, materialt);
      mesht.position.set(0, 0, -10);
      scene.add(mesht);
    });

    //--

    // Implementación
    // const group = new Group();
    const group = implementacion(scene);

    // Mesh para integrar a scene

    //--

    // render
    function render() {
      requestAnimationFrame(render);
      // group.rotation.x += 0.005;
      // group.rotation.y += 0.005;
      renderer.render(scene, camera);
      // window.requestAnimationFrame(animate);
    }

    // resize
    window.addEventListener(
      "resize",
      () => onWindowResize(camera, renderer),
      false,
    );

    // animation
    function animate(time) {
      // console.log((time *= 0.001));
      // time *= 0.001; // convert time to seconds
      // controls.update();
      orbit.update();

      rotarMesh(group);

      render();

      p.innerText = `x: ${camera.position.x}; y: ${camera.position.y}; z: ${camera.position.z}`;

      stats.update();
    }
    // animate();
  }
}

// exports
export const exportCamera = () => {
  // console.log(camera);
  return camera;
};
