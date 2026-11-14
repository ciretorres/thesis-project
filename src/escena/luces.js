import * as THREE from "three";

/**
 * Crea una luz ambiental.
 *
 * @param {Color | number} [color=0x404040] Color de la luz.
 * @param {number} [intensity=1] Intensidad de la luz.
 * @returns {AmbientLight} La luz ambiental creada.
 * @see https://threejs.org/docs/#AmbientLight
 */
const crearAmbientLight = (color = 0x404040, intensity = 1) => {
  const ambiente = new THREE.AmbientLight(color, intensity);

  return ambiente;
};

/**
 * Crea una luz direccional.
 *
 * @param {Color | number} [color=0xffffff] Color de la luz.
 * @param {number} [intensity=0.5] Intensidad de la luz.
 * @returns {DirectionalLight} La luz direccional creada.
 * @see https://threejs.org/docs/#DirectionalLight
 */
const crearDireccionalLight = (color = 0xffffff, intensity = 0.5) => {
  const dirrecional = new THREE.DirectionalLight(color, intensity);

  return dirrecional;
};

/**
 * Añade iluminación ambiental y direccional a la escena.
 *
 * La luz direccional se coloca en la posición `(1, 1, 1)`.
 *
 * @param {THREE.Scene} escena Escena a la que se añadirán las luces.
 */
export function agregarLuces(escena) {
  // const color = new THREE.Color(0x404040); // soft white light
  // const color = new THREE.Color(0x555555);
  // const color = new THREE.Color(0x002288);
  const color = new THREE.Color(0xffffff);
  const intensity = 1;

  // crea luz ambiente
  const ambiente = crearAmbientLight(color, 0.6);

  // crea luz direccional
  const direccional = crearDireccionalLight(color, intensity);
  direccional.position.set(1, 1, 1);

  escena.add(ambiente, direccional);
}
