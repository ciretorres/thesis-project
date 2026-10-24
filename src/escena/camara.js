import * as THREE from "three";

/**
 * Crea una cámara en el centro de la nube de estrellas, a una unidad del
 * origen, orientada inicialmente hacia el polo norte celeste (+Y).
 *
 * El vector `up` se establece antes de llamar a `lookAt` y antes de crear
 * los controles de órbita, para mantener la orientación celeste prevista.
 *
 * Los límites de distancia viven en controles.js (minDistance debe permitir radio 1).
 *
 * @param {number} aspect Relación entre el ancho y el alto de la vista.
 * @returns {THREE.PerspectiveCamera} La cámara configurada.
 * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
 */
export function crearCamara(aspect) {
  // fov: the vertical field of view.
  // aspect: this is the aspect ratio you use to create the horizontal field of view based off the vertical.
  // near: this is the nearest plane of view (where the camera's view begins) .
  // far: this is far plane of view (where the camera's view ends).
  const camara = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);

  camara.position.set(0, -1, 0);
  camara.up.set(1, 0, 0);
  camara.lookAt(0, 0, 0);

  return camara;
}
