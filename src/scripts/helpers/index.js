import { AxesHelper } from "three";
/**
 * Método para agregar cruces de dirección a la escena
 * @param {Scene} scene
 */
const addHelper = (scene) => {
  const axesHelper = new AxesHelper(5);
  axesHelper.layers.enableAll();
  scene.add(axesHelper);
};

export default addHelper;
