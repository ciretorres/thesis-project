import { Vector3 } from "three";

// Método para convertir grados a radianes
const degreesToRadians = (degrees) => {
  const radians = degrees * (Math.PI / 180);
  return radians;
};

/**
 * Método para tranformar Coordenadas Ecuatoriales en Cartesianas
 * Tridimensionales (RA/Dec -> XYZ) en la forma Y-up
 * @property {Number} radius: el radio de la esfera
 * @property {Number} raDeg: la ascensión recta en grados
 * @property {Number} decDeg: la declinación en grados
 * @returns { Vector3 } con los valores de x, y, z
 */
const formulaRaDecToCartesian = (radius = 1, raDeg, decDeg) => {
  // Declinación en Radians
  const phi = degreesToRadians(decDeg);
  // Ascensión Recta en Radians
  const theta = degreesToRadians(raDeg);

  //       // forma uno z-up
  // const x = radius * Math.sin(phi) * Math.cos(theta);
  // const y = radius * Math.sin(phi) * Math.sin(theta);
  // const z = radius * Math.cos(phi);
  //       // forma dos y-up
  //       // const x = radio * Math.sin(lat) * Math.cos(lon);
  //       // const y = radio * Math.cos(lat);
  //       // const z = radio * Math.sin(lat) * Math.sin(lon);
  //       // forma tres x-up
  //       // const x = radio * Math.cos(lat);
  //       // const y = radio * Math.sin(lat) * Math.cos(lon);
  //       // const z = radio * Math.sin(lat) * Math.sin(lon);

  // +Y = polo norte celeste (Dec = +90°)
  // RA crece anti-horariamente al mirar desde +Y hacia el plano XZ
  const x = radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  // const z = -radius * Math.cos(phi) * Math.sin(theta); // signo negativo para conveniencia astronómina en Y-up

  // return { x, y, z };
  return new Vector3(x, y, z);
};

// formulaSphereToEcuatorial
// from Cartesian to Ecuatorial
const formulaSpehereToEcuatorial = (vec) => {
  const radius = vec.length();
  const dec = Math.acos(vec.z / radius);
  const ra = Math.atan(vec.y, vec.x);
  return { radius, ra, dec };
};

export { formulaRaDecToCartesian, formulaSpehereToEcuatorial };
