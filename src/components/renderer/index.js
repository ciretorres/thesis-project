import { WebGLRenderer } from "three";
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
const newRenderer = (mainId, canvasId) => {
  const mainid = document.querySelector(mainId);
  const canvas = document.querySelector(canvasId);

  const renderer = createWebGLRenderer(canvas);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
  mainid.appendChild(renderer.domElement);
  return renderer;
};

export default newRenderer;
