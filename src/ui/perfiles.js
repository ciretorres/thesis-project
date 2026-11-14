/**
 * Crea un selector accesible de perfiles de color.
 * El perfil se aplica en tiempo de ejecución y no se guarda al recargar.
 *
 * @param {Object} [opciones]
 * @param {() => void} [opciones.alCambiarPerfil]
 *   Función llamada después de aplicar un perfil.
 */
export function crearPerfiles({ alCambiarPerfil } = {}) {
  const contenedor = document.createElement("div");
  contenedor.className = "perfiles-contenedor";

  // Disparador: alterna el panel; su círculo sigue al perfil activo vía CSS.
  const disparador = document.createElement("button");
  disparador.type = "button";
  disparador.className = "perfiles-disparador";
  disparador.setAttribute("aria-expanded", "false");
  disparador.setAttribute("aria-controls", "perfiles-panel");
  disparador.setAttribute("aria-label", "Color del planetario");

  // Panel radiogroup (patrón APG): roving tabindex y flechas con wrap.
  const panel = document.createElement("div");
  panel.id = "perfiles-panel";
  panel.className = "perfiles-panel";
  panel.setAttribute("role", "radiogroup");
  panel.setAttribute("aria-label", "Perfil de color");
  panel.hidden = true;

  /** Configura un botón de opción y conecta su selección. */
  function montarRadio(radio, id, activo) {
    radio.type = "button";
    radio.className = "perfiles-radio";
    radio.setAttribute("data-perfil", id);
    radio.tabIndex = activo ? 0 : -1;

    const muestra = document.createElement("span");
    muestra.className = "perfiles-radio-muestra";
    radio.append(muestra);

    // Enter/Space disparan el clic nativo del botón → misma selección.
    radio.addEventListener("click", () => aplicar(id));
  }

  const radioAzul = document.createElement("button");
  montarRadio(radioAzul, "azul", true);
  radioAzul.setAttribute("role", "radio");
  radioAzul.setAttribute("aria-label", "Azul");
  radioAzul.setAttribute("aria-checked", "true");

  const radioRojo = document.createElement("button");
  montarRadio(radioRojo, "rojo", false);
  radioRojo.setAttribute("role", "radio");
  radioRojo.setAttribute("aria-label", "Rojo");
  radioRojo.setAttribute("aria-checked", "false");

  const radioMorado = document.createElement("button");
  montarRadio(radioMorado, "morado", false);
  radioMorado.setAttribute("role", "radio");
  radioMorado.setAttribute("aria-label", "Morado");
  radioMorado.setAttribute("aria-checked", "false");

  const radios = [radioAzul, radioRojo, radioMorado];
  panel.append(...radios);

  /** Aplica el perfil y actualiza el estado accesible de las opciones. */
  function aplicar(id) {
    document.documentElement.dataset.perfil = id;

    // Checkea el radio botón que corresponda al id del perfil activo
    radios.forEach((radio) => {
      const activo = radio.getAttribute("data-perfil") === id;
      radio.setAttribute("aria-checked", String(activo));
      radio.tabIndex = activo ? 0 : -1;
    });

    alCambiarPerfil?.();
  }

  /** Muestra el panel y enfoca el perfil activo. */
  function abrir() {
    panel.hidden = false;
    disparador.setAttribute("aria-expanded", "true");

    const activo = radios.find((radio) => radio.tabIndex === 0) || radios[0];
    activo.focus();
  }

  /**
   * Oculta el panel y, si se solicita, devuelve el foco al disparador.
   *
   * @param {boolean} devolverFoco Indica si debe enfocarse el disparador.
   */
  function cerrar(devolverFoco) {
    panel.hidden = true;
    disparador.setAttribute("aria-expanded", "false");
    if (devolverFoco) disparador.focus();
  }

  disparador.addEventListener("click", () => {
    if (panel.hidden) abrir();
    else cerrar(true);
  });

  // Teclado del grupo: Escape cierra SOLO el selector cuando está abierto
  // (frena la propagación para no disparar el handler en `document` del
  // inspector; patrón buscador.js). Las flechas mueven el foco y
  // seleccionan (APG).
  contenedor.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      if (panel.hidden) return;

      evento.stopPropagation();
      cerrar(true);
      return;
    }

    const pasos = {
      ArrowLeft: -1,
      ArrowUp: -1,
      ArrowRight: 1,
      ArrowDown: 1,
    };

    if (!(evento.key in pasos)) return;

    evento.preventDefault();

    const foco = radios.indexOf(document.activeElement);
    const base =
      foco >= 0 ? foco : radios.findIndex((radio) => radio.tabIndex === 0);
    const siguiente =
      (base + pasos[evento.key] + radios.length) % radios.length;

    radios[siguiente].focus();
    aplicar(radios[siguiente].getAttribute("data-perfil"));
  });

  // Clic fuera: colapsa sin robar el foco (el puntero ya está fuera).
  document.addEventListener("click", (evento) => {
    if (!panel.hidden && !contenedor.contains(evento.target)) cerrar(false);
  });

  contenedor.append(disparador, panel);
  document.body.appendChild(contenedor);
}
