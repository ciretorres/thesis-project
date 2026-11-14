/**
 * Estrellas añadidas manualmente porque no aparecen en el catálogo JSON.
 *
 * Los datos de Polaris (α Ursae Minoris) fueron aportados por el usuario
 * el 2026-10-21 y contrastados con las fórmulas de distancia y magnitud.
 * Polaris está a 132.275132 pc, fuera del límite de 10 pc del catálogo.
 *
 * El paralaje se deriva como `1000 / distancia`, ya que no se proporcionó
 * ese dato. La validación de campos del catálogo JSON no se aplica a estas
 * entradas.
 *
 * @type {Array<{
 *   hip: number,
 *   vmag: number,
 *   absmag: number,
 *   plx: number,
 *   distancia: number,
 *   ly: number,
 *   rahms: string,
 *   dedms: string,
 *   x: number,
 *   y: number,
 *   z: number
 * }>}
 */
export const ESTRELLAS_MANUALES = [
  {
    hip: 11767,
    vmag: 1.97,
    absmag: -3.637391,
    plx: 7.56,
    distancia: 132.275132,
    ly: 431.428307,
    rahms: "02 31 47.08",
    dedms: "+89 15 50.9",
    x: 1.3396481090837498,
    y: 1.0446215486735597,
    z: 132.2642231564061,
  },
];
