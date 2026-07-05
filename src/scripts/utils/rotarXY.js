import { Object3D } from "three";

/**
 *  Método para rotar un objeto 3d
 * @param {Object3D} object : objeto que va a rotar
 * @param {Number} value : la cantidad que va a rotar cada vez
 */
const rotarXY = (object = new Object3D(), value = 0.001) => {
  object.rotation.x += value;
  object.rotation.y += value;
  // console.log(object.rotation.x, object.rotation.y);
  //
  // cubes.forEach((cube, ndx) => {
  //   const speed = 1 + ndx * 0.1;
  //   const rot = time * speed;
  //   cube.rotation.x = rot;
  //   cube.rotation.y = rot;
  // });
};

export default rotarXY;
