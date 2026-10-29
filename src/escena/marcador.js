import * as THREE from "three";
// import { color3d, registrarAplicacion } from './paleta.js';

/**
 * Crea una textura transparente con forma de anillo.
 *
 * El color blanco de la textura permite que el material aplique su propio
 * color mediante `material.color`, por lo que puede cambiarse en vivo.
 *
 * @returns {THREE.CanvasTexture} Textura del anillo.
 */
function crearTexturaAnillo() {
  const TAMANO = 128;
  const RADIO = 54; // px; con el grosor (±7) aún cabe en el lienzo.
  const GROSOR = 14; // px

  const lienzo = document.createElement("canvas");
  lienzo.width = TAMANO;
  lienzo.height = TAMANO;
  const contexto = lienzo.getContext("2d");
  contexto.strokeStyle = "#ffffff";
  contexto.lineWidth = GROSOR;
  contexto.beginPath();
  contexto.arc(TAMANO / 2, TAMANO / 2, RADIO, 0, Math.PI * 2);
  contexto.stroke();

  return new THREE.CanvasTexture(lienzo);
}

/**
 * Crea un marcador de anillo que puede mostrarse sobre un punto, ocultarse
 * y seguir su posición si esta cambia.
 *
 * El marcador se dibuja por encima de la escena y mantiene un tamaño fijo
 * en pantalla. No interviene en la detección de puntos con el raycaster.
 *
 * @param {object} opciones Opciones para crear el marcador.
 * @param {THREE.Scene} opciones.escena Escena donde se añadirá el marcador.
 * @param {THREE.Points} opciones.campoEstrellas Nube de puntos que contiene
 * las posiciones de las estrellas.
 * @returns {{
 *   mostrar: (indice: number) => void,
 *   ocultar: () => void,
 *   seguir: (indice: number) => void
 * }} Métodos para controlar el marcador.
 */
export function crearMarcador({ escena, campoEstrellas }) {
  // Anillo de tamaño fijo en pantalla alrededor de la estrella seleccionada.
  const geometriaMarcador = new THREE.BufferGeometry();
  geometriaMarcador.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(3), 3),
  );

  const materialMarcador = new THREE.PointsMaterial({
    // color: color3d("--acento"),
    color: "#ff8c7f",
    size: 28,
    sizeAttenuation: false,
    map: crearTexturaAnillo(),
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  // Actualiza el color del anillo cuando cambia la paleta.
  // registrarAplicacion((valorDe) =>
  //   materialMarcador.color.set(valorDe("--acento")),
  // );

  const marcador = new THREE.Points(geometriaMarcador, materialMarcador);
  marcador.visible = false;
  marcador.frustumCulled = false;
  escena.add(marcador);

  // Índice de la estrella seleccionada (inspector abierto); −1 sin selección.
  let indiceSeleccion = -1;

  /**
   * Muestra el anillo alrededor de la estrella indicada.
   *
   * @param {number} indice Índice de la estrella que se quiere marcar.
   */
  function mostrar(indice) {
    const posiciones = campoEstrellas.geometry.getAttribute("position");

    if (indice < 0 || indice >= posiciones.count) return;

    const posicionMarcador = marcador.geometry.getAttribute("position");

    posicionMarcador.setXYZ(
      0,
      posiciones.getX(indice),
      posiciones.getY(indice),
      posiciones.getZ(indice),
    );
    posicionMarcador.needsUpdate = true;

    indiceSeleccion = indice;
    marcador.visible = true;
  }

  /**
   * Oculta o retira el anillo y limpia el índice de selección.
   */
  function ocultar() {
    marcador.visible = false;
    indiceSeleccion = -1;
  }

  /**
   * Copia y actualiza la posición de la estrella del anillo si este la sigue.
   *
   * @param {number} indice Índice del punto cuya posición se actualizará.
   */
  function seguir(indice) {
    if (!marcador.visible || indice !== indiceSeleccion) return;

    const posiciones = campoEstrellas.geometry.getAttribute("position");
    const posicionMarcador = marcador.geometry.getAttribute("position");

    posicionMarcador.setXYZ(
      0,
      posiciones.getX(indice),
      posiciones.getY(indice),
      posiciones.getZ(indice),
    );
    posicionMarcador.needsUpdate = true;
  }

  return { mostrar, ocultar, seguir };
}
