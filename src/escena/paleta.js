// Fallbacks = valores fase A: si el CSS no está, la escena no cambia.
const RESPALDOS = {
  "--negro": "#000000",
  "--resaltado": "#ff2b2b",
  "--reticula": "#2f6f9f",
};

/** @type {((valorDe: (nombre: string) => string) => void)[]} */
const APLICACIONES = [];

/**
 * Obtiene el valor de una propiedad CSS personalizada o su valor de respaldo.
 *
 * @param {string} nombre Nombre de la propiedad CSS.
 * @returns {string}
 */
function valorDe(nombre) {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(nombre)
      .trim() || RESPALDOS[nombre]
  );
}

/**
 * Aplica el valor actual al suscribirse y registra la función para aplicarlo
 * de nuevo cuando cambie la paleta.
 *
 * Nota: --negro es fijo en todos los perfiles → su actualización es un no-op de seguridad.
 *
 * @param {(valor: string) => void} aplicar Función que aplica el color.
 * @param {string} nombre Nombre de la propiedad CSS personalizada.
 */
export function suscribirColor(aplicar, nombre) {
  aplicar(valorDe(nombre)); // valor inicial, al construir
  APLICACIONES.push(() => aplicar(valorDe(nombre)));
}

/**
 * Vuelve a aplicar los valores actuales a todos los colores suscritos.
 */
export function aplicarPaleta() {
  APLICACIONES.forEach((aplicacion) => aplicacion(valorDe));
}
