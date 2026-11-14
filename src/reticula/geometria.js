// Utilidades geométricas del retículo celeste: fuente única
// para la esfera (esferaCeleste.js) y sus etiquetas (etiquetas.js).

// Retícula celeste de coordenadas RA/Dec como esfera estática de fondo.
// Radio 500: con maxDistance 300 la cámara nunca la cruza y con
// camera.far = 2000 no se recorta.
export const RADIO = 500;

/**
 * Convierte un ángulo expresado en grados a radianes.
 *
 * @param {number} grados - Ángulo que se quiere convertir.
 * @returns {number} El ángulo equivalente en radianes.
 */
export const aRad = (grados) => {
  const radianes = (grados * Math.PI) / 180;
  return radianes;
};

/**
 * Convierte coordenadas astronómicas RA/Dec a coordenadas cartesianas de Three.js
 * y las escala al radio de la esfera celeste.
 *
 * Mapeo usado:
 * (cos δ · cos α, cos δ · sen α, sen δ) → three (X, Z, −Y):
 * three = (cos δ · cos α, sen δ, −cos δ · sen α).
 *
 * @param {number} alfa - Ascensión recta en radianes.
 * @param {number} delta - Declinación en radianes.
 * @param {number} radio - Radio al que se escala la posición.
 * @returns {[number, number, number]} Coordenadas [X, Y, Z] en Three.js.
 */
export function aCoordenadasThree(alfa, delta, radio = RADIO) {
  const x = radio * Math.cos(delta) * Math.cos(alfa);
  const y = radio * Math.sin(delta);
  const z = -radio * Math.cos(delta) * Math.sin(alfa); // signo negativo para conveniencia astronómina en Y-up

  return [x, y, z];
}

/**
 * Convierte un vector de Three.js a coordenadas ecuatoriales.
 *
 * Usa la convención de la retícula:
 * X = cos(dec)·cos(ra),
 * Y = sin(dec),
 * Z = −cos(dec)·sin(ra).
 *
 * @param {THREE.Vector3} vec - Vector en coordenadas de Three.js.
 * @returns {{ radius: number, ra: number, dec: number }}
 * Radio y ángulos en radianes.
 */
export const formulaSpehereToEcuatorial = (vec) => {
  const radius = vec.length();

  // const dec = Math.acos(vec.z / RADIO);
  // const ra = Math.atan(vec.y, vec.x);

  const dec = Math.asin(vec.y / radius);
  const ra = Math.atan2(-vec.z, vec.x);

  return { radius, ra, dec };
};
