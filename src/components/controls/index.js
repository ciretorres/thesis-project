// módulo para rotar y zoom en la escena
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Método para crear un control de órbita
 * @param {Object} camera
 * @param {Object3DJSON} domElement
 * @returns {OrbitControls} orbitControls
 * @see https://threejs.org/docs/#OrbitControls
 */
const createControles = (camera, domElement) => {
  const orbitControls = new OrbitControls(camera, domElement);
  return orbitControls;
};

/**
 * Método para agregar un control de órbita a la cámara
 * @param {Object} camera : que va atomar el control
 * @param {Object} domElement : con el renderer en donde se va a mostrar la cámara
 * @returns {OrbitControls} controles
 */
const addControles = (camera, domElement) => {
  // crea los controles
  const controles = createControles(camera, domElement);

  // properties
  controles.enableZoom = true; // Enable or disable zooming (dollying) of the camera. Default is true.
  controles.enableDamping = true; // Set to true to enable damping (inertia), which can be used to give a sense of weight to the controls. Note that if this is enabled, you must call update() in your animation loop. Default is false.

  return controles;
};

export default addControles;
