import * as THREE from "three";
// import { color3d, registrarAplicacion } from '../escena/paleta.js';
import { aCoordenadasThree, aRad } from "./geometria.js";

const MERIDIANOS = 24; // AR fija, cada 15° (1 hora de AR)
const PASO_MERIDIANO = 5; // Separación de los segmentos en Declinación en grados
const PASO_PARALELO = 5; // Separación de los segmentos en Ascensión Recta en grados
const OPACIDAD_RETICULA = 0.65;

/**
 * Genera los segmentos de los meridianos de ascensión recta.
 *
 * Los meridianos cardinales llegan hasta los polos; los demás se detienen
 * en ±80° para mantener despejada la vista polar.
 *
 * @returns {number[]} Coordenadas XYZ de los extremos de los segmentos.
 */
function crearARLineas() {
  const vertices = [];

  // Líneas de longitud (ascensión recta)
  for (let m = 0; m < MERIDIANOS; m++) {
    const alfa = aRad(m * 15);
    // Los cardinales (0h, 6h, 12h y 18h → m % 6 === 0) llegan a los polos (±90°);
    // los demás se detienen o terminan en ±80° para mantener despejada la vista polar.
    const limite = m % 6 === 0 ? 90 : 80;

    // Añade los Meridianos
    for (let dec = -limite; dec < limite; dec += PASO_MERIDIANO) {
      const inicio = aCoordenadasThree(alfa, aRad(dec));
      const fin = aCoordenadasThree(alfa, aRad(dec + PASO_MERIDIANO));

      // Cada par de puntos define un segmento independiente.
      vertices.push(...inicio, ...fin);
    }
  }

  return vertices;
}

/**
 * Genera los segmentos de los paralelos de declinación.
 *
 * Crea círculos desde −80° hasta +80°, incluido el ecuador (0°), y los recorre
 * en tramos de ascensión recta de `PASO_PARALELO` (17 círculos en total).
 *
 * @returns {number[]} Coordenadas XYZ de los extremos de los segmentos.
 */
function crearDecLineas() {
  const vertices = [];

  // Añade los Paralelos (latitud)
  for (let dec = -80; dec <= 80; dec += 10) {
    const delta = aRad(dec);

    // Recorre la ascensión recta en tramos de 5° y cierra cada círculo.
    for (let alfa = 0; alfa < 360; alfa += PASO_PARALELO) {
      const inicio = aCoordenadasThree(aRad(alfa), delta);
      const fin = aCoordenadasThree(aRad(alfa + PASO_PARALELO), delta);

      // Cada par de puntos define un segmento independiente.
      vertices.push(...inicio, ...fin);
    }
  }

  return vertices;
}

/**
 * Crea una retícula celeste de meridianos y paralelos como segmentos
 * discontinuos sobre una esfera estática.
 *
 * Los meridianos corresponden a ascensión recta fija; los paralelos,
 * a declinación fija.
 *
 * @returns {THREE.LineSegments} Retícula lista para añadir a una escena.
 */
export function crearEsferaCeleste() {
  const vertices = [];

  // Calcula las coordenadas
  const meridianos = crearARLineas();
  const paralelos = crearDecLineas();

  vertices.push(...meridianos);
  vertices.push(...paralelos);

  const geometria = new THREE.BufferGeometry();

  // Registra las posiciones de los extremos de todos los segmentos.
  geometria.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  );

  // Usa guiones o mtaerial punteado (dashSize 1.5 u, hueco 4.5 u) para dar a la retícula un aspecto discontinuo.
  // El color se recolorea en vivo vía registrarAplicacion (sin tocar opacity)
  const material = new THREE.LineDashedMaterial({
    // color: color3d('--reticula'),
    color: "#9f3a2f",
    transparent: true,
    opacity: OPACIDAD_RETICULA,
    depthWrite: false,
    dashSize: 1.5,
    gapSize: 4.5,
  });

  // La actualización dinámica del color puede registrarse aquí, si se usa
  // el sistema de paleta de la aplicación.
  // registrarAplicacion((valorDe) => material.color.set(valorDe('--reticula')));

  const lineas = new THREE.LineSegments(geometria, material);

  // Calcula las distancias necesarias para que el material dibuje los guiones.
  lineas.computeLineDistances();

  return lineas;
}
