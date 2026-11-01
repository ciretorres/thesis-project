import * as THREE from "three";
// import { color3d, registrarAplicacion } from '../escena/paleta.js';
import { crearTooltip } from "../ui/tooltip.js";

// Umbral de intersección del raycaster sobre Points, en unidades de escena.
const UMBRAL_RAYCAST = 1.5;

// Desplazamiento máximo (px) entre pointerdown y pointerup para que se
// considere un gesto como click y no arrastre de la órbita.
const UMBRAL_CLIC = 5;

// Desplazamiento o distancia del tooltip respecto al cursor en píxeles.
const OFFSET_TOOLTIP = 14;

/**
 * Crea la interacción de hover y selección para un campo de estrellas.
 *
 * El hover resalta la estrella bajo el puntero y muestra su HIP en un tooltip.
 * El clic selecciona una estrella, pero no se activa si el puntero se ha
 * desplazado lo suficiente como para considerarlo un arrastre de la órbita.
 *
 * @param {Object} opciones Opciones de configuración.
 * @param {THREE.Scene} opciones.escena Escena donde se añaden los marcadores.
 * @param {THREE.Camera} opciones.camara Cámara usada para el raycast.
 * @param {HTMLElement} opciones.domElement Elemento que recibe los eventos.
 * @param {THREE.Points} opciones.campoEstrellas Nube de puntos de las estrellas.
 * @param {Array<Object>} opciones.datos Datos asociados a cada estrella.
 * @param {{ seguir: (indice: number) => void }} opciones.marcador Marcador de selección que actualiza su posición según el índice.
 * @param {Function} opciones.alSeleccionar Función llamada al seleccionar una estrella.
 *   Recibe los datos de la estrella y su índice: `(estrella, indice)`.
 * @returns {{
 *   limpiarHover: Function,
 *   actualizarResaltado: Function,
 * }} Métodos para controlar el hover y el marcador de selección.
 */
export function crearInteraccion({
  escena,
  camara,
  domElement,
  campoEstrellas,
  datos,
  marcador,
  alSeleccionar,
}) {
  // Tooltip HTML que muestra el identificador HIP.
  const tooltip = crearTooltip();

  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = UMBRAL_RAYCAST;

  const puntero = new THREE.Vector2();
  let indiceActual = -1;
  let origenPuntero = null;

  // Punto independiente que resalta la estrella bajo el puntero.
  const geometriaResaltado = new THREE.BufferGeometry();
  geometriaResaltado.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(3), 3),
  );

  const materialResaltado = new THREE.PointsMaterial({
    // color: color3d("--resaltado"),
    color: "#ff2b2b",
    size: 2,
    sizeAttenuation: true,
  });

  const resaltado = new THREE.Points(geometriaResaltado, materialResaltado);
  resaltado.visible = false;
  resaltado.frustumCulled = false;
  escena.add(resaltado);

  /**
   * Oculta el resaltado y el tooltip del hover.
   */
  function limpiarHover() {
    indiceActual = -1;
    resaltado.visible = false;
    tooltip.ocultar();
  }

  /**
   * Busca la estrella situada bajo las coordenadas de pantalla indicadas.
   *
   * @param {number} clientX Coordenada horizontal del puntero.
   * @param {number} clientY Coordenada vertical del puntero.
   * @returns {number} Índice de la estrella o `-1` si no hay ninguna.
   */
  function indiceEn(clientX, clientY) {
    const rect = domElement.getBoundingClientRect();

    puntero.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    puntero.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // Actualiza el raycaster
    raycaster.setFromCamera(puntero, camara);

    // Intersecta con los objetos en la escena
    const intersecciones = raycaster.intersectObject(campoEstrellas, false);
    const indice = intersecciones.length > 0 ? intersecciones[0].index : -1;

    return indice === null || indice === undefined ? -1 : indice;
  }

  /**
   * Actualiza el hover y la posición del tooltip al mover el puntero.
   *
   * @param {PointerEvent} evento Evento de movimiento del puntero.
   */
  function alMover(evento) {
    tooltip.mover(
      evento.clientX + OFFSET_TOOLTIP,
      evento.clientY + OFFSET_TOOLTIP,
    );

    const indice = indiceEn(evento.clientX, evento.clientY);

    if (indice < 0 || !datos[indice]) {
      limpiarHover();
      return;
    }

    if (indice === indiceActual) return;

    indiceActual = indice;

    const posiciones = campoEstrellas.geometry.getAttribute("position");
    const posicionResaltado = resaltado.geometry.getAttribute("position");

    posicionResaltado.setXYZ(
      0,
      posiciones.getX(indice),
      posiciones.getY(indice),
      posiciones.getZ(indice),
    );
    posicionResaltado.needsUpdate = true;
    resaltado.visible = true;

    tooltip.mostrar(`HIP ${datos[indice].hip}`);
  }

  /**
   * Registra la posición inicial de un posible clic.
   * Click vs arrastre: solo selecciona si entre pointerdown y pointerup
   * el puntero se movió menos de UMBRAL_CLIC px (si no, es la órbita).
   *
   * @param {PointerEvent} evento Evento de pulsación del puntero.
   */
  function alBajar(evento) {
    if (evento.button !== 0) return;

    origenPuntero = { x: evento.clientX, y: evento.clientY };
  }

  /**
   * Selecciona la estrella bajo el puntero si el gesto fue un clic y no un arrastre.
   *
   * @param {PointerEvent} evento Evento de liberación del puntero.
   */
  function alSoltar(evento) {
    if (evento.button !== 0 || !origenPuntero) return;

    const desplazamiento = Math.hypot(
      evento.clientX - origenPuntero.x,
      evento.clientY - origenPuntero.y,
    );

    origenPuntero = null;
    if (desplazamiento >= UMBRAL_CLIC) return; // movimiento de órbita

    const indice = indiceEn(evento.clientX, evento.clientY);
    if (indice < 0 || !datos[indice]) return; // click en el vacío

    limpiarHover();
    // click en una estrella
    if (typeof alSeleccionar === "function")
      alSeleccionar(datos[indice], indice);
  }

  /**
   * Actualiza la posición del hover o del marcador si la estrella se ha movido.
   *
   * @param {number} i Índice de la estrella cuya posición cambió.
   */
  function actualizarResaltado(indice) {
    const posiciones = campoEstrellas.geometry.getAttribute("position");

    if (resaltado.visible && indice === indiceActual) {
      const posicionResaltado = resaltado.geometry.getAttribute("position");

      posicionResaltado.setXYZ(
        0,
        posiciones.getX(indice),
        posiciones.getY(indice),
        posiciones.getZ(indice),
      );
      posicionResaltado.needsUpdate = true;
    }

    // El marcador comprueba internamente si debe seguir este índice.
    marcador.seguir(indice);
  }

  domElement.addEventListener("pointermove", alMover);
  domElement.addEventListener("pointerdown", alBajar);
  domElement.addEventListener("pointerup", alSoltar);

  return {
    limpiarHover,
    actualizarResaltado,
  };
}
