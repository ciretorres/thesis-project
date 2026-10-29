import * as THREE from "three";
// import { color3d, registrarAplicacion } from '../escena/paleta.js';
import { crearTooltip } from "../ui/tooltip.js";

// Umbral de raycast sobre Points, en unidades de escena.
const UMBRAL_RAYCAST = 1.5;

// Desplazamiento máximo (px) entre pointerdown y pointerup para que se
// considere click y no arrastre de la órbita.
const UMBRAL_CLIC = 5;

// Desplazamiento del tooltip respecto al cursor.
const OFFSET_TOOLTIP = 14;

/**
 * Crea una textura de anillo hueco sobre un lienzo transparente.
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
 * @param {Function} opciones.alSeleccionar Función llamada al seleccionar una estrella.
 *   Recibe los datos de la estrella y su índice: `(estrella, indice)`.
 * @returns {{
 *   limpiarHover: Function,
 *   actualizarResaltado: Function,
 *   mostrarMarcador: Function,
 *   ocultarMarcador: Function
 * }} Métodos para controlar el hover y el marcador de selección.
 */
export function crearInteraccion({
  escena,
  camara,
  domElement,
  campoEstrellas,
  datos,
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

  // Índice de la estrella seleccionada (inspector abierto); o −1 sin no hay selección.
  let indiceSeleccion = -1;

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
   * @returns {number} Índice de la estrella o -1 si no hay ninguna.
   */
  function indiceEn(clientX, clientY) {
    const rect = domElement.getBoundingClientRect();

    puntero.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    puntero.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(puntero, camara);

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
    const tooltipStyleLeft = evento.clientX + OFFSET_TOOLTIP;
    const tooltipStyleTop = evento.clientY + OFFSET_TOOLTIP;
    tooltip.mover(tooltipStyleLeft, tooltipStyleTop);

    const indice = indiceEn(evento.clientX, evento.clientY);

    if (indice < 0 || !datos[indice]) {
      limpiarHover();
      return;
    }

    if (indice === indiceActual) return;

    indiceActual = indice;

    const posiciones = campoEstrellas.geometry.getAttribute("position");

    resaltado.geometry.attributes.position.setXYZ(
      0,
      posiciones.getX(indice),
      posiciones.getY(indice),
      posiciones.getZ(indice),
    );
    resaltado.geometry.attributes.position.needsUpdate = true;
    resaltado.visible = true;

    tooltip.mostrar(`HIP ${datos[indice].hip}`);
  }

  /**
   * Guarda la posición inicial de un posible clic.
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
  function actualizarResaltado(i) {
    const posiciones = campoEstrellas.geometry.getAttribute("position");

    if (resaltado.visible && i === indiceActual) {
      resaltado.geometry.attributes.position.setXYZ(
        0,
        posiciones.getX(i),
        posiciones.getY(i),
        posiciones.getZ(i),
      );
      resaltado.geometry.attributes.position.needsUpdate = true;
    }

    if (marcador.visible && i === indiceSeleccion) {
      marcador.geometry.attributes.position.setXYZ(
        0,
        posiciones.getX(i),
        posiciones.getY(i),
        posiciones.getZ(i),
      );
      marcador.geometry.attributes.position.needsUpdate = true;
    }
  }

  /**
   * Muestra el anillo alrededor de la estrella indicada.
   *
   * @param {number} indice Índice de la estrella que se quiere marcar.
   */
  function mostrarMarcador(indice) {
    if (indice < 0 || !datos[indice]) return;

    const posiciones = campoEstrellas.geometry.getAttribute("position");

    marcador.geometry.attributes.position.setXYZ(
      0,
      posiciones.getX(indice),
      posiciones.getY(indice),
      posiciones.getZ(indice),
    );
    marcador.geometry.attributes.position.needsUpdate = true;

    indiceSeleccion = indice;
    marcador.visible = true;
  }

  /**
   * Oculta o retira el anillo y limpia el índice de selección.
   */
  function ocultarMarcador() {
    marcador.visible = false;
    indiceSeleccion = -1;
  }

  domElement.addEventListener("pointermove", alMover);
  domElement.addEventListener("pointerdown", alBajar);
  domElement.addEventListener("pointerup", alSoltar);

  return {
    limpiarHover,
    actualizarResaltado,
    mostrarMarcador,
    ocultarMarcador,
  };
}
