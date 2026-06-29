// módulo para mostrar estadísticas del render en el front
import Stats from "three/addons/libs/stats.module.js";

/**
 * Método para agregar las estadísticas al main
 * @param {String} id: de la etiqueta main en el html
 * @returns {Stats} estadisticas
 */
const addStats = (id) => {
  const estadisticas = new Stats();

  // append a la etiqueta main
  const mainid = document.querySelector(id);
  mainid.appendChild(estadisticas.dom).setAttribute("id", "statsid");

  // estilo css
  const statsid = document.querySelector("#statsid");
  // statsid.setAttribute("style", "position:block");
  statsid.setAttribute(
    "style",
    "position: absolute; top: 0px; right: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;",
  );

  return estadisticas;
};

export default addStats;
