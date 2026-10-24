import * as THREE from "three";
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
