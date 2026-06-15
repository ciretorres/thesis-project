import { Color, Scene } from "three";
/**
 * a scene is the space in which you can places objects,cameras and lighting
 * @property {backgroundColor}: of the scene.
 * @see https://threejs.org/docs/#api/en/scenes/Scene
 */
const createScene = (backgroundColor = new Color(0x444444)) => {
  let scene = new Scene();
  scene.background = backgroundColor;
  return scene;
};

const escena = () => {
  const scene = createScene(new Color(0x000000));
  // scene.fog = new FogExp2(0xcccccc, 0.002);
  // scene.background = new Color(0x444444);
  return scene;
};

export default escena;
