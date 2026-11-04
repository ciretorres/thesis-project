// Buscador de estrellas

// Normalización y dict compartidos con el inspector (única regla de
// normalización del proyecto; ver src/nombres.js).
import { dict_hip_completo, normalizarTexto } from "../estrellas/nombres.js";
import { crearCruz, crearLupa } from "./iconos.js";

// Máximo de coincidencias mostradas.
const MAX_RESULTADOS = 8;

/**
 * Crea el buscador, lo inserta en el inspector y conecta sus interacciones.
 *
 * @param {Object} opciones
 * @param {Array<Object>} opciones.datos Estrellas que se pueden buscar.
 * @param {(indice: number) => void} [opciones.alSeleccionar]
 *   Función llamada con el índice de la estrella seleccionada.
 * @returns {void}
 */
export function crearBuscador({ datos, alSeleccionar } = {}) {
  const contenedor = document.querySelector(".inspector-contenedor");
  // Si crearInspector no corrió no hay dónde montarla (y sin datos no hay
  // qué buscar); en ese caso no se crea ninguna UI.
  if (!contenedor || !datos) return;

  const buscador = document.createElement("div");
  buscador.className = "buscador";

  const input = document.createElement("input");
  input.type = "search";
  input.className = "buscador-input";
  input.id = "buscador-input";
  input.placeholder = "Buscar estrella…";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-label", "Buscar estrella");
  input.setAttribute("aria-controls", "buscador-lista");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-autocomplete", "list");

  const lista = document.createElement("ul");
  lista.id = "buscador-lista";
  lista.className = "buscador-lista";
  lista.setAttribute("role", "listbox"); // role="listbox" (patrón combobox)
  lista.hidden = true;

  // Región viva: anuncia el nº de coincidencias al escribir (AT).
  const anuncio = document.createElement("div");
  anuncio.className = "buscador-anuncio";
  anuncio.setAttribute("role", "status");
  anuncio.setAttribute("aria-live", "polite");

  // Botón × limpiar: borra el texto del input.
  // Nace oculto y se muestra solo cuando el input tiene texto; el × nativo del
  // input type="search" queda oculto en src/style.css para no duplicar.
  const limpiar = document.createElement("button");
  limpiar.type = "button"; // botón real: no submita nada
  limpiar.className = "buscador-limpiar";
  limpiar.setAttribute("aria-label", "Borrar texto");
  limpiar.hidden = true;
  limpiar.append(crearCruz());

  const vacio = document.createElement("p");
  vacio.className = "buscador-vacio";
  vacio.setAttribute("role", "status");
  vacio.textContent = "Sin resultados";
  vacio.hidden = true;

  // Orden DOM: lupa, input, botón ×, lista, anuncio vivo, mensaje de vacío.
  buscador.append(crearLupa(), input, limpiar, lista, anuncio, vacio);
  contenedor.prepend(buscador);

  /** Coincidencias actuales, con su índice en `datos`. */
  let resultados = [];

  /** Posición activa en `resultados`; -1 indica que no hay ninguna. */
  let activa = -1;

  /** Cierra la lista y restablece el estado ARIA (sin mensaje por defecto) del buscador. */
  function cerrarPanel() {
    lista.hidden = true;
    lista.replaceChildren();
    vacio.hidden = true;
    anuncio.textContent = ""; // sin anuncios vivos al cerrar
    resultados = [];
    activa = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  /** Actualiza la opción activa (.activa + aria-selected) y mantiene visible su fila. */
  function resaltarActiva() {
    const filas = lista.children;

    for (let p = 0; p < filas.length; p++) {
      const esActiva = p === activa;
      filas[p].classList.toggle("activa", esActiva);
      filas[p].setAttribute("aria-selected", esActiva ? "true" : "false");
    }

    const resultado = resultados[activa];
    if (resultado) {
      input.setAttribute("aria-activedescendant", `buscador-op-${resultado.i}`);
      filas[activa].scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  /** Dibuja las filas de resultados y activa la primera coincidencia. */
  function renderizar() {
    const filas = resultados.map(({ i, estrella }) => {
      const fila = document.createElement("li");
      fila.id = `buscador-op-${i}`;
      fila.setAttribute("role", "option");
      fila.dataset.indice = String(i);

      const nombre = dict_hip_completo[estrella.hip];
      if (nombre) {
        const span = document.createElement("span");
        span.className = "buscador-nombre";
        span.textContent = nombre;
        fila.appendChild(span);
      }

      const hip = document.createElement("span");
      hip.className = "buscador-hip";
      hip.textContent = `HIP ${estrella.hip}`;
      fila.appendChild(hip);

      return fila;
    });

    lista.replaceChildren(...filas);
    lista.hidden = false;
    vacio.hidden = true;
    anuncio.textContent = `${resultados.length} coincidencia${resultados.length === 1 ? "" : "s"}`; // AT
    input.setAttribute("aria-expanded", "true");

    activa = resultados.length > 0 ? 0 : -1; // primera fila activa por defecto

    resaltarActiva();
  }

  /**
   * Busca por nombre, alias o número HIP. Prioriza coincidencias de prefijo
   * y conserva el orden original dentro de cada grupo.
   *
   * @param {string} query Texto introducido en el campo de búsqueda.
   */
  function buscar(query) {
    const q = normalizarTexto(query);

    if (q === "") {
      cerrarPanel(); // query vacía → sin lista y sin mensaje
      return;
    }

    const prefijos = [];
    const resto = [];

    for (let i = 0; i < datos.length; i++) {
      const estrella = datos[i];
      const nombreDict = dict_hip_completo[estrella.hip]; // puede ser undefined
      // Incluye el alias entre paréntesis; null = el dict no tiene nombre.
      const texto = nombreDict ? normalizarTexto(nombreDict) : null;
      const matchNombre = texto !== null && texto.includes(q);
      const matchHip = /\d/.test(q) && String(estrella.hip).includes(q);

      if (!matchNombre && !matchHip) continue;

      const esPrefijo =
        (texto !== null && texto.startsWith(q)) ||
        String(estrella.hip).startsWith(q);
      // Dos cubetas mantienen el orden de `datos` dentro de cada grupo.

      (esPrefijo ? prefijos : resto).push({ i, estrella });
    }

    resultados = prefijos.concat(resto).slice(0, MAX_RESULTADOS);

    if (resultados.length === 0) {
      // Sin coincidencias: mensaje "Sin resultados" y <ul> cerrado.
      lista.replaceChildren();
      lista.hidden = true;
      vacio.hidden = false;
      anuncio.textContent = "Sin coincidencias"; // AT (query no vacía aquí)
      activa = -1;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      return;
    }

    renderizar();
  }

  /**
   * Selecciona un resultado (clic/tap o Enter), limpia el campo y notifica al consumidor.
   *
   * @param {number} posicion Posición del resultado en la lista.
   */
  function seleccionar(posicion) {
    const resultado = resultados[posicion];
    if (!resultado) return;

    input.value = ""; // limpia para la siguiente búsqueda
    limpiar.hidden = true; // × oculto con el campo vacío
    cerrarPanel();
    input.blur();

    if (typeof alSeleccionar === "function") {
      alSeleccionar(resultado.i);
    }
  }

  // --- Listeners -------------------------------------------------------
  input.addEventListener("input", () => {
    buscar(input.value);
    // El × limpiar se ve solo con texto en el input (CA 11).
    limpiar.hidden = input.value === "";
  });

  // Evento `search` (por si el type="search" vaciara el campo por vía
  // nativa): resincroniza el × con el valor real (CA 11).
  input.addEventListener("search", () => {
    limpiar.hidden = input.value === "";
  });

  // × limpiar: preventDefault en pointerdown evita que el input pierda el
  // foco; el clic borra el texto, cierra la lista (query vacía = sin lista),
  // oculta el propio × y devuelve el foco al input.
  limpiar.addEventListener("pointerdown", (evento) => {
    evento.preventDefault();
  });

  limpiar.addEventListener("click", () => {
    input.value = "";
    cerrarPanel();
    limpiar.hidden = true;
    input.focus();
  });

  // Clic fuera (canvas, tarjeta…): la lista se cierra; la selección de fila
  // NO pasa por aquí porque el pointerdown de la fila hace preventDefault.
  input.addEventListener("blur", cerrarPanel);

  input.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      if (resultados.length === 0) return;

      evento.preventDefault();
      const delta = evento.key === "ArrowDown" ? 1 : -1;
      // Sin vuelta circular: activa queda en [0, resultados.length - 1].
      activa = Math.min(resultados.length - 1, Math.max(0, activa + delta));
      resaltarActiva();
      return;
    }

    if (evento.key === "Enter") {
      if (lista.hidden || activa < 0) return;

      evento.preventDefault();
      seleccionar(activa);
      return;
    }

    if (evento.key === "Escape") {
      if (!lista.hidden) {
        // Lista abierta: fase de destino en el input → corre ANTES que el
        // handler en `document` del inspector (src/inspector.js): se frena
        // aquí y solo se cierra la lista. preventDefault evita además el
        // borrado nativo del input type="search".
        evento.stopPropagation();
        evento.preventDefault();
        cerrarPanel();
      }

      // Lista cerrada: sin stopPropagation → el 2.º Escape cierra el
      // inspector desde su handler en `document`. preventDefault evita que
      // el `type="search"` vacíe el input nativamente (evento `search`, sin
      // `input`) y deje el × visible con el campo vacío.
      evento.preventDefault();
      return;
    }
  });

  // Selección en pointerdown (delegado en el <ul>): dispara ANTES del blur,
  // mantiene el foco en el input y evita la carrera blur ↔ clic/tap.
  lista.addEventListener("pointerdown", (evento) => {
    if (evento.button !== 0) return;

    const fila = evento.target.closest?.('[role="option"]');
    if (!fila || !lista.contains(fila)) return;

    evento.preventDefault(); // no mueve el foco ni cierra la lista
    const posicion = Array.prototype.indexOf.call(lista.children, fila);
    seleccionar(posicion);
  });
}
