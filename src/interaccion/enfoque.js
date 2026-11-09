import * as THREE from "three";

/**
 * Aplica una curva cúbica de entrada y salida suave.
 * @param {number} t Progreso normalizado entre 0 y 1.
 * @returns {number} Progreso suavizado.
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Indica si el usuario prefiere reducir el movimiento.
 * La preferencia se consulta cada vez que se inicia una animación.
 * @returns {boolean}
 */
function reducido() {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Proyecta un vector sobre el plano perpendicular a un eje y lo normaliza.
 * Si ambos vectores son paralelos, usa un eje auxiliar.
 * @param {THREE.Vector3} vector Vector que se modifica.
 * @param {THREE.Vector3} eje Eje al que debe ser perpendicular.
 * @returns {THREE.Vector3} El vector modificado y normalizado.
 */
function componenteOrtogonal(vector, eje) {
  vector.addScaledVector(eje, -vector.dot(eje));

  if (vector.lengthSq() < 1e-18) {
    vector.set(1, 0, 0).addScaledVector(eje, -eje.x);

    if (vector.lengthSq() < 1e-18) {
      vector.set(0, 1, 0).addScaledVector(eje, -eje.y);
    }
  }

  return vector.normalize();
}

/**
 * Calcula la rotación que transforma una base ortonormal en otra.
 * @param {THREE.Vector3} dir0 Dirección inicial.
 * @param {THREE.Vector3} up0 Vector vertical inicial.
 * @param {THREE.Vector3} dir1 Dirección final.
 * @param {THREE.Vector3} up1 Vector vertical final.
 * @returns {THREE.Quaternion} Cuaternión de rotación.
 */
function cuaternionEntre(dir0, up0, dir1, up1) {
  const z0 = new THREE.Vector3().crossVectors(dir0, up0);
  const z1 = new THREE.Vector3().crossVectors(dir1, up1);
  const m0 = new THREE.Matrix4().makeBasis(dir0, up0, z0);
  const m1 = new THREE.Matrix4().makeBasis(dir1, up1, z1);
  const m = m1.multiply(m0.transpose());

  return new THREE.Quaternion().setFromRotationMatrix(m);
}

/**
 * Crea controles para enfocar una estrella y recentrarla en pantalla.
 *
 * La cámara rota alrededor del origen y conserva su distancia. El usuario
 * puede interrumpir una animación con un clic, arrastre o desplazamiento
 * sobre el canvas.
 *
 * @param {object} opciones
 * @param {THREE.Camera} opciones.camara Cámara que se anima.
 * @param {object} opciones.controles Controles tipo OrbitControls.
 * @param {HTMLElement} opciones.controles.domElement Elemento del canvas.
 * @returns {{
 *   enfocar: (direccion: THREE.Vector3, opciones?: {
 *     duracion?: number, ndcY?: number, distancia?: number
 *   }) => void,
 *   recentrar: (ndcY: number, opciones?: {
 *     duracion?: number, distancia?: number
 *   }) => void,
 *   cancelar: () => void,
 *   limpiar: () => void
 * }}
 */
export function crearEnfoque({ camara, controles }) {
  /** Identificador de la animación activa; 0 si no hay ninguna. */
  let rafId = 0;

  /** Función que elimina los listeners de cancelación activos. */
  let quitarListeners = null;

  /** Dirección de la estrella del enfoque vigente. */
  let direccion = null;

  /** Orientación vertical guardada al iniciar el enfoque. */
  let upBase = null;

  /** Distancia entre el origen y la estrella enfocada. */
  let distancia = 1;

  /** Indica si hay un enfoque vigente que pueda recentrarse. */
  let activo = false;

  /**
   * Detiene la animación en la posición actual y elimina sus listeners.
   * Conserva los datos del enfoque para permitir un recentrado posterior.
   */
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

  /** Registra los eventos del canvas que interrumpen la animación. */
  function instalarCancelacion() {
    const alCancelar = () => cancelar();

    controles.domElement.addEventListener("pointerdown", alCancelar);
    controles.domElement.addEventListener("wheel", alCancelar, {
      passive: true,
    });

    quitarListeners = () => {
      controles.domElement.removeEventListener("pointerdown", alCancelar);
      controles.domElement.removeEventListener("wheel", alCancelar);
    };
  }

  /**
   * Calcula la posición y orientación de cámara necesarias para colocar la
   * estrella en la coordenada vertical indicada en NDC.
   * @param {number} ndcY Posición vertical objetivo en coordenadas NDC.
   * @returns {{dir: THREE.Vector3, up: THREE.Vector3}}
   */
  function poseObjetivo(ndcY) {
    const n = direccion.clone().normalize();
    const up0 = componenteOrtogonal(upBase.clone(), n);

    const radio = camara.position.length() || 1;
    const d = distancia > 0 ? distancia : 1;
    const fovRad = THREE.MathUtils.degToRad(camara.fov);
    const k = ndcY * Math.tan(fovRad / 2);
    const rho = radio / d;
    const raiz = Math.sqrt(1 + k * k);
    const argumento = (k * rho) / raiz;

    let theta;
    if (Math.abs(argumento) > 1) {
      theta = Math.acos(Math.max(-1, Math.min(1, -d / radio)));
    } else {
      theta = Math.atan(k) + Math.asin(argumento);
    }

    const eje = new THREE.Vector3().crossVectors(n, up0);

    if (eje.lengthSq() < 1e-18) {
      return { dir: n.negate(), up: up0 };
    }

    eje.normalize();
    const giro = new THREE.Quaternion().setFromAxisAngle(eje, -theta);

    return {
      dir: n.negate().applyQuaternion(giro),
      up: up0.applyQuaternion(giro),
    };
  }

  /**
   * Anima una rotación común de la posición y la orientación de la cámara.
   * @param {object} opciones
   * @param {THREE.Quaternion} opciones.qTotal Rotación final.
   * @param {number} opciones.radio Distancia de la cámara al origen.
   * @param {THREE.Vector3} opciones.dirInicial Dirección inicial.
   * @param {THREE.Vector3} opciones.upInicial Orientación vertical inicial.
   * @param {number} opciones.duracion Duración de la animación en milisegundos.
   */
  function animarCuaternion({
    qTotal,
    radio,
    dirInicial,
    upInicial,
    duracion,
  }) {
    cancelar();

    const qIdentidad = new THREE.Quaternion();
    const qActual = new THREE.Quaternion();
    const dir = new THREE.Vector3();
    const up = new THREE.Vector3();

    instalarCancelacion();
    const t0 = performance.now();

    const paso = (ahora) => {
      const t = Math.min(1, (ahora - t0) / duracion);
      const e = easeInOutCubic(t);

      qActual.slerpQuaternions(qIdentidad, qTotal, e);
      dir.copy(dirInicial).applyQuaternion(qActual);
      up.copy(upInicial).applyQuaternion(qActual);

      camara.position.copy(dir.multiplyScalar(radio));
      camara.up.copy(up);

      if (t === 1) {
        cancelar();
        return;
      }

      rafId = requestAnimationFrame(paso);
    };

    rafId = requestAnimationFrame(paso);
  }

  /**
   * Enfoca una estrella manteniendo la distancia actual de la cámara al origen.
   *
   * Con `ndcY: 0`, centra la estrella y anima solo la posición de la cámara.
   * Con otro valor, también anima la orientación para ubicarla verticalmente.
   *
   * @param {THREE.Vector3} direccionEntrada Dirección de la estrella.
   * @param {object} [opciones]
   * @param {number} [opciones.duracion=1000] Duración en milisegundos.
   * @param {number} [opciones.ndcY=0] Posición vertical objetivo en NDC.
   * @param {number} [opciones.distancia=1] Distancia al origen de la estrella.
   */
  function enfocar(
    direccionEntrada,
    { duracion = 1000, ndcY = 0, distancia: distanciaEntrada = 1 } = {},
  ) {
    cancelar();

    direccion = direccionEntrada.clone().normalize();
    upBase = camara.up.clone();
    distancia = distanciaEntrada > 0 ? distanciaEntrada : 1;
    activo = true;

    const radio = camara.position.length();
    const dirInicial = camara.position.clone().normalize();

    if (ndcY === 0) {
      const dirFinal = direccionEntrada.clone().negate().normalize();
      const giro = new THREE.Quaternion().setFromUnitVectors(
        dirInicial,
        dirFinal,
      );
      const qIdentidad = new THREE.Quaternion();
      const qActual = new THREE.Quaternion();
      const dir = dirInicial.clone();

      instalarCancelacion();
      const t0 = performance.now();

      const paso = (ahora) => {
        const t = Math.min(1, (ahora - t0) / duracion);
        const e = easeInOutCubic(t);

        qActual.slerpQuaternions(qIdentidad, giro, e);
        dir.copy(dirInicial).applyQuaternion(qActual);
        camara.position.copy(dir.multiplyScalar(radio));

        if (t === 1) {
          cancelar();
          return;
        }

        rafId = requestAnimationFrame(paso);
      };

      rafId = requestAnimationFrame(paso);
      return;
    }

    const upInicial = componenteOrtogonal(camara.up.clone(), dirInicial);
    const pose = poseObjetivo(ndcY);
    const qTotal = cuaternionEntre(dirInicial, upInicial, pose.dir, pose.up);

    animarCuaternion({
      qTotal,
      radio,
      dirInicial,
      upInicial,
      duracion,
    });
  }

  /**
   * Vuelve a colocar la estrella enfocada en la posición vertical indicada.
   * No hace nada si no hay un enfoque activo.
   *
   * @param {number} ndcY Posición vertical objetivo en coordenadas NDC.
   * @param {object} [opciones]
   * @param {number} [opciones.duracion=300] Duración en milisegundos.
   * @param {number} [opciones.distancia] Nueva distancia al origen de la estrella.
   */
  function recentrar(
    ndcY,
    { duracion = 300, distancia: distanciaEntrada } = {},
  ) {
    if (!activo) return;

    if (typeof distanciaEntrada === "number" && distanciaEntrada > 0) {
      distancia = distanciaEntrada;
    }

    cancelar();

    const radio = camara.position.length() || 1;
    const dirInicial = camara.position.clone().normalize();
    const upInicial = componenteOrtogonal(camara.up.clone(), dirInicial);
    const pose = poseObjetivo(ndcY);

    const yaEnPose =
      dirInicial.distanceToSquared(pose.dir) < 1e-12 &&
      upInicial.distanceToSquared(pose.up) < 1e-12;

    if (yaEnPose) return;

    if (reducido()) {
      camara.position.copy(pose.dir).multiplyScalar(radio);
      camara.up.copy(pose.up);
      return;
    }

    const qTotal = cuaternionEntre(dirInicial, upInicial, pose.dir, pose.up);

    animarCuaternion({
      qTotal,
      radio,
      dirInicial,
      upInicial,
      duracion,
    });
  }

  /**
   * Cancela la animación y borra el enfoque vigente sin mover la cámara.
   */
  function limpiar() {
    cancelar();
    activo = false;
    direccion = null;
    upBase = null;
    distancia = 1;
  }

  return { enfocar, recentrar, cancelar, limpiar };
}
