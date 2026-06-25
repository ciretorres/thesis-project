// import * as THREE from "three";
import {
  AxesHelper,
  Camera,
  Color,
  Frustum,
  Group,
  Matrix4,
  Sprite,
} from "three";

// componentes
import addCamara from "./components/camara";
import addControls from "./components/controls";
import addEscena from "./components/escena";
import addLights from "./components/lights";
import addRenderer from "./components/renderer";
import addStats from "./components/stats";

// Mesh
import { createStars } from "./components/models/estrellas";
import createSphericalGrid from "./components/models/grid.js";

// utils
import selectStar from "./components/controls/select.js";
import addCSS2DRenderer from "./components/renderer/css2drenderer.js";
import onWindowResize from "./utils/resize.js";
import rotarObject3D from "./utils/rotarObject3d.js";

// variables globales
let camera, controls, orbit, scene, renderer, stats, labelCSS2DRenderer;

init();

// función de inicio
function init() {
  // setup
  // selector html tags
  const p = document.querySelector("#pid");

  main();

  // función principal
  function main() {
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
    orbit = addControls(camera, renderer.domElement);
    // controls.update() must be called after any manual changes to the camera's transform
    orbit.update();

    // LIGHTS
    addLights(scene);

    const axesHelper = new AxesHelper(5);
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    //--

    // IMPLEMENTACIÓN

    // Instancias o Sprites de estrellas
    const group = new Group();
    const starField = createStars({ numStars: 500 });
    group.add(starField);

    // Grid, Reticula Ecuatorial
    const group2 = new Group();
    const grid = createSphericalGrid({
      radio: 1,
      color: new Color("#ff0000"),
    });
    group2.add(grid);

    // Mesh y grupos para integrar a scene
    const group3 = new Group();
    group3.add(group);
    group3.add(group2);
    scene.add(group3);

    // RAYCASTER
    selectStar(camera, group); // HOVER / CLICK

    /**
     * Método para actualizar el culling basado en la visibilidad utilizando el frustum de la cámara
     * @param {Camera} camera
     * @param {Sprite} sprites
     * @returns {Array}
     * @see https://threejs.org/docs/#Frustum
     */
    const updateCullingVisibility = (camera, sprites) => {
      // Culling personalizado
      // Actualizar la matriz de la cámara para asegurar que los cálculos sean correctos
      camera.updateMatrixWorld();

      // Obtener objetos visibles en el frustum
      const frustum = new Frustum();

      // Obtener la matriz de corte (frustum) a partir de la perspectiva actual de la cámara
      frustum.setFromProjectionMatrix(
        new Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );

      // almacena los sprites visibles
      const visiblesSprites = [];

      // Verifica cada sprite contra el frustum
      sprites.children.forEach((star) => {
        const isVisible = frustum.containsPoint(star.position);
        // Verificar si la estrella está dentro del frustum de la cámara
        if (isVisible) {
          star.visible = true; // Establece visible o no según el resultado
          visiblesSprites.push(star);
        } else {
          star.visible = false;
        }
      });
      return visiblesSprites;
    };

    // render
    function render() {
      // window.requestAnimationFrame(animate);
      window.requestAnimationFrame(render);

      // updateCullingStarsVisibility
      // const culling = updateCullingVisibility(camera, group);
      // console.log(culling.length);

      // renderiza la escena con la cámara
      renderer.render(scene, camera);

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

      // group.rotation.x += 0.005;
      // group.rotation.y += 0.005;
      rotarObject3D(group3);

      // updateCullingStarsVisibility
      const culling = updateCullingVisibility(camera, group);
      // console.log(culling.length);

      // controls.update();
      // required if controls.enableDamping or controls.autoRotate are set to true
      orbit.update();

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
