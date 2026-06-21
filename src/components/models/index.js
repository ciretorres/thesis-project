import { Color } from "three";
import { createStars } from "./estrellas.js";
import createSphericalGrid from "./grid.js";

const implementacion = (scene) => {
  // Mesh para integrar a scene

  // Instancias de esferas/estrellas
  const estrellas = createStars(500);
  // console.log(estrellas.length);
  estrellas.forEach((estrellas) => {
    scene.add(estrellas);
  });

  // Grid, Reticula Ecuatorial
  const radio = 1;
  // const color = new Color("#4488ff");
  const color = new Color("#ff0000");
  const grid = createSphericalGrid(scene, radio, color);
  scene.add(grid);

  // TODO: HUD/GUI
  // const gui = new GUI();

  return grid;
};
export default implementacion;
