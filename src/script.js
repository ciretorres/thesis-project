// import * as THREE from "three";
import { AxesHelper, Group, Mesh } from "three";

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
let camera, controls, orbit, scene, renderer, stats, labelCSS2DRenderer;

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
    // camera.position.z = 5;
    camera.layers.enableAll();

    // STATS
    stats = newStats("#mainid");

    // RENDERER
    renderer = newRenderer(animate, "#mainid", "#canvasid");

    // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
    labelCSS2DRenderer = new CSS2DRenderer();
    labelCSS2DRenderer.setSize(window.innerWidth, window.innerHeight);
    // labelCSS2DRenderer.setCamera(camera);
    labelCSS2DRenderer.domElement.id = "labelcss2drendererid";
    labelCSS2DRenderer.domElement.style.position = "absolute";
    labelCSS2DRenderer.domElement.style.top = "0px";
    labelCSS2DRenderer.domElement.style.pointerEvents = "none";
    const mainid = document.querySelector("#mainid");
    mainid.appendChild(labelCSS2DRenderer.domElement);
    // document.body.appendChild(labelCSS2DRenderer.domElement);

    // CONTROLS
    orbit = newControls(camera, renderer.domElement);
    orbit.enableZoom = true;
    orbit.enableDamping = true;
    // const orbit = new OrbitControls(camera, labelCSS2DRenderer.domElement);
    // orbit.minDistance = 5;
    // orbit.maxDistance = 100;

    // LIGHTS
    newLights(scene);

    const axesHelper = new AxesHelper(5);
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    //--

    // IMPLEMENTACIÓN
    let group = new Group();
    group = implementacion(scene);
    scene.add(group);

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
      labelCSS2DRenderer.render(scene, camera);
    }

    // resize
    window.addEventListener(
      "resize",
      () => onWindowResize(camera, renderer, labelCSS2DRenderer),
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
