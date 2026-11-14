import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Crea controles de órbita con amortiguación alrededor de la nube de estrellas.
 *
 * La distancia mínima es de 0.5 unidades para permitir que la cámara se
 * acerque al centro. En la escala del proyecto (1 unidad = 0.1 pc), equivale
 * a 0.05 pc. La distancia máxima es de 300 unidades.
 *
 * @param {THREE.Camera} camara Cámara que controlarán los controles.
 * @param {HTMLElement} domElement Elemento del DOM asociado a los controles.
 * @returns {OrbitControls} Los controles de órbita configurados.
 * @see https://threejs.org/docs/#OrbitControls
 */
export function crearControles(camara, domElement) {
  const controles = new OrbitControls(camara, domElement);

  // Set to true to enable damping (inertia), which can be used to give a sense of weight to the controls. Note that if this is enabled, you must call update() in your animation loop. Default is false.
  controles.enableDamping = true;
  controles.dampingFactor = 0.05;
  controles.minDistance = 0.5;
  controles.maxDistance = 300;

  return controles;
}
