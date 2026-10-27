import * as THREE from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

import { mostrarAviso } from "../ui/avisos.js";
// import { color3d } from "./paleta.js";
import { comprobarSoporteWebGL } from "./webgl.js";

/**
 * Comprueba que el navegador soporte WebGL2 e intenta crear el renderizador.
 *
 * Si WebGL2 no está disponible o falla la creación, muestra el aviso
 * correspondiente y devuelve `null`.
 *
 * @param {HTMLElement} app Contenedor donde se insertará el canvas.
 * @returns {WebGLRenderer | null} El renderizador creado, o `null` si falla
 * la validación o la inicialización.
 */
export function inicializarRenderer(app) {
  if (!comprobarSoporteWebGL()) {
    mostrarAviso(
      "Tu navegador no soporta WebGL2, necesario para la interfaz interactiva.",
      {
        href: "https://wikis.khronos.org/webgl/",
        texto: "Cómo obtener una implementación de WebGL",
      },
    );

    return null;
  }

  try {
    return crearRenderer(app);
  } catch {
    mostrarAviso(
      "No se pudo inicializar el renderizador WebGL en tu navegador.",
    );

    return null;
  }
}

/**
 * Crea y configura el renderizador para la vista de la cámara y lo agrega al contenedor del canvas.
 *
 * @param {HTMLDocument} contenedor Elemento donde se insertará el canvas.
 * @returns {THREE.WebGLRenderer} El renderizador de Three.js
 * @see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
 */
export function crearRenderer(contenedor) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(color3d("--negro"));
  renderer.setClearColor("#000000");

  renderer.domElement.setAttribute(
    "aria-label",
    "Interfaz-interactiva para la visualización de un fenómeno astronómico.",
  );

  contenedor.appendChild(renderer.domElement);

  return renderer;
}

/**
 * Ajusta la cámara y el renderizador al tamaño actual de la ventana.
 *
 * Actualiza la relación de aspecto de la cámara, su matriz de proyección
 * y las dimensiones del renderizador.
 *
 * @param {WebGLRenderer} renderer Renderizador que se ajustará.
 * @param {PerspectiveCamera} camara Cámara cuya relación de aspecto se actualizará.
 */
export function ajustarEnRedimensionamiento(renderer, camara) {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Crea un CSS2DRenderer y lo monta dentro del contenedor indicado.
 *
 * El renderer no captura eventos del puntero, para no interferir con las
 * interacciones del canvas. También se desactiva la ordenación de objetos
 * para que las etiquetas no se superpongan a otros elementos de interfaz.
 *
 * @param {HTMLElement} contenedor - Elemento DOM donde se montará el renderer.
 * @returns {CSS2DRenderer} Renderer CSS2D creado.
 * @see https://threejs.org/docs/#CSS2DRenderer
 */
export function crearEtiquetasRenderer(contenedor) {
  if (!(contenedor instanceof HTMLElement)) {
    throw new TypeError("El contenedor debe ser un elemento HTMLElement.");
  }

  const css2dRenderer = new CSS2DRenderer();

  css2dRenderer.domElement.style.position = "absolute";
  css2dRenderer.domElement.style.top = "0";
  css2dRenderer.domElement.style.left = "0";
  css2dRenderer.domElement.style.pointerEvents = "none";

  contenedor.appendChild(css2dRenderer.domElement);
  // Desactivado para que ninguna etiqueta pinte por encima de stats/inspector/avisos.
  css2dRenderer.sortObjects = false;

  return css2dRenderer;
}
