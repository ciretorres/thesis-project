import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { RADIO, aCoordenadasThree, aRad } from "./geometria.js";

/**
 * Formatea una hora de ascensión recta con el sufijo `h`.
 *
 * @param {number} h - Hora de ascensión recta.
 * @returns {string} Hora formateada, por ejemplo, `"0h"`, `"1h"`, … `"23h"`.
 */
export function formatearHora(h) {
  return `${h}h`;
}

/**
 * Formatea una declinación en grados, con signo explícito para valores ±
 * positivos o negativos y sin signo para cero.
 *
 * @param {number} g - Declinación en grados.
 * @returns {string} Grado formateado, por ejemplo, `"+20°"`, `"0°"` o `"-30°"`.
 */
export function formatearGrado(g) {
  if (g > 0) return `+${g}°`;
  if (g < 0) return `${g}°`; // el propio `-` del número ya es el signo
  return "0°";
}

// Aplica el estilo compartido de las etiquetas del retículo.
// pointer-events: none evita que intercepten eventos dirigidos al canvas.
function estilizarSpan(span) {
  span.style.fontFamily = "sans-serif";
  span.style.fontSize = "13px";
  span.style.color = "var(--etiqueta-3d)"; // cian claro, versión aclarada de #2A81AD
  span.style.background = "none";
  span.style.whiteSpace = "nowrap";
  span.style.pointerEvents = "none";
  span.style.opacity = "var(--etiqueta-3d-opacidad, 0.9)";
}

// Crea un slot dinámico oculto. actualizar() determina su posición,
// rotación y visibilidad en cada frame.
function crearSlot(texto) {
  const span = document.createElement("span");
  span.textContent = texto;
  estilizarSpan(span);

  const slot = new CSS2DObject(span);
  slot.visible = false;

  return slot;
}

// Crea una etiqueta esférica estática (cardinales N/S/E/O), visible desde el inicio.
function crearEtiquetaEstatica(texto, posicion) {
  const span = document.createElement("span");
  span.textContent = texto;
  estilizarSpan(span);

  const etiqueta = new CSS2DObject(span);
  etiqueta.position.set(posicion[0], posicion[1], posicion[2]);

  return etiqueta;
}

/**
 * Proyecta puntos del espacio mundo a píxeles del viewport.
 *
 * Los puntos situados detrás de la cámara se representan como `null`.
 * La cámara debe tener actualizadas sus matrices antes de llamar a esta función.
 *
 * @param {THREE.Vector3[]} puntosMundo - Puntos en coordenadas mundo.
 * @param {THREE.Camera} camara - Cámara usada para proyectar los puntos.
 * @param {number} ancho - Ancho del viewport en píxeles.
 * @param {number} alto - Alto del viewport en píxeles.
 * @returns {Array<{px: number, py: number, mundo: THREE.Vector3, zCam: number} | null>}
 * Puntos proyectados, con sus coordenadas en píxeles y su profundidad.
 */
export function proyectarPuntos(puntosMundo, camara, ancho, alto) {
  // PRECONDICIÓN: la cámara ya tiene matrixWorld y matrixWorldInverse al día.
  // Esta función se invoca 41 veces por frame (24 meridianos + 17 paralelos),
  // así que NO se actualiza la cámara aquí: quien lo hace es actualizar(),
  // exactamente una vez por frame, ANTES de proyectar. Si algún otro caller
  // la usara por su cuenta, deberá llamar camara.updateMatrixWorld() antes.
  const salida = [];

  for (const punto of puntosMundo) {
    const puntoCamara = punto.clone().applyMatrix4(camara.matrixWorldInverse); // espacio cámara

    if (puntoCamara.z >= 0) {
      salida.push(null); // tras la cámara → no genera cruces
      continue;
    }

    const ndc = puntoCamara.clone().applyMatrix4(camara.projectionMatrix); // NDC (con división por w)

    salida.push({
      px: ((ndc.x + 1) / 2) * ancho, // NDC → píxeles (x crece a la derecha)
      py: ((1 - ndc.y) / 2) * alto, // NDC → píxeles (y crece hacia abajo)
      mundo: punto, // punto original en coordenadas mundo
      zCam: puntoCamara.z, // profundidad negativa (enfrente de la cámara)
    });
  }

  return salida;
}

// Normales hacia fuera de los 4 bordes del viewport:
// 0 izquierda, 1 derecha, 2 superior e 3 inferior.
export const NORMALES_BORDE = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

/**
 * Recorta un segmento A→B contra el rectángulo [0,ancho]×[0,alto] del viewport
 * mediante el algoritmo Liang-Barsky.
 *
 * El segmento se representa paramétricamente como:
 *   (x, y) = (ax, ay) + t · (bx - ax, by - ay), con 0 ≤ t ≤ 1.
 *
 * El algoritmo aplica las restricciones de los cuatro bordes del viewport para
 * encontrar los valores de entrada y salida del segmento. Si los límites son
 * incompatibles, el segmento no atraviesa el viewport y se devuelve un arreglo
 * vacío.
 *
 * Devuelve únicamente los cruces con el rectángulo: no incluye el punto inicial
 * si ya está dentro del viewport (t = 0), ni el punto final si también está
 * dentro (t = 1). Los cruces se ordenan según el recorrido desde el punto inicial
 * hacia el final.
 *
 * Los valores de `borde` identifican el borde que determina cada cruce:
 * 0 = izquierda, 1 = derecha, 2 = superior, 3 = inferior. Puede ser `null` si
 * el cruce no tiene un borde asociado.
 *
 * @param {number} ax - Coordenada x inicial del segmento.
 * @param {number} ay - Coordenada y inicial del segmento.
 * @param {number} bx - Coordenada x final del segmento.
 * @param {number} by - Coordenada y final del segmento.
 * @param {number} ancho - Ancho del viewport. Sus límites horizontales son 0 y ancho.
 * @param {number} alto - Alto del viewport. Sus límites verticales son 0 y alto.
 * @returns {Array<{x: number, y: number, t: number, borde: number | null}>}
 * Cruces con el borde, ordenados según el segmento. Devuelve un arreglo vacío []
 * si el segmento no cruza el viewport.
 */
export function liangBarsky(ax, ay, bx, by, ancho, alto) {
  const dx = bx - ax;
  const dy = by - ay;
  let t0 = 0; // corresponde al punto inicial.
  let t1 = 1; // corresponde al punto final.

  // Una fila por borde: (p, q) con la desigualdad p·t ≤ q.
  const filas = [
    [-dx, ax], // izquierda: x ≥ 0
    [dx, ancho - ax], // derecha: x ≤ ancho
    [-dy, ay], // superior: y ≥ 0 (y crece hacia abajo)
    [dy, alto - ay], // inferior: y ≤ alto
  ];

  let bordeEntrada = null;
  let bordeSalida = null;

  for (let i = 0; i < filas.length; i += 1) {
    const p = filas[i][0];
    const q = filas[i][1];

    if (p === 0) {
      if (q < 0) return []; // paralelo al borde y completamente fuera
      continue;
    }

    const r = q / p;

    if (p < 0) {
      // Límite de entrada (mueve t0 hacia adelante).
      if (r > t0) {
        t0 = r;
        bordeEntrada = i;
      }
    } else {
      // Límite de salida (mueve t1 hacia atrás).
      if (r < t1) {
        t1 = r;
        bordeSalida = i;
      }
    }

    if (t0 > t1) return []; // recorte vacío → no cruza el rect
  }

  const cruces = [];

  if (t0 > 0)
    cruces.push({
      x: ax + dx * t0,
      y: ay + dy * t0,
      t: t0,
      borde: bordeEntrada,
    });

  if (t1 < 1)
    cruces.push({
      x: ax + dx * t1,
      y: ay + dy * t1,
      t: t1,
      borde: bordeSalida,
    });

  return cruces;
}

/**
 * Detecta los cruces de una polilínea proyectada con los bordes del viewport.
 *
 * Omite los segmentos con extremos detrás de la cámara y los que están
 * completamente dentro del viewport.
 *
 * @param {Array<{px: number, py: number, mundo: THREE.Vector3, zCam: number} | null>}
 * proyectados - Puntos proyectados que forman la polilínea.
 * @param {number} ancho - Ancho del viewport.
 * @param {number} alto - Alto del viewport.
 * @returns {Array<{x: number, y: number, t: number, borde: number, u: {x: number, y: number}, mundo: THREE.Vector3, zCam: number}>}
 * Cruces encontrados, con tangente, posición en el espacio mundo y profundidad.
 */
export function detectarCrucesDePolilinea(proyectados, ancho, alto) {
  const cruces = [];

  for (let i = 0; i < proyectados.length - 1; i += 1) {
    const a = proyectados[i];
    const b = proyectados[i + 1];

    if (a === null || b === null) continue; // extremo tras la cámara

    const dentroDe = (p) =>
      p.px >= 0 && p.px <= ancho && p.py >= 0 && p.py <= alto;

    if (dentroDe(a) && dentroDe(b)) continue; // segmento contenido: no toca el borde

    const dx = b.px - a.px;
    const dy = b.py - a.py;
    const largo = Math.hypot(dx, dy);

    if (largo === 0) continue; // segmento degenerado en pantalla

    for (const cruce of liangBarsky(a.px, a.py, b.px, b.py, ancho, alto)) {
      cruces.push({
        x: cruce.x,
        y: cruce.y,
        t: cruce.t,
        borde: cruce.borde,
        u: { x: dx / largo, y: dy / largo }, // tangente unitaria en pantalla
        mundo: a.mundo.clone().lerp(b.mundo, cruce.t), // punto 3D de la cruce
        zCam: a.zCam + (b.zCam - a.zCam) * cruce.t, // profundidad interpolada
      });
    }
  }

  return cruces;
}

// Altura media del texto (fuente de 13 px): separa la etiqueta de la línea
// que la genera, perpendicular a ella.
const MEDIA_ALTURA_TEXTO = 7; // px

// Margen mínimo entre la CAJA ROTADA del texto y cada borde del viewport,
// tras el clamp (se exigen ~2 px como mínimo; se usan 4 para holgura).
const MARGEN_ETIQUETA = 4; // px

// Umbral de salto por ángulo agudo heredado de Stellarium (|dot(u, v)|):
// por debajo, la línea casi es paralela al borde que cruza y se omite.
const UMBRAL_ANGULO_AGUDO = 0.25;

// Banda vertical: cerca de ±90° (línea casi vertical, p. ej. el 12h en la
// vista polar inicial) el flip alternaba entre +90° y −90° con el más
// mínimo ruido de la cámara y el texto giraba 180° cada frame (parpadeo
// leyendo de abajo hacia arriba ↔ de arriba hacia abajo). Toda la banda se
// canoniza a +π/2: una sola orientación, continua al rotar la cámara.
const EPS_VERTICAL = aRad(3);

/**
 * Estima el tamaño de una etiqueta cuando aún no se conoce su tamaño real.
 *
 * @param {string} texto - Texto de la etiqueta.
 * @returns {{w: number, h: number}} Tamaño estimado en píxeles.
 */
function cajaEstimada(texto) {
  return { w: texto.length * 8 + 6, h: 18 };
}

// Caja por defecto de geometriaDeEtiqueta cuando el caller no conoce el
// tamaño real del texto: sobreestimada para 4 caracteres (el formato más
// largo del pool, `-80°`), nunca infravalorada.
const CAJA_POR_DEFECTO = Object.freeze(cajaEstimada("0000"));

// Caja (offsetWidth × offsetHeight) del <span> de un slot, cacheada en un
// WeakMap por slot: el texto es inmutable, así que el layout solo se lee
// hasta que la medida queda registrada (después, hit de caché sin tocar
// layout en cada frame). Si el span todavía no está laid out (slot recién
// creado y fuera del DOM, o con display:none tras hideObject) se devuelve
// una estimación conservadora que SÍ se reintentará en el siguiente frame,
// de modo que el primer frame de cada etiqueta usa un sobreestimado (empuja
// la etiqueta un poco más hacia dentro) y nunca un infravalorado.
const CAJAS_TEXTUALES = new WeakMap();

/**
 * Obtiene el tamaño de un slot y lo guarda en caché.
 *
 * Si el elemento todavía no tiene dimensiones, devuelve una estimación.
 *
 * @param {CSS2DObject} slot - Etiqueta cuyo tamaño se quiere medir.
 * @returns {{w: number, h: number}} Tamaño de la etiqueta en píxeles.
 */
function cajaDeSlot(slot) {
  const cacheada = CAJAS_TEXTUALES.get(slot);
  if (cacheada) return cacheada;

  const span = slot.element;
  const w = span.offsetWidth;
  const h = span.offsetHeight;

  if (w > 0 && h > 0) {
    const caja = { w, h };
    CAJAS_TEXTUALES.set(slot, caja);
    return caja;
  }

  return cajaEstimada(span.textContent || "");
}

/**
 * Calcula la posición y la rotación de una etiqueta a partir de un cruce
 * con el borde del viewport.
 *
 * Devuelve `null` si la línea cruza el borde con un ángulo demasiado agudo.
 * La etiqueta se mantiene dentro del viewport y se coloca a la profundidad
 * del cruce.
 *
 * @param {{x: number, y: number, borde: number, u: {x: number, y: number}, zCam: number}}
 * cruce - Cruce de la línea con el borde del viewport.
 * @param {number} ancho - Ancho del viewport.
 * @param {number} alto - Alto del viewport.
 * @param {THREE.PerspectiveCamera} camara - Cámara usada para la proyección.
 * @param {{w: number, h: number}} [caja] - Ancho y alto de la etiqueta en píxeles.
 * @returns {{posicion: THREE.Vector3, theta: number} | null} Posición y ángulo
 * de la etiqueta, o `null` si el cruce se descarta.
 */
export function geometriaDeEtiqueta(
  cruce,
  ancho,
  alto,
  camara,
  caja = CAJA_POR_DEFECTO,
) {
  // (b) Salto por ángulo agudo: u = tangente unitaria, v = normal del borde.
  const normal = NORMALES_BORDE[cruce.borde];
  if (!normal) return null;

  const productoPunto = cruce.u.x * normal.x + cruce.u.y * normal.y;

  if (Math.abs(productoPunto) < UMBRAL_ANGULO_AGUDO) {
    return null; // casi paralela al borde → no se dibuja esta cruce
  }

  // (a) Ángulo con flip: −π si |θ| > 90°, luego normalización a (−π, π].
  let theta = Math.atan2(cruce.u.y, cruce.u.x);

  if (Math.abs(theta) > Math.PI / 2) theta -= Math.PI; // nunca boca abajo
  if (theta <= -Math.PI) theta += 2 * Math.PI;
  else if (theta > Math.PI) theta -= 2 * Math.PI;

  if (Math.abs(Math.abs(theta) - Math.PI / 2) < EPS_VERTICAL) {
    theta = Math.PI / 2;
  }

  // Medios de la CAJA ROTADA del texto. El <span> se centra sobre el ancla
  // (CSS2DObject.center = 0.5,0.5) y CSS2DRenderer rota sobre el centro del
  // elemento, así que lo que hay que mantener dentro del viewport es la caja
  // w×h girada θ: para ángulo θ, medio ancho en x = |cos θ|·w/2+|sen θ|·h/2 y
  // medio alto en y = |sen θ|·w/2+|cos θ|·h/2. (El signo de θ no importa:
  // solo entran valores absolutos.)
  const cosAbs = Math.abs(Math.cos(theta));
  const sinAbs = Math.abs(Math.sin(theta));
  const medioX = (cosAbs * caja.w + sinAbs * caja.h) / 2;
  const medioY = (sinAbs * caja.w + cosAbs * caja.h) / 2;

  // (c) Offset perpendicular a la línea; SIEMPRE del lado derecho de su
  // sentido de recorrido (−u.y, u.x), invariante al flip de θ (u no cambia)
  // y a la posición del cruce. Elegir el lado "con más margen" empataba en
  // los cruces casi perpendiculares al borde (p. ej. el 12h en la vista
  // polar: ambos candidatos limitados por el mismo borde) y el desempate
  // dependía del flip, que oscila con el más mínimo giro de la cámara →
  // la etiqueta saltaba de un lado a otro de la línea (parpadeo).
  const elegido = {
    x: cruce.x + -cruce.u.y * MEDIA_ALTURA_TEXTO,
    y: cruce.y + cruce.u.x * MEDIA_ALTURA_TEXTO,
  };

  // Clamp de la caja rotada COMPLETA (el ancla solo no basta: con la
  // rotación el texto sobresalía y quedaba cortado por el overflow del
  // viewport, p. ej. `6h` sobre el borde derecho). Si el viewport fuera más
  // pequeño que la caja + márgenes, se centra el ancla (caso degenerado).
  const minX = medioX + MARGEN_ETIQUETA;
  const maxX = ancho - medioX - MARGEN_ETIQUETA;
  const minY = medioY + MARGEN_ETIQUETA;
  const maxY = alto - medioY - MARGEN_ETIQUETA;

  const px =
    minX > maxX ? ancho / 2 : Math.min(Math.max(elegido.x, minX), maxX);
  const py = minY > maxY ? alto / 2 : Math.min(Math.max(elegido.y, minY), maxY);

  // (d) Volver al mundo: back-proyectar el píxel final a la profundidad de la
  // cruce (fov three = vertical; el eje x escala con el aspecto).
  const tanF = Math.tan(aRad(camara.fov / 2));
  const aspecto = ancho / alto;
  const xCam = ((px / ancho) * 2 - 1) * tanF * aspecto * -cruce.zCam;
  const yCam = (1 - (py / alto) * 2) * tanF * -cruce.zCam;

  const posicion = new THREE.Vector3(xCam, yCam, cruce.zCam).applyMatrix4(
    camara.matrixWorld,
  );

  return { posicion, theta };
}

// Paralelos Dec del retículo: 0° y ±10°, ±20° … ±80° → 17 en total.
const PARALELOS_DEC = [0];
for (let dec = 10; dec <= 80; dec += 10) {
  PARALELOS_DEC.push(dec, -dec);
}

/**
 * Muestrea un meridiano en coordenadas mundo.
 * meridiano α fijo: δ de −90° a +90° en pasos de 5° → 37 puntos;
 * paralelo δ fijo: α de 0° a 360° en pasos de 10° → 37 puntos (cierra el
 * círculo). Coste: 24×37 + 17×37 ≈ 1500 proyecciones por frame, despreciable.
 *
 * @param {number} alfaGrados - Ascensión recta del meridiano en grados.
 * @returns {THREE.Vector3[]} Puntos del meridiano.
 */
function muestrearMeridiano(alfaGrados) {
  const puntos = [];

  for (let delta = -90; delta <= 90; delta += 5) {
    puntos.push(
      new THREE.Vector3(
        ...aCoordenadasThree(aRad(alfaGrados), aRad(delta), RADIO),
      ),
    );
  }
  return puntos;
}

/**
 * Muestrea un paralelo en coordenadas mundo.
 *
 * @param {number} deltaGrados - Declinación del paralelo en grados.
 * @returns {THREE.Vector3[]} Puntos del paralelo.
 */
function muestrearParalelo(deltaGrados) {
  const puntos = [];

  for (let alfa = 0; alfa <= 360; alfa += 10) {
    puntos.push(
      new THREE.Vector3(
        ...aCoordenadasThree(aRad(alfa), aRad(deltaGrados), RADIO),
      ),
    );
  }

  return puntos;
}

/**
 * Crea el pool de las etiquetas de ascensión recta, declinación y puntos cardinales.
 *
 * Los objetos devueltos se pueden añadir a la escena. La función `actualizar`
 * debe llamarse en cada frame antes de renderizar las etiquetas CSS2D.
 *
 * @returns {{
 *   objetos: CSS2DObject[],
 *   actualizar: (
 *     camara: THREE.PerspectiveCamera,
 *     ancho: number,
 *     alto: number
 *   ) => void
 * }} Objetos de etiqueta y función para actualizar su posición y visibilidad.
 */
export function crearEtiquetas() {
  // Horas AR: slot por meridiano, texto `0h`…`23h`. Nacen ocultos; solo se
  // muestra el de la primera cruce válida de su meridiano con el borde.
  const horas = [];
  for (let h = 0; h < 24; h += 1) {
    horas.push(crearSlot(formatearHora(h)));
  }

  // Grados Dec: 2 slots por paralelo (hasta 2 cruces con el borde),
  // texto con formatearGrado. También nacen ocultos.
  const grados = PARALELOS_DEC.map((dec) => [
    crearSlot(formatearGrado(dec)),
    crearSlot(formatearGrado(dec)),
  ]);

  // Cardinales: N (polo norte, +Y), S (polo sur, −Y),
  // E (AR 6h = 90°, −Z) y O (AR 18h = 270°, +Z), a radio 530 (fuera).
  const RADIO_CARDINALES = RADIO + 30; // 530
  const cardinales = [
    ["N", aCoordenadasThree(aRad(0), aRad(90), RADIO_CARDINALES)],
    ["S", aCoordenadasThree(aRad(0), aRad(-90), RADIO_CARDINALES)],
    ["E", aCoordenadasThree(aRad(90), aRad(0), RADIO_CARDINALES)],
    ["O", aCoordenadasThree(aRad(270), aRad(0), RADIO_CARDINALES)],
  ].map(([texto, posicion]) => crearEtiquetaEstatica(texto, posicion));

  const objetos = [...horas, ...grados.flat(), ...cardinales]; // 24 + 34 + 4 = 62

  /**
   * Actualiza posición, rotación y visibilidad de las etiquetas dinámicas.
   *
   * @param {THREE.PerspectiveCamera} camara - Cámara de la escena.
   * @param {number} ancho - Ancho del viewport en píxeles.
   * @param {number} alto - Alto del viewport en píxeles.
   */
  function actualizar(camara, ancho, alto) {
    if (
      !(camara instanceof THREE.PerspectiveCamera) ||
      !Number.isFinite(ancho) ||
      !Number.isFinite(alto) ||
      ancho <= 0 ||
      alto <= 0
    ) {
      return; // viewport sin tamaño útil
    }

    // ÚNICA llamada por frame a updateMatrixWorld (proyectarPuntos se invoca
    // 41 veces abajo y ya no la repite): matrices al día para proyectar y
    // para la back-proyección de geometriaDeEtiqueta.
    camara.updateMatrixWorld();

    // Cada frame arranca ocultando todos los slots dinámicos (sin estado
    // residual): las líneas que dejan de tocar el borde desaparecen y las
    // nuevas aparecen. Las cardinales estáticas no se tocan.
    for (let h = 0; h < horas.length; h += 1) {
      horas[h].visible = false;
    }
    for (let i = 0; i < grados.length; i += 1) {
      grados[i][0].visible = false;
      grados[i][1].visible = false;
    }

    // Horas AR: una sola etiqueta por meridiano, en su primera cruce válida.
    for (let h = 0; h < horas.length; h += 1) {
      const slot = horas[h];
      const puntos = proyectarPuntos(
        muestrearMeridiano(h * 15),
        camara,
        ancho,
        alto,
      );
      const cruces = detectarCrucesDePolilinea(puntos, ancho, alto);

      for (const cruce of cruces) {
        // Caja del texto para clampear contra la caja rotada (cacheada por
        // slot: solo se lee offsetWidth/offsetHeight hasta medir por primera
        // vez; el primer frame usa la estimación conservadora).
        const geo = geometriaDeEtiqueta(
          cruce,
          ancho,
          alto,
          camara,
          cajaDeSlot(slot),
        );

        if (!geo) continue; // cruce descartado (casi paralela al borde)

        slot.position.copy(geo.posicion);
        slot.rotation2D = -geo.theta; // renderer aplica rotate(−rotation2D)
        slot.visible = true;
        break; // primera cruce válida: una etiqueta por meridiano
      }
    }

    // Grados Dec: hasta 2 cruces válidas por paralelo (una por cada lado).
    for (let i = 0; i < grados.length; i += 1) {
      const puntos = proyectarPuntos(
        muestrearParalelo(PARALELOS_DEC[i]),
        camara,
        ancho,
        alto,
      );
      const cruces = detectarCrucesDePolilinea(puntos, ancho, alto);
      let colocadas = 0;

      for (const cruce of cruces) {
        if (colocadas >= 2) break; // máximo 2 slots por paralelo

        const slot = grados[i][colocadas];
        const geo = geometriaDeEtiqueta(
          cruce,
          ancho,
          alto,
          camara,
          cajaDeSlot(slot),
        );

        if (!geo) continue;

        slot.position.copy(geo.posicion);
        slot.rotation2D = -geo.theta;
        slot.visible = true;
        colocadas += 1;
      }
    }
  }

  return { objetos, actualizar };
}
