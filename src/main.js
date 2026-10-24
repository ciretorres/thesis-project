import "./styles/index.css";

import * as THREE from "three";

import { crearCamara } from "./escena/camara.js";
import { crearControles } from "./escena/controles.js";
import { crearEscena } from "./escena/escena.js";
import { agregarLuces } from "./escena/luces.js";
import {
  ajustarEnRedimensionamiento,
  inicializarRenderer,
} from "./escena/renderer.js";

import { crearAxesHelper } from "./reticula/ejes.js";

import { crearAyuda } from "./ui/ayuda.js";
import { crearPanelesStats } from "./ui/stats.js";

const app = document.querySelector("#app");

// variables globales
let camara, lastCameraPosition;
let renderer, labelCSS2DRenderer;
let controles, orbit, escena, stats, ayuda;
let data;

// función de inicio
async function iniciar() {
  // RENDERER
  renderer = inicializarRenderer(app);
  if (!renderer) return;

  // SCENE
  escena = crearEscena();
  // CAMERA
  camara = crearCamara(window.innerWidth / window.innerHeight);
  // CONTROLS
  controles = crearControles(camara, renderer.domElement);

  // LIGHTS
  agregarLuces(escena);

  // AXES HELPER
  escena.add(crearAxesHelper());

  // Crea el tour de ayuda, con contenido estático y sin datos.
  // El botón «?» registra su propio listener.
  //
  // La API de ayuda sí se consume: `estaAbierto()` se usa en la consulta
  // de bloqueo del ciclo de inactividad. Por eso se crea aquí,
  // antes del `try`, y no dentro del callback del buscador.
  ayuda = crearAyuda();

  // STATS
  const panelesStats = crearPanelesStats();

  // RESIZE
  window.addEventListener("resize", () => {
    // ajustarEnRedimensionamiento solo cubre WebGL; el CSS2D necesita su propio setSize.
    // css2dRenderer.setSize(window.innerWidth, window.innerHeight);
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

  renderer.setAnimationLoop(() => {
    // Actualiza el temporizador antes de leer el delta. Así, el valor del
    // frame queda fijado aunque `getDelta()` se consulte varias veces.
    timer.update();
    controles.update(timer.getDelta());

    // Actualiza las etiquetas antes de renderizar: CSS2DRenderer proyecta
    // sus posiciones durante `render()`. Si se actualizan después, se verían
    // con las posiciones del frame anterior.
    // etiquetas.actualizar(camara, window.innerWidth, window.innerHeight);

    renderer.render(escena, camara);
    // css2dRenderer.render(escena, camara);

    panelesStats.forEach((panel) => panel.update());
  });
}

iniciar();
