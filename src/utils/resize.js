/**
 * Resize and update the size of render and camera aspect
 * @property {camera}:
 * * @property {renderer}:
 */
const onWindowResize = (camera, renderer) => {
  // let SCREEN_HEIGHT = window.innerHeight;
  // let SCREEN_WIDTH = window.innerWidth;
  // const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  // perspectiveCamera.aspect = aspect;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setSize(window.innerWidth, window.innerHeight);
};
export default onWindowResize;
