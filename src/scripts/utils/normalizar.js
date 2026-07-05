/**
 * Método para normalizar la distancia estelar a la escala (1:10)
 * @param {Number} n : a normalizar
 * @returns {Number}
 */
const normalizar = (n) => {
  // Scale the stellar distance from 1 pársec to 100 pixels (1:100)
  return n * 10;
};

export default normalizar;
