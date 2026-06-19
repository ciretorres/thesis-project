import {
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Vector3,
} from "three";

import { addLabelCSS2DObject } from "./labels";

import { formulaRaDecToCartesian } from "../../utils/convert.js";

let labelsSpriteGroup = new Group();
let labelsCSS2DGroup = new Group();

/**
 * Método para calcular las líneas de Declinación
 * @property {Number} radius: el radio de la esfera
 * @property {Number} step: los pasos de separación de las líneas en grados
 *
 * @returns {Group} group
 */
const createDecLines = (radius = 20, step = 20) => {
  // Calcula los valores de las coordenadas esféricas para cada punto en el grid
  // Crea 9 líneas de declinación de -90° a 90° de 20° en 20°
  // console.log("createDecLines");

  // const linesGroup;
  const group = new Group();
  const geometries = [];

  // Líneas de latitud (declinación)
  for (let dec = -90; dec <= 90; dec += step) {
    // for (let dec = -Math.PI / 2; dec <= Math.PI / 2; dec += Math.PI / 9) {
    // console.log(dec);
    // const latitudePoints;
    const points = [];

    for (let ra = 0; ra <= 360; ra++) {
      // for (let ra = 0; ra <= 2 * Math.PI; ra += (2 * Math.PI) / 360) {
      // console.log(dec, ra);
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
      // console.log({ x, y, z });
      points.push(new Vector3(x, y, z));

      // Colocar etiquetas
      if (ra % 15 === 0) {
        // const spriteLabel = createSpriteLabel(
        //   "dec",
        //   new Vector3(x, y, z),
        //   dec,
        //   radius,
        // );
        // labelsSpriteGroup.add(spriteLabel);
        const css2dLabel = addLabelCSS2DObject(
          "dec",
          new Vector3(x, y, z),
          dec,
          radius,
        );
        labelsCSS2DGroup.add(css2dLabel);
      }
    }
    // const lineGeometry;
    const geometry = new BufferGeometry().setFromPoints(points);

    //     // const material = createMeshBasicMaterial(new Color("#ff0000"));
    //     // const material = createMeshBasicMaterial(new Color("#7833aa"));
    //     // const material = createMeshBasicMaterial(new Color("#4488ff"));
    const material = new LineBasicMaterial({
      color: color.isColor ? color : new Color("#ff0000"),
      // transparent: true,
      // opacity: 0.6,
    });
    const line = new LineSegments(geometry, material);
    // return geometries.map(g => {g.computeBoundingSphere(); return new Line(g, material);});
    line.updateMatrix();
    group.add(line);
  }
  return group;
};

/**
 * Método para calcular las líneas de Ascensión Recta
 * @property {Number} radius: el radio de la esfera
 * @property {Number} step: los pasos de separación de las líneas en grados
 *
 * @returns {Group} group
 */
const createRaLines = (radius = 20, step = 15) => {
  //  calcula los valores de las coordenadas esféricas para cada punto en el grid
  // console.log("createRaLines");
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
        if (
          dec % 10 === 0 &&
          dec % 20 !== 0 &&
          ra !== 0 &&
          dec !== 90 &&
          dec !== -90
        ) {
          // const spriteLabel = createSpriteLabel("ra", sphericalCoords, ra, radius);
          // labelsSpriteGroup.add(spriteLabel);
          const css2dLabel = addLabelCSS2DObject(
            "ra",
            sphericalCoords,
            ra,
            radius,
          );
          labelsCSS2DGroup.add(css2dLabel);
        }
      }
    } else {
      // esto soluciona que las líneas no lleguen hasta -90° o 90
      for (let dec = -70; dec <= 70; dec++) {
        // Meridianos
        const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);
        points.push(sphericalCoords);

        // Colocar etiquetas
        if (dec % 10 === 0 && dec % 20 !== 0) {
          // const spriteLabel = createSpriteLabel("ra", sphericalCoords, ra, radius);
          // labelsSpriteGroup.add(spriteLabel);
          const css2dLabel = addLabelCSS2DObject(
            "ra",
            sphericalCoords,
            ra,
            radius,
          );
          labelsCSS2DGroup.add(css2dLabel);
        }
      }
    }
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: color.isColor ? color : new Color("#ff0000"),
    });
    const line = new LineSegments(geometry, material);
    line.updateMatrix();
    group.add(line);
  }
  return group;
};

/**
 * Método para crear el grid ecuatorial por tipo de coordenada
 * @property {Number} stepRa: los pasos de las líneas meridianas en grados
 * @property {Number} stepDec: los pasos de las líneas paralelas en grados
 * @property {Number} radius: el radio de la esfera
 * @property {String} coordinates: el tipo de coordenadas. Ejemplos: declination, ascensión, all
 *
 * @returns {Group} group
 */
const createEcuatorialGrid = ({
  stepRa,
  stepDec,
  radius = 20,
  coordinates = "all",
}) => {
  // console.log("createEcuatorialGrid");
  let group = new Group();

  if (coordinates == "declination") {
    // Paralelos - Delinación
    group = createDecLines(radius, stepDec);

    return group;
  } else {
    if (coordinates === "ascension") {
      // Meridianos - Ascensión Recta
      group = createRaLines(radius, stepRa);

      return group;
    } else {
      // Calcula ambas direcciones
      const latitudeLines = createDecLines(radius, stepDec);
      group.add(latitudeLines);
      //
      const longitudeLines = createRaLines(radius, stepRa);
      group.add(longitudeLines);

      return group;
    }
  }
};

/**
 * Método para crear el grid
 * @property {String} type: tipo de retícula. Ejemplos: ecuatorial, ...
 *
 * @returns {Group} group
 */
const createGrid = (type = "ecuatorial") => {
  // console.log("createGrid");
  let group = new Group();
  switch (type) {
    case "ecuatorial":
      const stepRa = 15;
      const stepDec = 20;
      group = createEcuatorialGrid({ stepRa, stepDec });

      break;

    default:
      // otros tipos de grid
      break;
  }

  // gridGroup
  return group;
};

let radius = 1;
let color = new Color("#ff0000");
/**
 * Método para crear la retícula esférica
 * @param {Object} scene: para agregar objetos en grupo renderizables
 * @param {Number} radius: radio de la esfera
 * @param {Color} linesGridColor: para las líneas de grid
 *
 * @returns {Group} group
 */
const createSphericalGrid = (scene, radio, linesGridColor) => {
  let group = new Group();

  radius = radio;
  color = linesGridColor;

  const sphericalGridGroup = createGrid("ecuatorial");
  group.add(sphericalGridGroup);

  // labelsSpriteGroup
  scene.add(labelsSpriteGroup);
  group.add(labelsSpriteGroup);

  // labelsCSS2DGroup
  scene.add(labelsCSS2DGroup);
  group.add(labelsCSS2DGroup);

  return group;
};
export default createSphericalGrid;
