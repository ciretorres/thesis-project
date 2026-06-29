// import * as THREE from "three";
import { Color, Group } from "three";

// componentes
import addCamara from "./components/camara";
import addControles from "./components/controls";
import addEscena from "./components/escena";
import addLuces from "./components/lights";
import addRenderer from "./components/renderer";
import addStats from "./components/stats";

// Mesh
import { createStars } from "./components/models/estrellas";
import createSphericalGrid from "./components/models/grid.js";

// utils
import addCSS2DRenderer from "./components/renderer/css2drenderer.js";
import updateCullingVisibility from "./utils/culling.js";
import resize from "./utils/events/resize.js";
import selectStar from "./utils/events/select.js";
import fetchData from "./utils/fetch.js";
import cameraFollowGrid from "./utils/follow.js";
import addHelper from "./utils/helper/index.js";
import rotarXY from "./utils/rotarXY.js";

// variables globales
let camera, lastCameraPosition;
let renderer, labelCSS2DRenderer;
let controls, orbit, scene, stats;
let data;

init();

// función de inicio
async function init() {
  // selector html tags
  const px = document.querySelector("#idx");
  const py = document.querySelector("#idy");
  const pz = document.querySelector("#idz");
  // consultando datos
  data = await fetchData();

  main();

  // función principal
  function main() {
    // setup
    // SCENE
    scene = addEscena();

    // CAMERA
    camera = addCamara();

    // STATS
    stats = addStats("#mainid");

    // RENDERER
    renderer = addRenderer(animate, "#mainid", "#canvasid");

    // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
    labelCSS2DRenderer = addCSS2DRenderer("#mainid");

    // CONTROLS
    orbit = addControles(camera, renderer.domElement);
    // update must be called after any manual changes to the camera's transform
    orbit.update();

    // LIGHTS
    addLuces(scene);

    // HELPER
    addHelper(scene);

    //--

    // IMPLEMENTACIÓN

    // Instancias o Sprites de estrellas
    const group = new Group();
    const starField = createStars({ data: data });
    // const starField = createStars({ numStars: 1 });
    // const starField = createStars({ numStars: 182 });
    // const starField = createStars({ numStars: 22982 });
    // const starField = createStars({ numStars: 107380 });
    // const starField = createStars({ numStars: 500 });
    group.add(starField);

    // Grid, Reticula Ecuatorial
    const group2 = new Group();
    const grid = createSphericalGrid({
      radio: 1,
      color: new Color("#ff0000"),
    });
    lastCameraPosition = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    grid.position.set(0, 0, camera.position.z);
    group2.add(grid);

    // Mesh y grupos para integrar a scene
    const group3 = new Group();
    group3.add(group);
    group3.add(group2);
    scene.add(group3);

    // RAYCASTER
    selectStar(camera, group); // HOVER / CLICK

    function render() {
      // window.requestAnimationFrame(animate);
      window.requestAnimationFrame(render);

      // updateCullingStarsVisibility
      // const culling = updateCullingVisibility(camera, group);
      // console.log(culling.length);

      // Actualizar la posición del grid para que siga a la cámara
      lastCameraPosition = cameraFollowGrid(lastCameraPosition, camera, grid);

      // renderiza la escena con la cámara
      renderer.render(scene, camera);

      // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
      labelCSS2DRenderer.render(scene, camera);
    }

    // resize
    resize(camera, renderer, labelCSS2DRenderer);

    // animation
    function animate(time) {
      // console.log((time *= 0.001));
      // time *= 0.001; // convert time to seconds

      // group.rotation.x += 0.005;
      // group.rotation.y += 0.005;
      // rotarXY(group3);
      // rotarXY(group);
      rotarXY();

      // cullingStarsVisibility
      const cullingStars = updateCullingVisibility(camera, group);
      // cullingGridVisibility
      const cullingGrid = updateCullingVisibility(camera, grid);

      // controls.update();
      // required if controls.enableDamping or controls.autoRotate are set to true
      orbit.update();

      render();

      // manda la posición de la cámara al html
      px.innerText = `x: ${camera.position.x.toFixed(2)}`;
      py.innerText = `y: ${camera.position.y.toFixed(2)}`;
      pz.innerText = `z: ${camera.position.z.toFixed(2)}`;

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
