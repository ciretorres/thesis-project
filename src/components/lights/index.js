import { AmbientLight, Color, DirectionalLight } from "three";

/**
 * Método para crear una luz direccional
 * @param {Color} color : The light's color. Default is 0xffffff.
 * @param {Number} intensity : The light's strength/intensity. Default is 1.
 * @returns {DirectionalLight} directionalLight
 * @see https://threejs.org/docs/#DirectionalLight
 */
const createDireccionalLight = (color = 0xffffff, intensity = 0.5) => {
  const directionalLight = new DirectionalLight(color, intensity);
  return directionalLight;
};

/**
 * Método para crear una luz ambiente
 * @param {Color} color : The light's color. Default is 0xffffff.
 * @param {Number} intensity : The light's strength/intensity. Default is 1.
 * @returns {AmbientLight} ambientLight
 * @see https://threejs.org/docs/#AmbientLight
 */
const createAmbientLight = (color = 0x404040, intensity = 1) => {
  const ambientLight = new AmbientLight(color, intensity);
  return ambientLight;
};

/**
 * Método para agregar luces a la escena
 * @param {Object} scene : en donde se van a agregar
 */
const addLights = (scene) => {
  // const color = new Color(0x404040); // soft white light
  // const color = new Color(0x555555);
  // const color = new Color(0x002288);
  const color = new Color(0xffffff);
  const intensity = 3;

  // crea luz ambiente
  const light = createAmbientLight(color);
  scene.add(light);

  // crea luz direccional
  const lights = [];
  // lights[0] = createDireccionalLight(color, 3);
  lights.push(createDireccionalLight(color, intensity));

  // properties
  // lights[0].position.set(-1, 2, 4);
  lights[0].position.set(0, 200, 0);
  scene.add(lights[0]);
};

export default addLights;
