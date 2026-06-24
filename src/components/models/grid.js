import {
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Vector3,
} from "three";

import { addLabelCSS2DObject } from "./etiquetas";

import { formulaRaDecToCartesian } from "../../utils/convert.js";

let labelsSpriteGroup = new Group();
let labelsCSS2DGroup = new Group();

/**
 * Método para calcular las líneas de Declinación
 * @property {Number} radius : el radio de la esfera
 * @property {Number} step : los pasos de separación de las líneas en grados
 * @returns {Group} group : con las líneas paralelas y las etiquetas
 */
const createDecLines = (radius = 1, step = 20) => {
  // Calcula los valores de las coordenadas esféricas para cada punto en el grid
  // Crea 9 líneas de declinación de -90° a 90° de 20° en 20°

  const group = new Group();
  const geometries = [];

  // Líneas de latitud (declinación)
  for (let dec = -90; dec <= 90; dec += step) {
    const points = [];

    for (let ra = 0; ra <= 360; ra++) {
      // Paralelos
      const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);

      const x = sphericalCoords.x;
      const y = sphericalCoords.y;
      const z = sphericalCoords.z;

      // Elige qué ángulo de declinación quieres calcular
      // if ([70, 50].includes(dec)) {
      //   // console.log(x, y, z);
      //   points.push(new Vector3(x, y, z));
      // }

      points.push(new Vector3(x, y, z));

      // Coloca etiquetas
      // if (ra % 15 === 0) {
      if (ra % 45 === 0 && [-90, -70, 50, -10, 10, 50, 70, 90].includes(dec)) {
        // labelsSpriteGroup.add(
        //   createSpriteLabel("dec", new Vector3(x, y, z), dec),
        // );
        //
        labelsCSS2DGroup.add(
          addLabelCSS2DObject("dec", new Vector3(x, y, z), dec),
        );
      }
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    // const material = createMeshBasicMaterial(new Color("#ff0000"));
    // const material = createMeshBasicMaterial(new Color("#7833aa"));
    // const material = createMeshBasicMaterial(new Color("#4488ff"));
    const material = new LineBasicMaterial({
      color: gridMaterialColor.isColor
        ? gridMaterialColor
        : new Color("#4488ff"),
      // transparent: true,
      // opacity: 0.6,
    });

    const line = new LineSegments(geometry, material);
    line.updateMatrix();

    group.add(line);
  }

  return group;
};

/**
 * Método para calcular las líneas de Ascensión Recta
 * @property {Number} radius : el radio de la esfera
 * @property {Number} step : los pasos de separación de las líneas en grados
 * @returns {Group} group : con las líneas meridianas y las etiquetas
 */
const createRaLines = (radius = 1, step = 15) => {
  // calcula los valores de las coordenadas esféricas para cada punto en el grid
  // Crea 24 líneas de ascención recta de 0° a 360° de 15° en 15°
  // formulaSphereToEcuatorial

  const group = new Group();
  const angulosRectos = [0, 90, 180, 270, 360];

  // Líneas de longitud (ascensión recta)
  for (let ra = 0; ra <= 360; ra += step) {
    const points = [];

    // Solo los angulos rectos llegan hasta los ejes polares
    if (angulosRectos.includes(ra)) {
      for (let dec = -90; dec <= 90; dec++) {
        // Meridianos
        const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);
        points.push(sphericalCoords);

        // Colocar etiquetas
        // if (
        //   dec % 10 === 0 &&
        //   dec % 20 !== 0 &&
        //   ra !== 0 &&
        //   dec !== 90 &&
        //   dec !== -90
        // ) {
        if (ra !== 0 && [-70, -50, -10, 10, 50, 70].includes(dec)) {
          const raHours = ra / 15;
          const horas = true;
          // labelsSpriteGroup.add(
          //   createSpriteLabel("ra", sphericalCoords, raHours, horas),
          // );
          //
          labelsCSS2DGroup.add(
            addLabelCSS2DObject("ra", sphericalCoords, raHours, horas),
          );
        }
      }
    } else {
      // esto soluciona que las líneas no lleguen hasta -90° o 90
      for (let dec = -70; dec <= 70; dec++) {
        // Meridianos
        const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);
        points.push(sphericalCoords);

        // Colocar etiquetas
        // if (
        //   dec % 10 === 0 &&
        //   dec % 20 !== 0 &&
        // )
        if (
          [-70, -50, -10, 10, 50, 70].includes(dec) &&
          [45, 135, 225, 315].includes(ra)
        ) {
          const raHours = ra / 15;
          const horas = true;
          // labelsSpriteGroup.add(
          //   createSpriteLabel("ra", sphericalCoords, raHours, horas),
          // );
          //
          labelsCSS2DGroup.add(
            addLabelCSS2DObject("ra", sphericalCoords, raHours, horas),
          );
        }
      }
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: gridMaterialColor.isColor
        ? gridMaterialColor
        : new Color("#4488ff"),
    });

    const line = new LineSegments(geometry, material);
    line.updateMatrix();

    group.add(line);
  }

  return group;
};

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
  coordinates = "all",
}) => {
  let group = new Group();

  // Paralelos - Delinación
  if (coordinates == "declination") {
    group = createDecLines(radius, stepDec);
    return group;
  } else {
    // Meridianos - Ascensión Recta
    if (coordinates === "ascension") {
      group = createRaLines(radius, stepRa);
      return group;
    } else {
      // Calcula ambas direcciones (meridianos y paralelos)
      const longitudeLines = createRaLines(radius, stepRa);
      group.add(longitudeLines);

      const latitudeLines = createDecLines(radius, stepDec);
      group.add(latitudeLines);

      return group;
    }
  }
};

/**
 * Método para crear el grid
 * @property {String} type : tipo de retícula. Ejemplos: ecuatorial, ...
 * @returns {Group} group : con el grupo de líneas paralelas, meridianas y las etiquetas
 */
const createGrid = (type = "ecuatorial") => {
  let group = new Group();

  switch (type) {
    case "ecuatorial":
      const stepRa = 15;
      const stepDec = 20;

      group = createEcuatorialGrid({
        stepRa: stepRa,
        stepDec: stepDec,
        radius: gridRadius,
      });

      break;

    default:
      // otros tipos de grid
      break;
  }

  return group;
};

let gridRadius = 1;
let gridMaterialColor = new Color("#4488ff");
/**
 * Método para crear la retícula esférica
 * @param {Number} radius : radio de la esfera
 * @param {Color} lines : para las líneas de grid
 * @returns {Group} group
 */
const createSphericalGrid = ({ radio, color }) => {
  const group = new Group();

  gridRadius = radio;
  gridMaterialColor = color;
  // Grid
  const sphericalGrid = createGrid("ecuatorial");
  group.add(sphericalGrid);

  // Etiquetas
  // CSS2D
  group.add(labelsCSS2DGroup);

  // Sprite
  // group.add(labelsSpriteGroup);

  return group;
};

export default createSphericalGrid;
