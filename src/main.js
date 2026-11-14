import "./styles/index.css";
import "./styles/perfiles.css";

import * as THREE from "three";

// ESCENA
import { crearCamara } from "./escena/camara.js";
import { crearControles } from "./escena/controles.js";
import { crearEscena } from "./escena/escena.js";
import { agregarLuces } from "./escena/luces.js";
import { crearMarcador } from "./escena/marcador.js";
import { aplicarPaleta } from "./escena/paleta.js";
import {
  ajustarEnRedimensionamiento,
  crearEtiquetasRenderer,
  inicializarRenderer,
} from "./escena/renderer.js";

// UI
import { mostrarAviso } from "./ui/avisos.js";
import { crearAyuda } from "./ui/ayuda.js";
import { crearBuscador } from "./ui/buscador.js";
import { crearInspector } from "./ui/inspector.js";
import { crearPerfiles } from "./ui/perfiles.js";
// import { crearPanelesStats } from "./ui/stats.js";

// RETICULA
// import { crearAxesHelper } from "./reticula/ejes.js";
import { crearEsferaCeleste } from "./reticula/esferaCeleste.js";
import { crearEtiquetas } from "./reticula/etiquetas.js";

// ESTRELLAS
import { cargarEstrellas } from "./estrellas/datos.js";
import {
  aCoordenadasThree,
  crearCampoEstrellas,
  ESCALA,
} from "./estrellas/estrellas.js";
import { crearSimulacion } from "./estrellas/simulacion.js";

// INTERACCION
import { crearEnfoque } from "./interaccion/enfoque.js";
import { crearInteraccion } from "./interaccion/interaccion.js";

const app = document.querySelector("#app");

// función de inicio
async function iniciar() {
  // RENDERER
  const renderer = inicializarRenderer(app);
  if (!renderer) return;

  // SCENE
  const escena = crearEscena();
  // CAMERA
  const camara = crearCamara(window.innerWidth / window.innerHeight);
  // CONTROLS
  const controles = crearControles(camara, renderer.domElement);
  // FOCUS
  // Crea el enfoque animado y el buscador cuando la cámara, los controles.
  const enfoque = crearEnfoque({ camara, controles });

  // RENDERER CSS2D
  // Crea el renderizador HTML para las etiquetas de la retícula celeste.
  const css2dRenderer = crearEtiquetasRenderer(app);
  css2dRenderer.setSize(window.innerWidth, window.innerHeight);

  // LIGHTS
  agregarLuces(escena);

  // AXES HELPER
  // escena.add(crearAxesHelper());

  // GRID, RETICULA ECUATORIAL
  escena.add(crearEsferaCeleste());

  // ETIQUETAS
  // Añade las etiquetas de ascensión recta, declinación y puntos cardinales.
  const etiquetas = crearEtiquetas();
  escena.add(...etiquetas.objetos);

  let marcador = null;
  let simulacion = null;

  const inspector = crearInspector(renderer.domElement, {
    alCambiar: (indice, cambio) => {
      // cuando los controles modifiquen las magnitudes
      simulacion?.aplicar(indice, cambio);
    },
    alCambiarEstadoAbierto: (abierto, indice) => {
      // cuando se abra o cierra el inspector
      if (abierto) {
        marcador?.mostrar(indice);
      } else {
        marcador?.ocultar();
        enfoque.limpiar();
      }
    },
    alRecentrar: ({ ndcY, distanciaEstrella }) => {
      enfoque.recentrar(ndcY, {
        duracion: 300,
        distancia:
          distanciaEstrella == null ? undefined : distanciaEstrella * ESCALA,
      });
    },
    // Un gesto nuevo sobre la hoja cancela el recentrado en curso.
    alIniciarGestoHoja: () => enfoque.cancelar(),
  });

  // Crea el tour de ayuda, con contenido estático y sin datos.
  // El botón «?» registra su propio listener.
  //
  // La API de ayuda sí se consume: `estaAbierto()` se usa en la consulta
  // de bloqueo del ciclo de inactividad. Por eso se crea aquí,
  // antes del `try`, y no dentro del callback del buscador.
  crearAyuda();

  // STATS
  // const panelesStats = crearPanelesStats();

  // Selector de perfiles de color
  crearPerfiles({ alCambiarPerfil: () => aplicarPaleta() });

  try {
    const datos = await cargarEstrellas();
    // STARS
    const campoEstrellas = crearCampoEstrellas(datos);
    escena.add(campoEstrellas);

    // TARGET
    marcador = crearMarcador({ escena, campoEstrellas });

    // INTERACTION
    const interaccion = crearInteraccion({
      escena,
      camara,
      domElement: renderer.domElement,
      campoEstrellas,
      datos,
      marcador,
      alSeleccionar: (estrella, indice) => {
        enfoque.limpiar();
        inspector.abrir(estrella, indice);
      },
      alHacerClicEnVacio: () => inspector.cerrarSiHoja(),
    });

    // SEARCH
    crearBuscador({
      datos,
      alSeleccionar: (indice) => {
        const estrella = datos[indice];

        // Convierte las coordenadas de la estrella a un vector de Three.js.
        const direccion = new THREE.Vector3(
          ...aCoordenadasThree(estrella.x, estrella.y, estrella.z, 1),
        ).normalize();

        /**inactividad.marcarActividad();*/

        // Abre la ficha de la estrella seleccionada (igual que un click).
        inspector.abrir(estrella, indice);

        // Centra la estrella con una rotación animada de la cámara.
        enfoque.enfocar(direccion, {
          ndcY: inspector.ndcY(),
          distancia: estrella.distancia * ESCALA,
        });
      },
    });

    // SIMULATION
    simulacion = crearSimulacion({
      campoEstrellas,
      datos,
      alRefrescar: (estrella) => inspector.refrescar(estrella),
      alMoverResaltado: (indice) => interaccion.actualizarResaltado(indice),
    });
  } catch (error) {
    // La escena sigue siendo navegable (retícula y ejes) sin estrellas.
    mostrarAviso(`No se pudieron cargar las estrellas: ${error.message}`);
  }

  // RESIZE
  window.addEventListener("resize", () => {
    // Ajusta ambos renderizadores al cambiar el tamaño de la ventana.
    css2dRenderer.setSize(window.innerWidth, window.innerHeight);
    ajustarEnRedimensionamiento(renderer, camara);
  });

  // M1: mide el tiempo real entre frames para que
  // `controles.update(delta)` use el modo basado en tiempo de OrbitControls
  // (`delta · 2π/60 · speed`, en radianes por segundo).
  //
  // Sin `delta`, el giro depende de la frecuencia de actualización: a 120 Hz,
  // la cámara giraría el doble de rápido que a 60 Hz. Con `deltaTime`, el
  // periodo es de aproximadamente 3 min 20 s (`speed = 0.3`), tanto a 30 como
  // a 60 o 120 Hz. Solo los controles usan el delta; las etiquetas y el render
  // no lo necesitan.
  //
  // `Timer` sustituye al reloj deprecado desde r183. `connect(document)`
  // habilita la Page Visibility API: al ocultar la pestaña, el delta pasa a 0;
  // al volver, el temporizador se rearma y evita un salto de cámara.
  const timer = new THREE.Timer();
  timer.connect(document);

  // Actualiza controles, etiquetas, escena y estadísticas en cada fotograma.
  renderer.setAnimationLoop(() => {
    // Actualiza el temporizador antes de leer el delta. Así, el valor del
    // frame queda fijado aunque `getDelta()` se consulte varias veces.
    timer.update();
    controles.update(timer.getDelta());

    // Actualiza las etiquetas antes de renderizar: CSS2DRenderer proyecta
    // sus posiciones durante `render()`. Si se actualizan después, se verían
    // con las posiciones del frame anterior.
    etiquetas.actualizar(camara, window.innerWidth, window.innerHeight);

    renderer.render(escena, camara);
    // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
    css2dRenderer.render(escena, camara);

    // panelesStats.forEach((panel) => panel.update());
  });
}

iniciar();
