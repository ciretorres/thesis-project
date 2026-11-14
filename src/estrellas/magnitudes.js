// Módulo puro de magnitudes y distancias (sin DOM ni three).
// `absmag` del catálogo es el invariante: nunca se calcula ni se muta.

/**
 * Factor de conversión de parsecs a años luz.
 * (constante IAU; consistente con la razón Ly/Pc del catálogo: 4.2230626805 / 1.294783318 ≈ 3.26156).
 * @type {number}
 */
export const LY_POR_PC = 3.2615637769;

/**
 * Calcula la magnitud aparente a partir de la magnitud absoluta y la distancia en pársecs.
 *
 * Usa la fórmula `m = M + 5 · log10(d) − 5`.
 *
 * @param {number} absMag Magnitud absoluta.
 * @param {number} pc Distancia en parsecs; debe ser mayor que cero.
 * @returns {number} Magnitud aparente.
 */
export function magnitudAparente(absMag, pc) {
  return absMag + 5 * Math.log10(pc) - 5;
}

/**
 * Calcula la distancia en pársecs a partir de las magnitudes aparente y absoluta.
 *
 * Usa la fórmula `d = 10^((m − M + 5) / 5)`.
 * Es la operación inversa de {@link magnitudAparente}.
 *
 * @param {number} vmag Magnitud aparente.
 * @param {number} absMag Magnitud absoluta.
 * @returns {number} Distancia en pársecs.
 */
export function distanciaDesdeMagnitudes(vmag, absMag) {
  return 10 ** ((vmag - absMag + 5) / 5);
}
