/**
 * Resize and update the size of render and camera aspect
 * @property {camera}:
 * @property {renderer}:
 * @param {Object} labelCSS2DRenderer: CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
 */
const onWindowResize = (camera, renderer, labelCSS2DRenderer) => {
  // let SCREEN_HEIGHT = window.innerHeight;
  // let SCREEN_WIDTH = window.innerWidth;
  // const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  // perspectiveCamera.aspect = aspect;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
  labelCSS2DRenderer.setSize(window.innerWidth, window.innerHeight);
};
export default onWindowResize;
