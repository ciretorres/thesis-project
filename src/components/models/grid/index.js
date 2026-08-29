import { Color, Group } from "three";

import labelsCSS2DGroup from "./crear-etiquetas";
import { createEcuatorialGrid } from "./crear-grid-ecuatorial.js";

let labelsSpriteGroup = new Group();
let labelsCSS2D = new Group();

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

// const piTest = () => {
//   let conteoDec = 1;
//   for (let dec = -Math.PI; dec <= Math.PI; dec += Math.PI / 5) {
//     console.log("-");
//     let conteoRA = 1;
//     for (let ra = 0; ra < 2 * Math.PI; ra += Math.PI / 180) {
//       console.log(
//         "dec",
//         conteoDec,
//         dec,
//         "ra",
//         conteoRA,
//         ra,
//         "=",
//         "{",
//         "x:",
//         formulaRaDecToCartesian(10, ra, dec).x,
//         "y:",
//         formulaRaDecToCartesian(10, ra, dec).y,
//         "z:",
//         formulaRaDecToCartesian(10, ra, dec).z,
//         "}",
//       );
//       conteoRA++;
//       // const sphericalCoords = formulaRaDecToCartesian(1, ra * 58, dec * 29);
//     }
//     conteoDec++;
//   }
//   // console.log(Math.PI * 2);
// };

/**
 * Método para crear la retícula esférica como grid
 * @param {Number} radius : radio de la esfera
 * @param {Color} color : color para las líneas de grid
 * @returns {Group} group
 */
const createSphericalGrid = ({ radio = 1, color = new Color("#ff0000") }) => {
  const group = new Group();

  gridRadius = radio;
  gridMaterialColor = color;

  // Grid
  const sphericalGrid = createGrid();
  group.add(sphericalGrid);

  // Etiquetas
  // CSS2D
  labelsCSS2D = labelsCSS2DGroup;
  group.add(labelsCSS2D);

  // Sprite
  // group.add(labelsSpriteGroup);

  return group;
};

export default createSphericalGrid;
