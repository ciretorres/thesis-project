/**
 * Crea un tooltip HTML para mostrar información junto al cursor.
 *
 * El módulo solo gestiona el elemento DOM. El llamante decide qué texto
 * mostrar y calcula la posición, incluido cualquier offset.
 *
 * @returns {{
 *   mover: (x: number, y: number) => void,
 *   mostrar: (texto: string) => void,
 *   ocultar: () => void
 * }} Métodos para controlar el tooltip.
 */
export function crearTooltip() {
  const div = document.createElement("div");
  div.className = "tooltip-estrella";
  div.hidden = true;
  document.body.appendChild(div);

  /**
   * Coloca el tooltip en coordenadas del viewport, en píxeles.
   *
   * @param {number} x Coordenada horizontal.
   * @param {number} y Coordenada vertical.
   */
  function mover(x, y) {
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
  }

  /**
   * Actualiza el texto y muestra el tooltip.
   *
   * @param {string} texto Texto que se mostrará.
   */
  function mostrar(texto) {
    div.textContent = texto;
    div.hidden = false;
  }

  /**
   * Oculta el tooltip al salir de la estrella o al limpiar el hover sin quitarlo del DOM.
   */
  function ocultar() {
    div.hidden = true;
  }

  return { mover, mostrar, ocultar };
}
