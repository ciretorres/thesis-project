import { PerspectiveCamera } from "three";

/**
 * A perspective view that simulates the behaviour of a film camera in real life
 * @property {Number} fov: the vertical field of view.
 * @property {Number} aspect: this is the aspect ratio you use to create the horizontal field of view based off the vertical.
 * @property {Number} near: this is the nearest plane of view (where the camera's view begins) .
 * @property {Number} far: this is far plane of view (where the camera's view ends).
 * @returns {PerspectiveCamera} perspectiveCamera
 * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
 */
const createPerspectiveCamara = (
  fov = 50,
  aspect = 1,
  near = 1,
  far = 2000,
) => {
  const perspectiveCamera = new PerspectiveCamera(fov, aspect, near, far);
  return perspectiveCamera;
};

// var
let size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Agrega una cámara en perspectiva
 * @returns {PerspectiveCamera} camera
 */
const addCamara = () => {
  // const fov = 75; //
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;

  // crea cámara
  const camera = createPerspectiveCamara(35, aspect, near, far);

  // properties
  camera.position.z = -1;
  // camera.position.z = 40;
  // camera.position.z = 80;
  // camera.position.z = 5;
  camera.layers.enableAll();

  return camera;
};

export default addCamara;
