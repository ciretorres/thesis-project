// import * as THREE from "three";
import { AxesHelper, Mesh } from "three";

// componentes
import camara from "./components/camara";
import newControls from "./components/controls";
import escena from "./components/escena";
import newLights from "./components/lights";
import implementacion from "./components/models/index.js";
import newRenderer from "./components/renderer";
import newStats from "./components/stats";

// utils
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import onWindowResize from "./utils/resize.js";

// variables globales
let camera, controls, orbit, scene, renderer, stats, labelRenderer;

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
    camera.position.z = 1;
    // camera.position.z = 80;
    // camera.position.z = 35;
    camera.layers.enableAll();

    // STATS
    stats = newStats("#mainid");

    // RENDERER
    renderer = newRenderer(animate, "#mainid", "#canvasid");

    // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.id = "labelrendererid";
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.pointerEvents = "none";
    const mainid = document.querySelector("#mainid");
    mainid.appendChild(labelRenderer.domElement);
    // document.body.appendChild(labelRenderer.domElement);

    // CONTROLS
    orbit = newControls(camera, renderer.domElement);
    orbit.enableZoom = true;
    orbit.enableDamping = true;
    // const orbit = new OrbitControls(camera, labelRenderer.domElement);
    // orbit.minDistance = 5;
    // orbit.maxDistance = 100;

    // LIGHTS
    newLights(scene);

    const axesHelper = new AxesHelper(5);
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    //--

    // IMPLEMENTACIÓN
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

      // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
      labelRenderer.render(scene, camera);
    }

    // resize
    window.addEventListener(
      "resize",
      () => onWindowResize(camera, renderer, labelRenderer),
      false,
    );

    // animation
    function animate(time) {
      // console.log((time *= 0.001));
      // time *= 0.001; // convert time to seconds
      // controls.update();
      orbit.update();

      // rotarMesh(group);

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
