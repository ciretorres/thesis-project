import * as THREE from "three";

/**
 * Factor de escala de la escena: 1 parsec equivale a 10 unidades de Three.js.
 * Multiplica las coordenadas para que las estrellas ocupen un volumen visible.
 *
 * @type {number}
 */
export const ESCALA = 10;

// Rango de magnitud aparente del catálogo (verificado: -1.44 a 12.48).
const VMAG_MIN = -1.44;
const VMAG_MAX = 12.48;

/**
 * Convierte coordenadas astronómicas al sistema de coordenadas de Three.js.
 * El mapeo es diestro y transforma `(x, y, z)` en `(x, z, -y)`.
 *
 * @param {number} x Coordenada astronómica X, en parsecs.
 * @param {number} y Coordenada astronómica Y, en parsecs.
 * @param {number} z Coordenada astronómica Z, en parsecs.
 * @param {number} [escala=ESCALA] Factor de escala de la escena.
 * @returns {[number, number, number]} Coordenadas transformadas `(x, y, z)`.
 */
export function aCoordenadasThree(x, y, z, escala = ESCALA) {
  return [x * escala, z * escala, -y * escala];
}

/**
 * Calcula el color de una estrella a partir de su magnitud aparente.
 * Las magnitudes bajas se representan en tonos más claros; las altas,
 * en tonos azul-gris más apagados. Los valores fuera del rango del catálogo
 * se limitan a los extremos de la paleta.
 *
 * Vmag baja → blanco brillante; Vmag alta → azul-gris apagado.
 *
 * @param {number} vmag Magnitud aparente de la estrella.
 * @returns {THREE.Color} Color HSL convertido a RGB.
 */
export function colorPorVmag(vmag) {
  const t = THREE.MathUtils.clamp(
    (vmag - VMAG_MIN) / (VMAG_MAX - VMAG_MIN),
    0,
    1,
  );
  const color = new THREE.Color();
  color.setHSL(0.6, 0.35 * t, 1 - 0.65 * t);
  return color;
}

/**
 * Crea una nube de puntos de Three.js a partir de los datos de estrellas.
 * Cada punto recibe una posición transformada y un color calculado según
 * su magnitud aparente.
 *
 * @param {Array<{x: number, y: number, z: number, vmag: number}>} datos
 *   Estrellas con coordenadas y magnitud aparente.
 * @returns {THREE.Points} Nube de puntos con colores por vértice.
 */
export function crearCampoEstrellas(datos) {
  const posiciones = new Float32Array(datos.length * 3);
  const colores = new Float32Array(datos.length * 3);

  datos.forEach((estrella, i) => {
    // escala distancia
    posiciones.set(
      aCoordenadasThree(estrella.x, estrella.y, estrella.z),
      i * 3,
    );

    const color = colorPorVmag(estrella.vmag);
    colores.set([color.r, color.g, color.b], i * 3);
  });

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
  geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));

  const material = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    vertexColors: true,
  });

  return new THREE.Points(geometria, material);
}
