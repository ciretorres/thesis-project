import { Color, Scene } from "three";

/**
 * A scene is the space in which you can places objects, cameras and lighting
 * @returns {Scene} escena
 * @see https://threejs.org/docs/#api/en/scenes/Scene
 */
const createEscena = () => {
  let escena = new Scene();
  return escena;
};

/**
 * Método para agregar una escena y cambiar sus propiedades de fondo
 * @returns {Scene} escena
 */
const addEscena = () => {
  // crea escena
  const escena = createEscena();

  // const backgroundColor = new Color(0x444444);
  // const backgroundColor = new Color("#302a73");
  const backgroundColor = new Color(0x000000);

  // properties
  escena.background = backgroundColor;
  // escena.fog = new FogExp2(0xcccccc, 0.002); // A fog instance defining the type of fog that affects everything rendered in the scene. Default is null.

  return escena;
};

export default addEscena;
