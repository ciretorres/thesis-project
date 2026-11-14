import WebGL from "three/addons/capabilities/WebGL.js";

/**
 * Comprueba si el navegador admite WebGL2 mediante el detector oficial
 * de Three.js.
 *
 * Debe ejecutarse antes de crear el renderizador.
 *
 * @returns {boolean} `true` si WebGL2 está disponible; de lo contrario, `false`.
 */
export function comprobarSoporteWebGL() {
  return WebGL.isWebGL2Available();
}
