// Tour de ayuda instructiva.
// Módulo de UI aislado: JS plano, contenido estático en español,
// sin datos, sin persistencia y sin dependencias nuevas (apertura solo
// manual, sin "no volver a mostrar").

// ── Plantilla de contacto (edita estos tres valores a tu gusto) ───────────
const NOMBRE_AUTOR = "Eric.";
// const CORREO_AUTOR = "erictorres.velasco@gmail.com";
const WEB_URL = "https://ciretorres.github.io/";
const REPO_URL = "https://github.com/ciretorres/thesis-project";
const TESIS_NAME =
  "Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica";
const TESIS_URL =
  "https://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf";

/**
 * Crea un párrafo a partir de contenido HTML estático y de confianza.
 *
 * El contenido debe estar definido en este archivo; no se debe pasar
 * texto procedente de usuarios ni de fuentes externas.
 *
 * @param {string} texto Contenido HTML del párrafo.
 * @returns {HTMLParagraphElement} El párrafo creado.
 */
function parrafo(texto) {
  const p = document.createElement("p");
  p.innerHTML = texto;
  return p;
}

/**
 * Crea un enlace a partir de un texto y una URL.
 *
 * El texto se inserta como texto plano, no como HTML.
 *
 * @param {string} texto Texto que se mostrará en el enlace.
 * @param {string} url Dirección a la que apunta el enlace.
 * @returns {HTMLAnchorElement} El enlace creado.
 */
function enlace(texto, url) {
  const a = document.createElement("a");
  a.textContent = texto;
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";

  return a;
}

const PASOS = [
  {
    titulo: "¡Bienvenida!",
    contenido: (caja) => {
      caja.append(
        parrafo(
          "Esta <i>interfaz-interactiva</i> lúdica visualiza de forma pedagógica el fenómeno astronómico del <strong>módulo distancia</strong>.",
        ),
        parrafo(
          "¿Cómo es que el brillo que percibimos de las estrellas puede ser distinto de su brillo real? ¿Y cómo es que la distancia a la que se encuentran de nosotros, se relaciona con el tiempo que tarda su luz en llegar hasta nosotros?",
        ),
        parrafo(
          "Explora la diferencia entre el brillo real y aparente de las estrellas modificando su luminosidad y distancia.",
        ),
      );
    },
  },
  {
    titulo: "¡Comienza!",
    contenido: (caja) => {
      const ol = document.createElement("ol");

      const comienza = [
        "Arrastra con el dedo o el ratón sobre el cielo para <strong>orbitar</strong> alrededor de la nube de estrellas.",
        "Haz <strong>clic o tap en una estrella</strong> para seleccionarla y abrir su ficha con nombre, magnitud y distancia.",
        "En la ficha puedes <strong>aumentar o disminuir</strong> la magnitud aparente o distancia para observar el fenómeno del brillo.",
        "Mira cómo cambia la distancia de la estrella en relación con el brillo en tiempo real.",
      ];

      comienza.forEach((d) => {
        const li = document.createElement("li");
        li.append(parrafo(d));
        ol.append(li);
      });

      caja.append(ol);
    },
  },
  {
    titulo: "El fenómeno del módulo distancia",
    contenido: (caja) => {
      caja.append(
        parrafo(
          "Muchas estrellas parecen débiles solo por estar lejos, no por ser intrínsecamente tenues. El <strong>módulo distancia</strong> de la ficha te deja simular cuánto brillaría una estrella si estuviera más cerca.",
        ),
        parrafo(
          "No porque una estrella que parece que brilla más que la otra significa que está más grande o es más grande. Si no que puede ser que la otra esté más lejos y brilla más en comparación con la primera que puede estar más cerca y brillar menos.",
        ),
        parrafo(
          "Una estrella poco luminosa puede verse brillante si está cerca de nosotros o una estrella muy luminosa puede verse tenue si está muy lejos.",
        ),
      );
    },
  },
  {
    titulo: "Busca por nombre de la estrella o HIP",
    contenido: (caja) => {
      const ol = document.createElement("ol");
      const buscar = [
        "Escribe en el <strong>buscador</strong> (arriba del cielo) un nombre o un número <strong>HIP</strong> que identifique a la estrella.",
        "Al elegir una coincidencia, la cámara <strong>enfoca</strong> la estrella y se abre su ficha.",
        "Al elegir, el campo queda <strong>limpio</strong> y listo para la siguiente búsqueda.",
      ];
      buscar.forEach((d) => {
        const li = document.createElement("li");
        li.append(parrafo(d));
        ol.append(li);
      });

      const tituloReticula = document.createElement("h2");
      tituloReticula.innerText = "La retícula de referencia";
      const reticula =
        "La <strong>red ecuatorial y el horizonte</strong> con etiquetas de horas de ascensión recta, grados de declinación y cardinales te orientan en el cielo. Úsala como referencia mientras orbitas para no perderte entre las estrellas.";

      caja.append(ol, tituloReticula, parrafo(reticula));
    },
  },
  {
    titulo: "Contacto",
    contenido: (caja) => {
      const ul = document.createElement("ul");
      ul.className = "ayuda-contacto-nombre";

      // repositorio
      const lineaRepositorio = document.createElement("li");
      const enlaceRepositorio = enlace(REPO_URL, REPO_URL);

      lineaRepositorio.append(
        parrafo("<strong>Github</strong> repositorio con código."),
      );
      lineaRepositorio.append(enlaceRepositorio);

      // nombre
      const nombre = document.createElement("li");
      const enlaceSitioWeb = enlace(WEB_URL, WEB_URL);

      nombre.append(parrafo("<strong>Autor</strong> " + NOMBRE_AUTOR));
      nombre.append(enlaceSitioWeb);

      // tesis
      const lineaTesis = document.createElement("li");
      const enlaceTesis = enlace(TESIS_NAME, TESIS_URL);

      lineaTesis.append(parrafo("<strong>Tesis</strong> proyecto."));
      lineaTesis.append(enlaceTesis);

      ul.append(lineaRepositorio, lineaTesis, nombre);
      caja.append(ul);
    },
  },
];

/**
 * Crea e inicializa el botón de ayuda y el diálogo del recorrido guiado.
 *
 * Añade a `document.body` un botón fijo para abrir la ayuda y un diálogo modal
 * que permite recorrer los pasos definidos en `PASOS`. El diálogo se puede
 * cerrar con sus controles, haciendo clic en el fondo o pulsando Escape.
 * Las flechas izquierda y derecha permiten cambiar de paso, y Tab queda
 * limitado a los botones visibles del diálogo.
 *
 * Requiere que `PASOS` esté definido en el ámbito y que cada paso tenga
 * las propiedades `titulo` y `contenido`. La función crea los elementos
 * del DOM y registra sus manejadores de eventos.
 *
 * @returns {{
 *   abrir: () => void,
 *   cerrar: () => void,
 *   estaAbierto: () => boolean
 * }} Métodos para abrir y cerrar el recorrido, y consultar si está abierto.
 */
export function crearAyuda() {
  // El botón «?» se añade directamente al body para que no quede limitado por
  // el contexto de apilamiento del inspector.
  const disparador = document.createElement("button");
  disparador.type = "button";
  disparador.className = "ayuda-disparador";
  disparador.textContent = "?";
  disparador.setAttribute("aria-label", "Ayuda");
  document.body.appendChild(disparador);

  // El fondo modal (vackdrop) cubre el resto de la interfaz y recibe los clics fuera
  // del diálogo. Permanece oculto hasta que se abre el recorrido.
  const backdrop = document.createElement("div");
  backdrop.className = "ayuda-backdrop";
  backdrop.hidden = true; // tour cerrado al inicio

  // El diálogo se etiqueta con el título del paso activo (id estable ayuda-titulo)
  // y recibe el foco al abrirse.
  const dialogo = document.createElement("div");
  dialogo.className = "ayuda-dialogo";
  dialogo.setAttribute("role", "dialog");
  dialogo.setAttribute("aria-modal", "true");
  dialogo.setAttribute("aria-labelledby", "ayuda-titulo");
  dialogo.tabIndex = -1;

  const botonCerrar = document.createElement("button");
  botonCerrar.type = "button";
  botonCerrar.className = "ayuda-cerrar";
  botonCerrar.textContent = "×";
  botonCerrar.setAttribute("aria-label", "Cerrar ayuda");

  const titulo = document.createElement("h2");
  titulo.id = "ayuda-titulo";

  const cajaContenido = document.createElement("div");
  cajaContenido.className = "ayuda-contenido";

  // Cada indicador permite ir directamente al paso correspondiente, aria-label="Paso N".
  const puntos = document.createElement("div");
  puntos.className = "ayuda-puntos";
  const botonesPaso = PASOS.map((_, i) => {
    const punto = document.createElement("button");
    punto.type = "button";
    punto.className = "ayuda-punto";
    punto.setAttribute("aria-label", `Paso ${i + 1}`);
    puntos.appendChild(punto);
    return punto;
  });

  const contador = document.createElement("span");
  contador.className = "ayuda-contador";

  const acciones = document.createElement("div");
  acciones.className = "ayuda-acciones";

  const botonAnterior = document.createElement("button");
  botonAnterior.type = "button";
  botonAnterior.className = "ayuda-boton";
  botonAnterior.textContent = "Anterior";
  botonAnterior.setAttribute("aria-label", "Paso anterior");

  const botonSiguiente = document.createElement("button");
  botonSiguiente.type = "button";
  botonSiguiente.className = "ayuda-boton";
  botonSiguiente.textContent = "Siguiente";
  botonSiguiente.setAttribute("aria-label", "Paso siguiente");

  const botonSaltar = document.createElement("button");
  botonSaltar.type = "button";
  botonSaltar.className = "ayuda-boton ayuda-saltar";
  botonSaltar.textContent = "Saltar";
  botonSaltar.setAttribute("aria-label", "Saltar la ayuda");

  acciones.append(botonAnterior, botonSiguiente, botonSaltar);

  dialogo.append(
    botonCerrar,
    titulo,
    cajaContenido,
    puntos,
    contador,
    acciones,
  );
  backdrop.appendChild(dialogo);
  document.body.appendChild(backdrop);

  // Estado del recorrido: índice del paso actual (0-based) y estado de apertura (backdrop.hidden).
  let indicePaso = 0;
  let abierto = false;

  // Actualiza el contenido, el progreso y los controles según el paso activo.
  function renderPaso() {
    titulo.textContent = PASOS[indicePaso].titulo;
    cajaContenido.replaceChildren();
    PASOS[indicePaso].contenido(cajaContenido);
    contador.textContent = `${indicePaso + 1}/${PASOS.length}`;

    botonesPaso.forEach((punto, i) =>
      punto.classList.toggle("activa", i === indicePaso),
    );

    botonAnterior.hidden = indicePaso === 0;
    botonSiguiente.textContent =
      indicePaso === PASOS.length - 1 ? "Finalizar" : "Siguiente";
  }

  // Inicia el recorrido en el primer paso y mueve el foco al diálogo.
  function abrir() {
    indicePaso = 0;
    renderPaso();
    abierto = true;
    backdrop.hidden = false;
    dialogo.focus();
  }

  // Oculta el diálogo y devuelve el foco al botón que lo abrió.
  function cerrar() {
    abierto = false;
    backdrop.hidden = true;
    disparador.focus(); // el foco siempre vuelve al botón ?
  }

  // Indica si el recorrido está abierto.
  function estaAbierto() {
    return abierto;
  }

  // Cambia al paso indicado, limitando el índice al rango válido.
  function irAlPaso(n) {
    indicePaso = Math.min(Math.max(n, 0), PASOS.length - 1);
    renderPaso();
  }

  // ── Navegación ──────────────────────────────────────────────────────────

  // Controles para avanzar, retroceder o saltar directamente a un paso.
  botonAnterior.addEventListener("click", () => irAlPaso(indicePaso - 1));
  botonSiguiente.addEventListener("click", () => {
    // En el último paso el botón dice "Finalizar" y cierra el tour.
    if (indicePaso === PASOS.length - 1) cerrar();
    else irAlPaso(indicePaso + 1);
  });
  botonSaltar.addEventListener("click", cerrar);
  botonesPaso.forEach((punto, i) =>
    punto.addEventListener("click", () => irAlPaso(i)),
  );

  // ── Cierres ─────────────────────────────────────────────────────────────

  // Cierre desde los botones o al hacer clic fuera del diálogo.
  botonCerrar.addEventListener("click", cerrar);
  disparador.addEventListener("click", abrir);
  backdrop.addEventListener("click", (evento) => {
    if (evento.target === backdrop) cerrar();
  });

  // ── Teclado global (único listener en document) ─────────────────────────

  // Mientras el recorrido está abierto, Escape lo cierra y las flechas
  // cambian de paso. La captura permite gestionar Escape antes que otros
  // manejadores registrados en fases posteriores.
  document.addEventListener(
    "keydown",
    (evento) => {
      if (!abierto) return; // tour cerrado → no interviene nunca (inspector intacto)

      if (evento.key === "Escape") {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        cerrar();
      } else if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        irAlPaso(indicePaso - 1);
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        irAlPaso(indicePaso + 1);
      }
    },
    { capture: true },
  );

  // ── Trampa de foco ──────────────────────────────────────────────────────

  // Mantiene la navegación con Tab dentro de los botones visibles del diálogo.
  dialogo.addEventListener("keydown", (evento) => {
    if (evento.key !== "Tab") return;

    const focuseables = [...dialogo.querySelectorAll("button")].filter(
      (el) => !el.hidden && el.offsetParent !== null,
    );
    if (focuseables.length === 0) return;

    const primero = focuseables[0];
    const ultimo = focuseables[focuseables.length - 1];
    const dentro = focuseables.includes(document.activeElement);

    if (evento.shiftKey && (!dentro || document.activeElement === primero)) {
      ultimo.focus();
      evento.preventDefault();
    } else if (
      !evento.shiftKey &&
      (!dentro || document.activeElement === ultimo)
    ) {
      primero.focus();
      evento.preventDefault();
    }
  });

  return { abrir, cerrar, estaAbierto };
}
