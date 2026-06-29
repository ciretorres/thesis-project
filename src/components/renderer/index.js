import { WebGLRenderer } from "three";
import checaWebGLCompatibilidad from "../../utils/warning.js";

/**
 * Renders a view that contains your camera's "picture"
 * @property {canvas} canvas:  in which will render the scene and camera.
 * @property {Boolean} alpha: controls the default clear alpha value. When set totrue, the value is 0. Otherwise it's 1. Default is false.
 * @property {Boolean} antialias: whether to use the default MSAA or not. Default is false.
 * @return {WebGLRenderer} webglRenderer
 * @see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
 */
const createWebGLRenderer = (canvas, alpha = false, antialias = true) => {
  const webglRenderer =
    canvas === undefined
      ? new WebGLRenderer({
          alpha,
          antialias,
        })
      : new WebGLRenderer({
          canvas,
          alpha,
          antialias,
        });

  return webglRenderer;
};

/**
 * Método para agregar el canvas al renderer y configurarlo
 * @param {Function} animate: función donde se mandar a llamar el renderer.render(scene, camera) y requestAnimationFrame(render)
 * @param {String} mainId: con el id la etiqueta <main /> en el html
 * @param {String} canvasId: con el id de la etiqueta <canvas /> en el html
 * @returns {WebGLRenderer} renderer: con el renderizador de Three.js
 */
const addRenderer = (animate, mainId, canvasId) => {
  // selector html
  const mainid = document.querySelector(mainId);
  const canvas = document.querySelector(canvasId);

  // crea WebGlRenderer
  const renderer = createWebGLRenderer(canvas);

  // properties
  renderer.domElement.id = "rendererid";

  // methods
  // renderer.setPixelRatio(window.devicePixelRatio); // Sets the given pixel ratio and resizes the canvas if necessary.
  renderer.setSize(window.innerWidth, window.innerHeight); // Resizes the output canvas to (width, height) with device pixel ratio taken into account, and also sets the viewport to fit that size, starting in (0, 0). Setting updateStyle to false prevents any style changes to the output canvas.

  // append a la etiqueta main
  // document.body.appendChild(renderer.domElement);
  mainid.appendChild(renderer.domElement);

  //  Advertir si el navegador es compatible con WebGL
  checaWebGLCompatibilidad(renderer, animate, mainId, canvasId);

  return renderer;
};

export default addRenderer;
