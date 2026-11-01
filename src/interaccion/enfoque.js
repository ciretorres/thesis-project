// Enfoque animado de cámara: al elegir una estrella, la
// cámara rota sobre el ARCO MÁS CORTO hasta alinear la línea de vista
// cámara→origen→estrella (estrella centrada en pantalla), conservando la
// distancia al centro (radio de la posición inicial: target = origen).
// Three puro, sin dependencias nuevas y sin tocar OrbitControls.

import * as THREE from "three";

/** Aplica una curva cúbica suave en los dos extremos de la animación (al inicio y al final) de ~1000 ms. */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Crea un control para animar la cámara hacia una dirección.
 * La cámara conserva su distancia al origen y gira por el arco más corto.
 *
 * @param {Object} opciones
 * @param {THREE.Camera} opciones.camara Cámara que se animará.
 * @param {Object} opciones.controles Controles de órbita con `domElement`.
 * @returns {{ enfocar: (direccion: THREE.Vector3, opciones?: { duracion?: number }) => void }}
 */
export function crearEnfoque({ camara, controles }) {
  // id del requestAnimationFrame en curso (0 = sin animación).
  let rafId = 0;
  // Retira los listeners de cancelación de la animación en curso.
  let quitarListeners = null;

  /** Detiene la animación actual y elimina sus listeners. */
  function cancelar() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }

    if (quitarListeners) {
      quitarListeners();
      quitarListeners = null;
    }
  }

  /**
   * Anima la cámara para centrar una dirección en pantalla.
   *
   * @param {THREE.Vector3} direccion Dirección de la estrella.
   * @param {Object} [opciones]
   * @param {number} [opciones.duracion=1000] Duración de la animación, en ms.
   */
  function enfocar(direccion, { duracion = 1000 } = {}) {
    cancelar(); // una animación en curso se reinicia desde la posición actual

    // Target = origen → la distancia de la cámara es |posición|.
    const radio = camara.position.length();
    const dirInicial = camara.position.clone().normalize();
    // OrbitControls apunta la cámara al origen, así que para VER la estrella
    // (en +r·n̂ sobre `direccion`) la cámara debe terminar en el punto
    // ANTIPODAL −n̂: con +n̂ la estrella quedaría DETRÁS de la cámara.
    const dirFinal = direccion.clone().negate().normalize();

    // Arco más corto entre las dos direcciones (mitiga el riesgo del eje up).
    const giro = new THREE.Quaternion().setFromUnitVectors(
      dirInicial,
      dirFinal,
    );
    const qIdentidad = new THREE.Quaternion();
    const qActual = new THREE.Quaternion();
    // Vector de trabajo: evita mutar dirInicial en cada frame.
    const dir = dirInicial.clone();

    // Cancelación con el puntero sobre el canvas; no se modifica ningún
    // flag de los controles (el primer arrastre sigue funcionando).
    const alCancelar = () => cancelar();
    controles.domElement.addEventListener("pointerdown", alCancelar);
    controles.domElement.addEventListener("wheel", alCancelar, {
      passive: true,
    });

    quitarListeners = () => {
      controles.domElement.removeEventListener("pointerdown", alCancelar);
      controles.domElement.removeEventListener("wheel", alCancelar);
    };

    const t0 = performance.now();

    const paso = (ahora) => {
      const t = Math.min(1, (ahora - t0) / duracion);
      const e = easeInOutCubic(t);

      // Slerp de cuaternión entre la identidad y el giro (arco más corto).
      // Nota: el API real de three.js es `slerpQuaternions` (el plan.md §2.5
      // lo escribió "slerpQuaterniones"; nombre de método no negociable aquí).
      qActual.slerpQuaternions(qIdentidad, giro, e);
      // SOLO se escribe camara.position, con radio constante.
      dir.copy(dirInicial).applyQuaternion(qActual);
      camara.position.copy(dir.multiplyScalar(radio));

      if (t === 1) {
        // Final: retira listeners y deja la posición definitiva.
        cancelar();
        return;
      }

      rafId = requestAnimationFrame(paso);
    };

    rafId = requestAnimationFrame(paso);
  }

  return { enfocar };
}
