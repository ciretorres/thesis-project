/**
 * Muestra un aviso accesible superpuesto para informar de un error
 * sin dejar la pantalla vacía.
 *
 * Si se proporciona un enlace, lo añade al aviso y lo abre en una pestaña nueva.
 *
 * @param {string} mensaje Texto que se mostrará en el aviso.
 * @param {{ href: string, texto: string } | undefined} [enlace]
 * Enlace opcional de ayuda.
 */
export function mostrarAviso(mensaje, enlace) {
  const aviso = document.createElement("div");
  aviso.className = "aviso";

  aviso.setAttribute("role", "alert");
  aviso.textContent = mensaje;

  if (enlace) {
    const a = document.createElement("a");
    a.href = enlace.href;
    a.textContent = enlace.texto;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "aviso-enlace";

    aviso.append(" ", a);
  }

  document.body.appendChild(aviso);
}
