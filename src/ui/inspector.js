// Inspector de propiedades de la estrella seleccionada.

import { dict_hip_completo } from "../estrellas/nombres.js";

/**
 * Filas del inspector: etiqueta, función para obtener el valor y, opcionalmente,
 * configuración del control, estilo destacado y tipo de fila.
 */
const FILAS = [
  ["HIP", (e) => String(e.hip)],
  [
    "Magnitud Aparente",
    (e) => e.vmag.toFixed(2),
    { tipo: "vmag", delta: 1 },
    true,
  ],
  ["Magnitud Absoluta", (e) => e.absmag.toFixed(2)],
  // Filas pendientes de reactivar (sincronización con la distancia editada).
  // ['Plx', (e) => String(e.plx)],
  [
    "Distancia del Sol",
    (e) => e.distancia.toFixed(2) + " pársecs",
    { tipo: "distancia", delta: 1 },
    true,
  ],
  ["-", (e) => e.ly.toFixed(2) + " años luz", null, true, "ly"],
  ["Ascensión Recta", (e) => formatearRA(e.rahms)],
  ["Declinación", (e) => formatearDec(e.dedms)],
  // ['X', (e) => String(e.x)],
  // ['Y', (e) => String(e.y)],
  // ['Z', (e) => String(e.z)],
];

/** Tipos de fila cuyas celdas también se iluminan al cambiar una escala activa. */
const DESTELLO_CRUZADO = {
  vmag: ["distancia", "ly"], // magnitud aparente → pársecs y años luz
  distancia: ["vmag"], // distancia → magnitud aparente
};

/**
 * Convierte una ascensión recta del formato `HH MM SS.ss` a `HHh MMm SS.ss`.
 * Ej.: "14 29 47.75" → "14h 29m 47.75s".
 *
 * @param {string} rahms Ascensión recta en formato horas, minutos y segundos.
 * @returns {string} Ascensión recta formateada.
 */
function formatearRA(rahms) {
  const [horas, minutos, segundos] = rahms.split(" ");

  return (
    `${horas.padStart(2, "0")}h ` +
    `${minutos.padStart(2, "0")}m ` +
    `${Number(segundos).toFixed(2).padStart(5, "0")}s`
  );
}

/**
 * Convierte una declinación del formato `±DD MM SS.s` a `±DD° MM' SS.s"`.
 *  Ej.: "-62 40 52.9" → "-62° 40' 52.9\"".
 *
 * @param {string} dedms Declinación en formato grados, minutos y segundos.
 * @returns {string} Declinación formateada.
 */
function formatearDec(dedms) {
  const signo = dedms.startsWith("-") ? "-" : "+";
  const [grados, minutos, segundos] = dedms.replace(/^[+-]/, "").split(" ");
  const [segEnteros, segDecimal] = Number(segundos).toFixed(1).split(".");

  return (
    `${signo}${grados.padStart(2, "0")}° ` +
    `${minutos.padStart(2, "0")}' ` +
    `${segEnteros.padStart(2, "0")}.${segDecimal}"`
  );
}

/**
 * Crea un inspector para mostrar y modificar propiedades de una estrella.
 *
 * @param {HTMLCanvasElement} canvas Canvas al que se devuelve el foco al cerrar.
 * @param {object} [opciones] Funciones de notificación del inspector.
 * @param {(indice: number, cambio: {tipo: string, delta: number}) => void}
 * [opciones.alCambiar] Se llama cuando cambia la escala activa.
 * @param {(abierto: boolean, indice: number) => void}
 * [opciones.alCambiarEstadoAbierto] Se llama al abrir o cerrar el inspector.
 * @returns {{
 *   abrir: (estrella: object, indice: number) => void,
 *   cerrar: () => void,
 *   refrescar: (estrella: object) => void,
 *   estaAbierto: () => boolean
 * }} Métodos para controlar el inspector.
 */
export function crearInspector(
  canvas,
  { alCambiar, alCambiarEstadoAbierto } = {},
) {
  const contenedor = document.createElement("div");
  contenedor.className = "inspector-contenedor";
  contenedor.hidden = false;

  const tarjeta = document.createElement("div");
  tarjeta.className = "inspector-tarjeta";
  tarjeta.hidden = true;
  tarjeta.setAttribute("role", "dialog");
  tarjeta.setAttribute("aria-labelledby", "inspector-titulo");
  tarjeta.tabIndex = -1;

  const titulo = document.createElement("h2");
  titulo.id = "inspector-titulo";

  const tabla = document.createElement("table");
  tabla.className = "inspector-tabla";

  const cuerpo = document.createElement("tbody");
  tabla.appendChild(cuerpo);

  const botonCerrar = document.createElement("button");
  botonCerrar.type = "button";
  botonCerrar.className = "inspector-cerrar";
  botonCerrar.textContent = "×";
  botonCerrar.setAttribute("aria-label", "Cerrar");

  // Orden DOM: título → tabla → × (el × es absolute y no empuja nada).
  tarjeta.append(titulo, tabla, botonCerrar);
  contenedor.appendChild(tarjeta);

  // Permite devolver el foco al canvas al cerrar el inspector.
  canvas.setAttribute("tabindex", "0");

  let abierto = false;
  let indice = -1; // Índice del vértice/dato de la estrella abierta (llega desde interacción).
  let escalaActiva = "distancia"; // Escala activa del par −/+ externo y del teclado.
  let timerDestello = null; // Destello (~400 ms) de la fila de la escala activa al emitir un cambio.
  let elementosDestello = []; // Todos los elementos iluminados por el destello actual.

  /** Notifica al consumidor (simulación) un cambio de escala, si hay una estrella seleccionada. */
  function emitirCambio(cambio) {
    if (typeof alCambiar === "function" && indice >= 0) {
      alCambiar(indice, cambio);
    }
  }

  /** Notifica al consumidor el estado actual del inspector (apertura/cierre). */
  function emitirEstadoAbierto(abierto, indice) {
    if (typeof alCambiarEstadoAbierto === "function") {
      alCambiarEstadoAbierto(abierto, indice);
    }
  }

  /**
   * Emite un cambio de una unidad en la escala activa y anima las filas relacionadas.
   *
   * @param {"+" | "-"} signo Dirección del cambio.
   */
  function emitirEscala(signo) {
    const delta = 1;

    emitirCambio({ tipo: escalaActiva, delta: signo === "+" ? delta : -delta });
    destellar();
  }

  /** Retira la clase de destello de todos los elementos afectados y lo vacía. */
  function apagarDestello() {
    for (const elemento of elementosDestello) {
      elemento.classList.remove("inspector-destello");
    }

    elementosDestello = [];
  }

  /**
   * Ilumina la fila de la escala activa y las celdas relacionadas.
   * un único setTimeout de ~400 ms apaga todo el conjunto (limpiando el timeout anterior si aún corría).
   */
  function destellar() {
    const nuevos = [];
    const filaPropia = cuerpo.querySelector(`tr[data-tipo="${escalaActiva}"]`);

    if (filaPropia) nuevos.push(filaPropia);

    for (const tipo of DESTELLO_CRUZADO[escalaActiva] ?? []) {
      const fila = cuerpo.querySelector(`tr[data-tipo="${tipo}"]`);
      if (fila) nuevos.push(...fila.querySelectorAll("td"));
    }

    if (nuevos.length === 0) return;

    apagarDestello(); // retira restos de un destello anterior (si aún ardían)
    elementosDestello = nuevos;

    for (const elemento of elementosDestello) {
      elemento.classList.add("inspector-destello");
    }

    if (timerDestello) clearTimeout(timerDestello);

    timerDestello = setTimeout(() => {
      apagarDestello();
      timerDestello = null;
    }, 400);
  }

  /** Crea los botones de incremento y decremento de la escala activa. */
  function crearControlesFila() {
    const controles = document.createElement("span");
    controles.className = "inspector-controles";

    for (const signo of ["−", "+"]) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "inspector-control";
      boton.textContent = signo;
      boton.addEventListener("click", () => {
        emitirEscala(signo === "+" ? "+" : "-");
      });

      controles.appendChild(boton);
    }

    refrescarAriaControles(controles);
    return controles;
  }

  /**
   * Actualiza las etiquetas accesibles de los controles según la escala activa.
   *
   * @param {HTMLElement} controles Contenedor de los botones de escala.
   */
  function refrescarAriaControles(controles) {
    const nombre = escalaActiva === "vmag" ? "Vmag" : "Distancia";

    for (const boton of controles.querySelectorAll(".inspector-control")) {
      const accion = boton.textContent === "+" ? "Aumentar" : "Disminuir";
      boton.setAttribute("aria-label", `${accion} ${nombre}`);
    }
  }

  // Barra de controles hermana de la tarjeta; se crea una sola vez.
  const escala = document.createElement("div");
  escala.className = "inspector-escala";
  escala.hidden = true;

  const controlesEscala = crearControlesFila();
  escala.appendChild(controlesEscala);
  contenedor.append(escala);
  document.body.appendChild(contenedor);

  /**
   * Renderiza el título y las filas con los datos de una estrella.
   *
   * @param {object} estrella Datos de la estrella.
   */
  function renderizar(estrella) {
    if (timerDestello) {
      clearTimeout(timerDestello);
      timerDestello = null;
    }
    apagarDestello();

    const nombre = dict_hip_completo[estrella.hip];
    titulo.textContent = nombre
      ? `Estrella HIP ${estrella.hip} · ${nombre}`
      : `Estrella HIP ${estrella.hip}`;

    const filas = FILAS.map(
      ([etiqueta, obtener, control, destacada, tipoFila]) => {
        const fila = document.createElement("tr");

        if (destacada) {
          fila.className = "inspector-destacada";
        } else if (!control) {
          fila.classList.add("inspector-fila-simple");
        }
        const encabezado = document.createElement("th");
        encabezado.scope = "row";

        if (control) {
          fila.dataset.tipo = control.tipo;

          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = "inspector-escala";
          radio.value = control.tipo;
          radio.checked = control.tipo === escalaActiva;
          radio.addEventListener("change", () => {
            if (!radio.checked) return;

            escalaActiva = control.tipo;
            refrescarAriaControles(controlesEscala);
          });

          const label = document.createElement("label");
          label.append(radio, etiqueta);
          encabezado.append(label);
        } else {
          // Fila sin control con tipo propio (años luz → 'ly') para destellar sus td.
          if (tipoFila) fila.dataset.tipo = tipoFila;
          encabezado.textContent = etiqueta;
        }

        const celda = document.createElement("td");
        celda.textContent = obtener(estrella);
        fila.append(encabezado, celda);

        return fila;
      },
    );

    cuerpo.replaceChildren(...filas);
  }

  /**
   * Abre el inspector para una estrella y comunica su selección.
   *
   * @param {object} estrella Datos de la estrella.
   * @param {number} i Índice de la estrella.
   */
  function abrir(estrella, i) {
    indice = i;
    renderizar(estrella);
    tarjeta.hidden = false;
    escala.hidden = false;
    abierto = true;
    tarjeta.focus();

    emitirEstadoAbierto(true, indice);
  }

  /** Cierra el inspector y devuelve el foco al canvas. */
  function cerrar() {
    if (!abierto) return;

    abierto = false;
    indice = -1;
    tarjeta.hidden = true;
    escala.hidden = true;
    canvas.focus();

    // La guarda `if (!abierto) return` de arriba evita dobles emisiones;
    // Escape pasa por cerrar() → queda cubierto.
    emitirEstadoAbierto(false, -1);
  }

  /**
   * Actualiza el contenido del inspector sin cambiar su visibilidad ni el foco.
   *
   * @param {object} estrella Datos actualizados de la estrella.
   */
  function refrescar(estrella) {
    if (!abierto) return;
    renderizar(estrella);
  }

  botonCerrar.addEventListener("click", cerrar);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && abierto) {
      cerrar();
      return;
    }

    if (!abierto) return;

    let signo = "";
    if (evento.key === "+" || evento.key === "=") signo = "+";
    else if (evento.key === "-" || evento.key === "−") signo = "-";
    else return;

    evento.preventDefault();
    emitirEscala(signo);
  });

  return { abrir, cerrar, refrescar, estaAbierto: () => abierto };
}
