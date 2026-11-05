import * as THREE from "three";
import { suscribirColor } from "./paleta.js";

/**
 * Crea una textura transparente con forma de anillo.
 *
 * El color blanco de la textura permite que el material aplique su propio
 * color mediante `material.color`, por lo que puede cambiarse en vivo.
 *
 * @returns {THREE.CanvasTexture} Textura del anillo.
 */
function crearTexturaReticula() {
  const TAMANO = 128;
  const RADIO = 40; // centro del trazo del aro (cubre r = 37…43)
  const GROSOR = 6; // trazo del aro en píxeles
  const LONGITUD_MARCA = 18; // longitud radial de cada marca
  const ANCHO_MARCA = 6; // ancho tangencial (= GROSOR del aro)
  const SOLAPE = 1; // la marca arranca 1 u dentro del radio del aro

  const lienzo = document.createElement("canvas");
  lienzo.width = TAMANO;
  lienzo.height = TAMANO;
  const contexto = lienzo.getContext("2d");
  const centro = TAMANO / 2; // 64
  const inicio = RADIO - SOLAPE; // 39: arranque de la marca
  const fin = inicio + LONGITUD_MARCA; // 57: extremo exterior

  contexto.strokeStyle = "#ffffff";
  contexto.lineCap = "butt"; // extremos rectos, aspecto HUD

  // Aro fino.
  contexto.lineWidth = GROSOR;
  contexto.beginPath();
  contexto.arc(centro, centro, RADIO, 0, Math.PI * 2);
  contexto.stroke();

  // 4 marcas cardinales pegadas al aro (arriba, derecha, abajo, izquierda).
  contexto.lineWidth = ANCHO_MARCA;
  contexto.beginPath();
  contexto.moveTo(centro, centro - inicio); // arriba:    (64, 25)
  contexto.lineTo(centro, centro - fin); //              → (64, 7)
  contexto.moveTo(centro + inicio, centro); // derecha:  (103, 64)
  contexto.lineTo(centro + fin, centro); //              → (121, 64)
  contexto.moveTo(centro, centro + inicio); // abajo:    (64, 103)
  contexto.lineTo(centro, centro + fin); //              → (64, 121)
  contexto.moveTo(centro - inicio, centro); // izquierda: (25, 64)
  contexto.lineTo(centro - fin, centro); //              → (7, 64)
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
    size: 40,
    sizeAttenuation: false,
    map: crearTexturaReticula(),
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  // Actualiza el color del anillo cuando cambia la paleta.
  suscribirColor((valor) => materialMarcador.color.set(valor), "--acento");

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
