import * as THREE from "three";
import { suscribirColor } from "./paleta.js";

/**
 * Crea una escena de Three.js, el espacio que contiene los objetos,
 * las cámaras y la iluminación.
 *
 * @returns {THREE.Scene} La escena creada.
 * @see https://threejs.org/docs/#api/en/scenes/Scene
 */
export function crearEscena() {
  const escena = new THREE.Scene();
  const fondo = new THREE.Color();

  // escena.background = "#000000";
  escena.background = fondo;
  suscribirColor((valor) => fondo.set(valor), "--negro");

  // A fog instance defining the type of fog that affects everything rendered in the scene. Default is null.
  // escena.fog = new THREE.FogExp2(0xcccccc, 0.002);

  return escena;
}
