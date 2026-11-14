import * as THREE from "three";

/**
 * Crea un ayudante visual que muestra los ejes de coordenadas.
 *
 * El eje X se representa en rojo, el Y en verde y el Z en azul.
 * En la escena, el eje Y indica la dirección del polo norte celeste.
 *
 * @returns {THREE.AxesHelper} El ayudante de ejes, con longitud 50 unidades.
 */
export function crearAxesHelper() {
  // return new THREE.AxesHelper(50);
  return new THREE.AxesHelper(5);
}
