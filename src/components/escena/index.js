import { Color, Scene } from "three";

/**
 * A scene is the space in which you can places objects,cameras and lighting
 * @property {Color} backgroundColor : de la escena.
 * @see https://threejs.org/docs/#api/en/scenes/Scene
 */
const createScene = () => {
  let scene = new Scene();

  return scene;
};

/**
 * Método para agregar una escena y cambiar sus propiedades de fondo
 * @returns scene
 */
const addEscena = () => {
  // const backgroundColor = new Color(0x444444);
  // const backgroundColor = new Color("#302a73");
  const backgroundColor = new Color(0x000000);

  // crea escena
  const scene = createScene();

  // properties
  scene.background = backgroundColor;
  // scene.fog = new FogExp2(0xcccccc, 0.002); // A fog instance defining the type of fog that affects everything rendered in the scene. Default is null.

  return scene;
};

export default addEscena;
