// módulo para rotar y zoom en la escena
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Método para crear un control de órbita
 * @param {Object} camera
 * @param {Object3DJSON} domElement
 * @returns orbitControls
 * @see https://threejs.org/docs/#OrbitControls
 */
const createControls = (camera, domElement) => {
  const orbitControls = new OrbitControls(camera, domElement);
  return orbitControls;
};

/**
 * Método para agregar un control de órbita a la cámara
 * @param {Object} camera : que va atomar el control
 * @param {Object} domElement : con el renderer en donde se va a mostrar la cámara
 * @returns controls
 */
const addControls = (camera, domElement) => {
  // crea los controles
  const controls = createControls(camera, domElement);

  // properties
  controls.enableZoom = true; // Enable or disable zooming (dollying) of the camera. Default is true.
  controls.enableDamping = true; // Set to true to enable damping (inertia), which can be used to give a sense of weight to the controls. Note that if this is enabled, you must call update() in your animation loop. Default is false.

  return controls;
};

export default addControls;
