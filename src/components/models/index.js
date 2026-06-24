import { Group } from "three";

const implementacion = (scene) => {
  let group = new Group();

  // Mesh para integrar a scene

  // // Instancias o Sprites de estrellas
  // const numStars = 500;
  // const starField = createStars(scene, numStars);
  // group.add(starField);

  // // Grid, Reticula Ecuatorial
  // const gridRadio = 1;
  // // const color = new Color("#4488ff");
  // const gridColor = new Color("#ff0000");
  // const grid = createSphericalGrid(scene, gridRadio, gridColor);
  // group.add(grid);

  // TODO: HUD/GUI
  // const gui = new GUI();

  return group;
};
export default implementacion;
