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
    "z-index: 10000;",
  );
  statsid.style.position = "absolute";
  statsid.style.bottom = "0px";
  statsid.style.right = "0px";
  statsid.style.cursor = "pointer";
  statsid.style.opacity = "0.9";

  return estadisticas;
};

export default addStats;
