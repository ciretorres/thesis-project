import { Color, Group } from "three";
import { createStars } from "./estrellas";
import createSphericalGrid from "./grid.js";

const implementacion = (scene) => {
  let group = new Group();

  // Mesh para integrar a scene

  // Instancias o Sprites de estrellas
  const numStars = 500;
  const starField = createStars(scene, numStars);
  group.add(starField);

  // Grid, Reticula Ecuatorial
  const radio = 1;
  // const color = new Color("#4488ff");
  const color = new Color("#ff0000");
  const grid = createSphericalGrid(scene, radio, color);
  group.add(grid);

  // TODO: HUD/GUI
  // const gui = new GUI();

  return group;
};
export default implementacion;
