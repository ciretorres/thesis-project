// módulo para mostrar estadísticas del render en el front
import Stats from "three/addons/libs/stats.module.js";

/**
 * Método para agregar las estadísticas al main
 * @param {String} id : de la etiqueta main del html
 * @returns {Stats} stats
 */
const addStats = (id) => {
  const stats = new Stats();

  const mainid = document.querySelector(id);
  mainid.appendChild(stats.dom).setAttribute("id", "statsid");

  const statsid = document.querySelector("#statsid");
  // statsid.setAttribute("style", "position:block");
  statsid.setAttribute(
    "style",
    "position: absolute; top: 0px; right: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;",
  );

  return stats;
};

export default addStats;
