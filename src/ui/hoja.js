// Duración de la animación de ajuste, en milisegundos.
const DURACION_SNAP_MS = 300;
// Desplazamiento mínimo para considerar que comenzó un arrastre, en píxeles.
const UMBRAL_ARRASTRE_PX = 6;
// Proporción del recorrido necesaria para cambiar de estado.
const UMBRAL_ESTADO = 0.5;
// Velocidad mínima para considerar un gesto como flick, en píxeles por milisegundo.
const UMBRAL_FLICK_PX_MS = 1;
// Intervalo de tiempo usado para calcular la velocidad del gesto, en milisegundos.
const VENTANA_FLICK_MS = 100;

/**
 * Aplica una curva de aceleración y desaceleración.
 * @param {number} t Progreso entre 0 y 1.
 * @returns {number} Progreso suavizado entre 0 y 1.
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Comprueba si el usuario prefiere reducir el movimiento.
 * @returns {boolean} `true` si está activa la preferencia de movimiento reducido.
 */
function movimientoReducido() {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Crea y devuelve el controlador de una hoja deslizante.
 *
 * La hoja puede mostrarse parcialmente («asomo») o expandirse por completo.
 * Permite abrirla, cerrarla, cambiar su estado con el tirador y arrastrarla.
 *
 * @param {Object} opciones Elementos y callbacks de la hoja.
 * @param {HTMLElement} opciones.tarjeta Contenedor cuya altura cambia.
 * @param {HTMLElement} opciones.cabecera Zona que recibe los gestos de arrastre.
 * @param {HTMLElement} opciones.cuerpo Contenido que se muestra al expandir.
 * @param {HTMLElement} opciones.tirador Control que alterna la hoja.
 * @param {(detalle: {motivo: string, estado: string, altoVisible: number}) => void} [opciones.alCambiar]
 * Callback llamado cuando cambia el estado o se mide la hoja.
 * @param {() => void} [opciones.alIniciarGesto] Callback llamado al iniciar un gesto válido.
 * @returns {{
 *   abrir: (opciones?: {conservar?: boolean}) => void,
 *   cerrar: () => void,
 *   alternar: () => void,
 *   expandir: () => void,
 *   colapsar: (opciones?: {enfocar?: boolean}) => void,
 *   reprocesar: () => void,
 *   altoVisible: () => number,
 *   estaExpandida: () => boolean,
 *   estado: () => string,
 *   activa: () => boolean,
 *   activar: () => void,
 *   desactivar: () => void,
 *   cancelarAnimacion: () => void
 * }} Controlador con las operaciones disponibles para la hoja.
 */
export function crearHoja({
  tarjeta,
  cabecera,
  cuerpo,
  tirador,
  alCambiar,
  alIniciarGesto,
} = {}) {
  let activaHoja = false;
  let abierta = false;
  let estadoHoja = "asomo";
  let altos = { asomo: 0, expandido: 0 };
  let altoActual = 0;
  let rafId = 0;
  let gesto = null;
  let suprimirClick = false;

  // ── Estado y notificaciones ──────────────────────────────────────────────

  /** Notifica al callback los cambios de estado, altura o apertura. */
  function avisar(motivo, alto = altoActual) {
    if (typeof alCambiar === "function") {
      alCambiar({ motivo, estado: estadoHoja, altoVisible: alto });
    }
  }

  /** Actualiza el estado interno, el atributo de datos y el estado ARIA. */
  function aplicarEstado(estado) {
    estadoHoja = estado;
    tarjeta.dataset.hoja = estado;
    tirador.setAttribute(
      "aria-expanded",
      estado === "expandido" ? "true" : "false",
    );
  }

  /** Aplica la altura visible y actualiza la propiedad CSS compartida. */
  function aplicarAlto(px) {
    const alto = Math.max(altos.asomo, Math.min(altos.expandido, px));

    altoActual = alto;
    tarjeta.style.height = `${alto}px`;

    document.documentElement.style.setProperty(
      "--hoja-alto-visible",
      `${Math.round(alto)}px`,
    );

    return alto;
  }

  /** Muestra el contenido de la hoja. */
  function mostrarCuerpo() {
    cuerpo.hidden = false;
  }

  /** Oculta el contenido y mueve el foco al tirador si estaba dentro de él. */
  function ocultarCuerpo() {
    if (cuerpo.contains(document.activeElement)) {
      tirador.focus();
    }

    cuerpo.hidden = true;
  }

  // ── Medición y foco ──────────────────────────────────────────────────────

  /** Indica si el elemento ocupa espacio en el documento. */
  function elementoVisible(elemento) {
    return elemento.getClientRects().length > 0;
  }

  /**
   * Restaura el foco tras una medición, evitando interferir con otro control.
   * @param {Element|null} activo Elemento que tenía el foco antes de medir.
   * @param {boolean} focoEnCuerpo Indica si el foco estaba dentro del contenido.
   */
  function devolverFoco(activo, focoEnCuerpo) {
    if (!focoEnCuerpo || !activo || !activo.isConnected) return;

    const focoActual = document.activeElement;

    // No interferir si otro manejador ya movió el foco a otro control.
    if (focoActual !== activo && focoActual !== document.body) {
      return;
    }

    if (!cuerpo.hidden) {
      if (focoActual !== activo) activo.focus();
      return;
    }

    if (focoActual !== activo || !elementoVisible(activo)) {
      tirador.focus();
    }
  }

  /** Mide las alturas de los estados «asomo» y «expandido». */
  function medir() {
    const alturaOriginal = tarjeta.style.height;
    const cuerpoEstabaOculto = cuerpo.hidden;
    const focoOriginal = document.activeElement;
    const focoEnCuerpo = focoOriginal !== null && cuerpo.contains(focoOriginal);

    tarjeta.style.height = "";
    mostrarCuerpo();

    const altoExpandido = tarjeta.getBoundingClientRect().height;

    ocultarCuerpo();

    const altoAsomo =
      cabecera.getBoundingClientRect().height +
      (parseFloat(getComputedStyle(tarjeta).paddingBottom) || 0);

    cuerpo.hidden = cuerpoEstabaOculto;
    tarjeta.style.height = alturaOriginal;

    devolverFoco(focoOriginal, focoEnCuerpo);

    altos = {
      asomo: altoAsomo,
      expandido: Math.max(altoAsomo, altoExpandido),
    };
  }

  // ── Animaciones ──────────────────────────────────────────────────────────

  /** Detiene la animación activa, si la hay. */
  function cancelarAnimacion() {
    if (!rafId) return;

    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  /**
   * Anima la altura hasta el destino y, opcionalmente, confirma el nuevo estado.
   * @param {number} destino Altura final en píxeles.
   * @param {{commit?: boolean, estado?: string}} [opciones] Opciones de transición.
   */
  function animarA(destino, { commit = false, estado = estadoHoja } = {}) {
    cancelarAnimacion();

    if (commit) {
      aplicarEstado(estado);
      avisar("commit", destino);
    }

    if (estado === "expandido") {
      mostrarCuerpo();
    }

    if (movimientoReducido()) {
      aplicarAlto(destino);

      if (estado === "asomo") {
        ocultarCuerpo();
      }

      return;
    }

    const altoInicial = altoActual;
    const tiempoInicial = performance.now();

    function paso(tiempoActual) {
      const progreso = Math.min(
        1,
        (tiempoActual - tiempoInicial) / DURACION_SNAP_MS,
      );

      const progresoSuavizado = easeInOutCubic(progreso);
      const altoInterpolado =
        altoInicial + (destino - altoInicial) * progresoSuavizado;

      aplicarAlto(altoInterpolado);

      if (progreso < 1) {
        rafId = requestAnimationFrame(paso);
        return;
      }

      aplicarAlto(destino);

      if (estado === "asomo") {
        ocultarCuerpo();
      }

      rafId = 0;
    }

    rafId = requestAnimationFrame(paso);
  }

  // ── Apertura, cierre y estados ───────────────────────────────────────────

  /**
   * Abre la hoja y mide sus dimensiones.
   * @param {{conservar?: boolean}} [opciones] Si `conservar` es `true`, mantiene el estado actual.
   */
  function abrir({ conservar = false } = {}) {
    abandonarGesto();
    cancelarAnimacion();

    abierta = true;
    medir();

    if (!conservar) {
      estadoHoja = "asomo";
    }

    aplicarEstado(estadoHoja);

    if (estadoHoja === "asomo") {
      ocultarCuerpo();
    } else {
      mostrarCuerpo();
    }

    aplicarAlto(altos[estadoHoja]);
    avisar("apertura");
  }

  /** Cierra la hoja y restablece su altura y estado iniciales. */
  function cerrar() {
    abandonarGesto();
    cancelarAnimacion();

    abierta = false;
    altoActual = 0;

    document.documentElement.style.removeProperty("--hoja-alto-visible");

    tarjeta.style.height = "";
    aplicarEstado("asomo");
    ocultarCuerpo();
    avisar("cierre");
  }

  /** Expande la hoja hasta su altura máxima. */
  function expandir() {
    if (estadoHoja === "expandido") return;

    if (altos.expandido <= 0) {
      medir();
    }

    animarA(altos.expandido, {
      commit: true,
      estado: "expandido",
    });
  }

  /**
   * Colapsa la hoja al estado «asomo».
   * @param {{enfocar?: boolean}} [opciones] Si `enfocar` es `true`, enfoca el tirador.
   */
  function colapsar({ enfocar = false } = {}) {
    if (estadoHoja === "asomo") return;

    if (enfocar || cuerpo.contains(document.activeElement)) {
      tirador.focus();
    }

    animarA(altos.asomo, {
      commit: true,
      estado: "asomo",
    });
  }

  /** Alterna entre los estados «asomo» y «expandido». */
  function alternar() {
    if (estadoHoja === "asomo") {
      expandir();
    } else {
      colapsar();
    }
  }

  /** Vuelve a medir y ajustar la hoja si está abierta. */
  function reprocesar() {
    if (!abierta) return;

    cancelarAnimacion();
    medir();

    if (estadoHoja === "asomo") {
      ocultarCuerpo();
    } else {
      mostrarCuerpo();
    }

    aplicarAlto(altos[estadoHoja]);
    avisar("medicion");
  }

  /** Activa la hoja y, si ya estaba abierta, la restablece al estado «asomo». */
  function activar() {
    activaHoja = true;

    if (!abierta) return;

    medir();
    aplicarEstado("asomo");
    ocultarCuerpo();
    aplicarAlto(altos.asomo);
    avisar("medicion");
  }

  /** Desactiva la hoja, cancela interacciones y limpia sus estilos de estado. */
  function desactivar() {
    abandonarGesto();
    cancelarAnimacion();

    activaHoja = false;
    abierta = false;
    altoActual = 0;

    document.documentElement.style.removeProperty("--hoja-alto-visible");

    tarjeta.style.height = "";
    mostrarCuerpo();

    tirador.setAttribute("aria-expanded", "false");
    delete tarjeta.dataset.hoja;
  }

  // ── Gestos de arrastre ──────────────────────────────────────────────────

  /** Marca o desmarca visualmente el estado de arrastre. */
  function marcarArrastrando(activo) {
    if (activo) {
      tarjeta.dataset.arrastrando = "true";
    } else {
      delete tarjeta.dataset.arrastrando;
    }
  }

  /** Retira los listeners temporales asociados al gesto. */
  function quitarListenersGesto() {
    window.removeEventListener("pointermove", alPointerMove);
    window.removeEventListener("pointerup", alPointerUp);
    window.removeEventListener("pointercancel", alPointerCancel);
  }

  /** Finaliza el gesto actual sin iniciar una transición. */
  function abandonarGesto() {
    marcarArrastrando(false);

    if (!gesto) return;

    gesto = null;
    quitarListenersGesto();
  }

  /** Cancela el gesto y anima la hoja de vuelta al estado de origen. */
  function cancelarGesto() {
    marcarArrastrando(false);

    if (!gesto) return;

    const estadoOrigen = gesto.estadoOrigen;

    gesto = null;
    quitarListenersGesto();

    animarA(altos[estadoOrigen], { estado: estadoOrigen });
  }

  /** Calcula la velocidad vertical reciente del puntero; positivo significa que sube. */
  function velocidadAlto() {
    if (!gesto || gesto.muestras.length < 2) return 0;

    const ahora = performance.now();
    const muestrasRecientes = gesto.muestras.filter(
      (muestra) => ahora - muestra.t <= VENTANA_FLICK_MS,
    );

    if (muestrasRecientes.length < 2) return 0;

    const primera = muestrasRecientes[0];
    const ultima = muestrasRecientes[muestrasRecientes.length - 1];
    const duracion = ultima.t - primera.t;

    if (duracion <= 0) return 0;

    // Positivo al subir el puntero.
    return -(ultima.y - primera.y) / duracion;
  }

  /** Inicia un gesto válido desde la cabecera o el tirador. */
  function alPointerDown(evento) {
    if (!activaHoja || !abierta || !evento.isPrimary) return;

    if (evento.pointerType === "mouse" && evento.button !== 0) {
      return;
    }

    const objetivo = evento.target;
    const control =
      objetivo instanceof Element
        ? objetivo.closest("button, input, label, a")
        : null;

    if (control && control !== tirador) return;

    cancelarAnimacion();

    if (typeof alIniciarGesto === "function") {
      alIniciarGesto();
    }

    gesto = {
      id: evento.pointerId,
      y0: evento.clientY,
      alto0: altoActual,
      estadoOrigen: estadoHoja,
      arrastrando: false,
      muestras: [{ t: performance.now(), y: evento.clientY }],
    };

    window.addEventListener("pointermove", alPointerMove);
    window.addEventListener("pointerup", alPointerUp);
    window.addEventListener("pointercancel", alPointerCancel);
  }

  /** Actualiza la altura de la hoja mientras se arrastra. */
  function alPointerMove(evento) {
    if (!gesto || evento.pointerId !== gesto.id) return;

    const desplazamientoY = evento.clientY - gesto.y0;

    if (!gesto.arrastrando) {
      if (Math.abs(desplazamientoY) < UMBRAL_ARRASTRE_PX) return;

      gesto.arrastrando = true;
      marcarArrastrando(true);

      try {
        cabecera.setPointerCapture(evento.pointerId);
      } catch {
        // Los listeners de window siguen gestionando el gesto.
      }
    }

    evento.preventDefault();

    const alto = Math.max(
      altos.asomo,
      Math.min(altos.expandido, gesto.alto0 - desplazamientoY),
    );

    aplicarAlto(alto);

    if (alto <= altos.asomo + 0.5) {
      ocultarCuerpo();
    } else {
      mostrarCuerpo();
    }

    const ahora = performance.now();
    gesto.muestras.push({ t: ahora, y: evento.clientY });

    while (
      gesto.muestras.length > 2 &&
      ahora - gesto.muestras[0].t > VENTANA_FLICK_MS
    ) {
      gesto.muestras.shift();
    }
  }

  /** Finaliza el arrastre y decide si la hoja debe expandirse o colapsarse. */
  function alPointerUp(evento) {
    if (!gesto || evento.pointerId !== gesto.id) return;

    const gestoFinal = gesto;
    const velocidad = velocidadAlto();

    gesto = null;
    quitarListenersGesto();
    marcarArrastrando(false);

    // Un toque sin arrastre lo gestiona el click nativo del tirador.
    if (!gestoFinal.arrastrando) return;

    suprimirClick = true;
    setTimeout(() => {
      suprimirClick = false;
    }, 0);

    const recorrido = altos.expandido - altos.asomo;
    const avance =
      recorrido > 0
        ? Math.abs(altoActual - altos[gestoFinal.estadoOrigen]) / recorrido
        : 0;

    let destino = gestoFinal.estadoOrigen;

    if (gestoFinal.estadoOrigen === "asomo") {
      if (avance > UMBRAL_ESTADO || velocidad > UMBRAL_FLICK_PX_MS) {
        destino = "expandido";
      }
    } else if (avance > UMBRAL_ESTADO || velocidad < -UMBRAL_FLICK_PX_MS) {
      destino = "asomo";
    }

    const cambiaEstado = destino !== gestoFinal.estadoOrigen;

    animarA(altos[destino], {
      commit: cambiaEstado,
      estado: destino,
    });
  }

  /** Cancela el gesto si el navegador interrumpe el puntero. */
  function alPointerCancel(evento) {
    if (gesto && evento.pointerId === gesto.id) {
      cancelarGesto();
    }
  }

  // ── Eventos del tirador y la cabecera ────────────────────────────────────

  tirador.addEventListener("click", () => {
    if (!suprimirClick) {
      alternar();
    }
  });

  tirador.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      expandir();
    } else if (evento.key === "ArrowDown") {
      evento.preventDefault();
      colapsar();
    }
  });

  cabecera.addEventListener("pointerdown", alPointerDown);

  cabecera.addEventListener("lostpointercapture", () => {
    if (gesto) {
      cancelarGesto();
    }
  });

  // ── API pública ──────────────────────────────────────────────────────────

  return {
    abrir,
    cerrar,
    alternar,
    expandir,
    colapsar,
    reprocesar,
    altoVisible: () => altoActual,
    estaExpandida: () => estadoHoja === "expandido",
    estado: () => estadoHoja,
    activa: () => activaHoja,
    activar,
    desactivar,
    cancelarAnimacion,
  };
}
