import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

/**
 * This renderer is a simplified version of CSS3DRenderer.
 * The only transformation that is supported is translation.
 * @returns {CSS2DRenderer} css2dRenderer
 * @see https://threejs.org/docs/#CSS2DRenderer
 */
const createCSS2DRenderer = () => {
  const css2dRenderer = new CSS2DRenderer();
  return css2dRenderer;
};

/**
 * Método para agregar el CSS2DRenderer al main del html
 * @param {String} mainId: con el id la etiqueta <main /> en el html
 * @returns {CSS2DRenderer} renderer: con el renderizador de Three.js
 */
const addCSS2DRenderer = (mainId) => {
  // selector html
  const mainid = document.querySelector(mainId);

  // crea CSS2DRenderer
  const renderer = createCSS2DRenderer();

  // methods
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // labelCSS2DRenderer.setCamera(camera);

  // properties
  renderer.domElement.id = "css2drendererid";
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.pointerEvents = "none";

  // append a la etiqueta main
  mainid.appendChild(renderer.domElement);

  return renderer;
};

export default addCSS2DRenderer;
