// fetch
import fetchData from "./utils/fetch";

// axesHelper
import addAxesHelper from "./helpers/index.js";
// estadísticas
import addStats from "../components/stats";

// import * as THREE from "three";
import { Group } from "three";

// componentes
import camara from "../components/camara";
import escena from "../components/escena";
//
import addRenderer from "../components/renderer";
// CSS2DRenderer
import addCSS2DRenderer from "../components/renderer/css2drenderer.js";
//
import addControles from "../components/controls";
import addLuces from "../components/lights";

// Mesh / Sprite
import { createStars } from "../components/models/estrellas";
import createSphericalGrid from "../components/models/grid";

// events
import resize from "./events/resize.js";
// seleccionar estrella con click
import { selectStar } from "./events/select.js";
// mover cámara con teclado
import moverCamaraConTeclado from "./events/move.js";

// utils
import cameraFollowGrid from "./utils/follow.js";

console.log("hola desde /scripts/index.js");

// variables globales
let camera, lastCameraPosition;
let renderer, labelCSS2DRenderer;
let controls, orbit, scene, stats;
let data;

init();

// función de inicio
async function init() {
  // consultando datos
  data = await fetchData();
  // console.log("data", data);

  main();

  function main() {
    // STATS
    stats = addStats("#mainid");

    // setup

    // SCENE
    scene = escena;
    // CAMERA
    camera = camara;
    // RENDERER
    renderer = addRenderer(animate, "#mainid", "#canvasid");
    labelCSS2DRenderer = addCSS2DRenderer("#mainid"); // necesario para las etiquetas CSS2DObject

    // CONTROLS
    orbit = addControles(camera, renderer.domElement);
    // update must be called after any manual changes to the camera's transform
    orbit.update();

    // LIGHTS
    addLuces(scene);

    // HELPER
    addAxesHelper(scene);

    //--
    // IMPLEMENTACIÓN

    // Instancias o Sprites de estrellas
    const group = new Group();
    const starField = createStars({ data: data });
    group.add(starField);
    // Grid, Reticula Ecuatorial
    const groupReticula = new Group();
    const grid = createSphericalGrid({ radio: 1 });
    // variable para que el grid siga a la cámara
    lastCameraPosition = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    grid.position.set(0, 0, camera.position.z);
    groupReticula.add(grid);

    // Mesh y grupos para integrar a scene
    const groupScene = new Group();
    groupScene.add(group);
    groupScene.add(groupReticula);

    scene.add(groupScene);

    // RAYCASTER para selección de estrella o sprite
    selectStar(camera, group); // HOVER / CLICK

    moverCamaraConTeclado(camera);

    // render
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
      // // console.log((time *= 0.001));
      // // time *= 0.001; // convert time to seconds
      // // rotarXY(groupScene);
      // // cullingStarsVisibility
      // const cullingStars = updateCullingVisibility(camera, group);
      // // cullingGridVisibility
      // const cullingGrid = updateCullingVisibility(camera, grid);
      // // controls.update();
      // // required if controls.enableDamping or controls.autoRotate are set to true
      orbit.update();

      render();

      // // manda la posición de la cámara al html
      document.querySelector("#idx").innerText =
        `x: ${camera.position.x.toFixed(2)}`;
      document.querySelector("#idy").innerText =
        `y: ${camera.position.y.toFixed(2)}`;
      document.querySelector("#idz").innerText =
        `z: ${camera.position.z.toFixed(2)}`;

      stats.update();
    }
    // animate();
  }
}
