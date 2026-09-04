import { Color, Group } from "three";
import { createDecLines, createRaLines } from "./crear-lineas.js";

/**
 * Método para crear el grid ecuatorial por tipo de coordenada
 * @property {Number} stepRa : los pasos de las líneas meridianas en grados
 * @property {Number} stepDec : los pasos de las líneas paralelas en grados
 * @property {Number} radius : el radio de la esfera
 * @property {String} coordinates : el tipo de coordenadas. Ejemplos: declination, ascensión, all
 * @returns {Group} group : con el grupo de líneas paralelas, meridianas y las etiquetas
 */
const createEcuatorialGrid = ({
  stepRa,
  stepDec,
  radius = 1,
  color = new Color("#4488ff"),
  coordinates = "all",
}) => {
  let group = new Group();
  // Aquí puedes cambiar el color de las líneas
  // const colorDecLines = new Color("#ff0000");
  // const colorRaLines = new Color("#7833aa")
  const colorDecLines = color;
  const colorRaLines = color;

  // Paralelos - Delinación
  if (coordinates == "declination") {
    group = createDecLines(radius, stepDec, colorDecLines);
    return group;
  } else {
    // Meridianos - Ascensión Recta
    if (coordinates === "ascension") {
      group = createRaLines(radius, stepRa, colorRaLines);
      return group;
    } else {
      // Calcula ambas direcciones (meridianos y paralelos)
      const longitudeLines = createRaLines(radius, stepRa, colorRaLines);
      group.add(longitudeLines);

      const latitudeLines = createDecLines(radius, stepDec, colorDecLines);
      group.add(latitudeLines);

      return group;
    }
  }
};

export { createEcuatorialGrid };
