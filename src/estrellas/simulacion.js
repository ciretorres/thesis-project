// Simulación en tiempo real de la estrella seleccionada.
import { aCoordenadasThree, colorPorVmag } from "./estrellas.js";
import {
  distanciaDesdeMagnitudes,
  LY_POR_PC,
  magnitudAparente,
} from "./magnitudes.js";

// Rango de distancia editable en pc (regla de mutación, no de UI).
const DISTANCIA_MIN = 0.1;
const DISTANCIA_MAX = 40;

/**
 * Crea una simulación que modifica los datos y la geometría de una estrella.
 *
 * Al cambiar la distancia o la magnitud aparente, actualiza su posición y color
 * en el campo estelar y notifica a las funciones de refresco opcionales.
 *
 * @param {Object} opciones
 * @param {THREE.Points} opciones.campoEstrellas Campo cuya geometría se actualiza.
 * @param {Array<Object>} opciones.datos Datos de las estrellas. Cada elemento
 *   debe incluir `x`, `y`, `z`, `absmag`, `distancia`, `vmag` y `ly`.
 * @param {(estrella: Object) => void} [opciones.alRefrescar]
 *   Función llamada con los datos actualizados de la estrella.
 * @param {(indice: number) => void} [opciones.alMoverResaltado]
 *   Función llamada para actualizar el resaltado de la estrella.
 * @returns {{ aplicar: (indice: number, cambio: Cambio) => void }}
 */
export function crearSimulacion({
  campoEstrellas,
  datos,
  alRefrescar,
  alMoverResaltado,
}) {
  /**
   * Aplica un cambio de distancia o magnitud a una estrella.
   *
   * Los valores de distancia se limitan al rango de 0.1 a 40 pc.
   * Los cambios inválidos o los índices inexistentes no modifican la escena.
   *
   * @param {number} indice Índice de la estrella en `datos` y en la geometría.
   * @param {Cambio} cambio Tipo de cambio y variación que se aplicará.
   */
  function aplicar(indice, cambio) {
    const estrella = datos[indice];
    if (!estrella) return;

    if (cambio.tipo === "distancia") {
      const distancia = Math.min(
        DISTANCIA_MAX,
        Math.max(DISTANCIA_MIN, estrella.distancia + cambio.delta),
      );

      estrella.distancia = distancia;
      estrella.vmag = magnitudAparente(estrella.absmag, distancia);
      estrella.ly = distancia * LY_POR_PC;
    } else if (cambio.tipo === "vmag") {
      const vmagPropuesto = estrella.vmag + cambio.delta;
      const distanciaPropuesta = distanciaDesdeMagnitudes(
        vmagPropuesto,
        estrella.absmag,
      );
      const distancia = Math.min(
        DISTANCIA_MAX,
        Math.max(DISTANCIA_MIN, distanciaPropuesta),
      );

      // Si la distancia se limita, recalcula vmag para mantener la relación
      // entre magnitud absoluta, magnitud aparente y distancia.
      estrella.vmag =
        distancia !== distanciaPropuesta
          ? magnitudAparente(estrella.absmag, distancia) // clamp cortó: frontera exacta
          : vmagPropuesto; // no cortó: m' directo, sin drift

      estrella.distancia = distancia;
      estrella.ly = distancia * LY_POR_PC; // ly SIEMPRE de d' ya acotado
    } else {
      return;
    }

    // Conserva la dirección original (x, y, z) de la estrella y actualiza su posición.
    const norma = Math.hypot(estrella.x, estrella.y, estrella.z);
    const direccion =
      norma > 0
        ? [estrella.x / norma, estrella.y / norma, estrella.z / norma]
        : [0, 0, 0];

    const [px, py, pz] = aCoordenadasThree(
      direccion[0] * estrella.distancia,
      direccion[1] * estrella.distancia,
      direccion[2] * estrella.distancia,
    );

    // Actualiza la posición de la estrella.
    const posicion = campoEstrellas.geometry.getAttribute("position");
    posicion.setXYZ(indice, px, py, pz);
    posicion.needsUpdate = true;

    // Actualiza solo el color del punto modificado.
    const color = colorPorVmag(estrella.vmag);
    const colores = campoEstrellas.geometry.getAttribute("color");
    colores.setXYZ(indice, color.r, color.g, color.b);
    colores.needsUpdate = true;

    // La distancia puede cambiar los límites de la geometría.
    campoEstrellas.geometry.computeBoundingSphere();

    // El punto ámbar de resaltado sigue a la estrella si está visible;
    // el inspector re-renderiza sus filas con los valores nuevos.
    if (typeof alMoverResaltado === "function") alMoverResaltado(indice);
    if (typeof alRefrescar === "function") alRefrescar(estrella);
  }

  return { aplicar };
}
