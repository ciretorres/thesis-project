import { PerspectiveCamera } from "three";
/**
 * Adds a camera
 * A perspective view that simulates the behaviour of a film camera in real life
 * @property {fov}: the vertical field of view.
 * @property {aspect}: this is the aspect ratio you use to create the horizontal field of view based off the vertical.
 * @property {near}: this is the nearest plane of view (where the camera's view begins) .
 * @property {far}: this is far plane of view (where the camera's view ends).
 * new PerspectiveCamera(fov, aspect, near, far)
 * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
 */
const createPerspectiveCamera = (
  fov = 75,
  aspect = window.innerWidth / window.innerHeight,
  near = 1,
  far = 1000,
) => {
  let perspectiveCamera = new PerspectiveCamera(fov, aspect, near, far);
  return perspectiveCamera;
};

let size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camara = () => {
  const camera = createPerspectiveCamera(35);
  camera.near = 0.1;
  // camera.far = 500;
  // // console.log(camera.position.y);
  // // camera.position.z = 1;
  // // camera.position.z = 40;
  // scene.add(camera);
  return camera;
};

export default camara;
