// import StatsJS from 'stats.js';
import Stats from "three/addons/libs/stats.module.js";

/**
 * Crea y coloca un panel de estadísticas en una esquina de la ventana.
 *
 * Añade al documento el elemento DOM del panel y una etiqueta descriptiva.
 * Ambos elementos se ocultan a las tecnologías de asistencia porque muestran
 * información de depuración visual.
 *
 * @param {new () => { dom: HTMLElement }} Creador Constructor de la clase
 *   del medidor. La instancia debe exponer su elemento DOM en `dom`.
 * @param {"izquierda" | "derecha"} lado Lado de la ventana donde se coloca
 *   el panel.
 * @param {string} etiqueta Texto descriptivo que acompaña al panel.
 * @param {boolean} [abajo=false] Si es `true`, coloca el panel abajo;
 *   de lo contrario, lo coloca arriba.
 * @returns {{ dom: HTMLElement }} Instancia del medidor creada.
 */
function crearPanel(Creador, lado, etiqueta, abajo = false) {
  const stats = new Creador();

  stats.dom.style.position = "fixed";
  stats.dom.style.zIndex = "20";

  // Sobrescribe las posiciones inline que trae el panel para ubicarlo
  // en la esquina vertical solicitada.
  stats.dom.style[abajo ? "bottom" : "top"] = "0";
  stats.dom.style[abajo ? "top" : "bottom"] = "auto";

  // Coloca el panel a la izquierda o a la derecha de la ventana.
  if (lado === "derecha") {
    stats.dom.style.left = "auto";
    stats.dom.style.right = "0";
  } else {
    stats.dom.style.left = "0";
    stats.dom.style.right = "auto";
  }

  // El panel es información de depuración visual, no contenido accesible.
  stats.dom.setAttribute("aria-hidden", "true");
  document.body.appendChild(stats.dom);

  const etiquetaDom = document.createElement("div");
  etiquetaDom.textContent = etiqueta;
  etiquetaDom.style.cssText = [
    "position:fixed",
    abajo ? "bottom:2px" : "top:2px",
    "z-index:21",
    "color:var(--blanco)",
    "font:11px/1.4 monospace",
    "background:rgba(var(--negro-rgb),0.65)",
    "padding:2px 6px",
    "border:1px solid var(--gris)",
    lado === "derecha" ? "right:86px" : "left:86px",
  ].join(";");

  // La etiqueta también es visual y se excluye del árbol de accesibilidad.
  etiquetaDom.setAttribute("aria-hidden", "true");
  document.body.appendChild(etiquetaDom);

  return stats;
}

export function crearPanelesStats() {
  return [
    // crearPanel(StatsJs, 'derecha', 'stats.js', true),
    crearPanel(Stats, "derecha", "three/addons", true),
  ];
}
