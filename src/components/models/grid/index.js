import { Color, Group } from "three";

import { createEcuatorialGrid } from "./crear-grid-ecuatorial.js";
// crea etiquetas con la info sobre RA y Dec
import labelsCSS2DGroup from "./crear-etiquetas";

// variables para etiquetas
let labels = new Group();

// variables para grid
let gridRadius = 1;
let gridMaterialColor = new Color("#4488ff");

/**
 * Método para crear el grid
 * @property {String} type : tipo de retícula. Ejemplos: ecuatorial, ...
 * @returns {Group} group : con el grupo de líneas paralelas, meridianas y las etiquetas
 */
const createGrid = (type = "ecuatorial") => {
  let group = new Group();
  switch (type) {
    case "ecuatorial":
      // cada cuantos pasos en ascención recta se va a dibujar la lineas
      // tiene que ser múltipo de 360. Con 15 son 24 líneas
      const stepRa = 15;
      // tiene que ser múltipo de 180. Con 10 son 18 líneas de cada lado (36)
      // const stepDec = 20;
      const stepDec = 10;

      group = createEcuatorialGrid({
        stepRa: stepRa,
        stepDec: stepDec,
        radius: gridRadius,
        color: gridMaterialColor,
      });

      break;
    default:
      // otros tipos de grid
      break;
  }
  return group;
};

/**
 * Crear la retícula 3D esférica como grid y las etiquetas
 * con los grados y ángulos de las líneas
 * @param {Number} radio : radio de la esfera
 * @param {Color} color : color para las líneas de grid
 * @returns {Group} group: con los objetos 3d
 */
const createSphericalGrid = ({ radio = 1, color = new Color("#ff0000") }) => {
  const group = new Group();

  // Grid
  gridRadius = radio;
  gridMaterialColor = color;

  const sphericalGrid = createGrid();
  group.add(sphericalGrid);

  // Etiquetas

  // CSS2D
  labels = labelsCSS2DGroup;
  group.add(labels);

  // Sprite
  // group.add(labelsSpriteGroup);

  return group;
};

export default createSphericalGrid;
