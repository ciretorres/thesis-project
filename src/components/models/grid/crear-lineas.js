import {
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Vector3,
} from "three";

import { formulaRaDecToCartesian } from "../../../scripts/utils/convert.js";

/**
 * Método para calcular las líneas de Declinación
 * @property {Number} radius : el radio de la esfera
 * @property {Number} step : los pasos de separación de las líneas en grados
 * @returns {Group} group : con las líneas paralelas y las etiquetas
 */
const createDecLines = (
  radius = 1,
  step = 20,
  color = new Color("#4488ff"),
) => {
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
      // if ([70, 50, 30].includes(dec)) {
      //   // console.log(x, y, z);
      //   points.push(new Vector3(x, y, z));
      // }

      points.push(new Vector3(x, y, z));
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    // const material = createMeshBasicMaterial(new Color("#ff0000"));
    // const material = createMeshBasicMaterial(new Color("#7833aa"));
    // const material = createMeshBasicMaterial(new Color("#4488ff"));
    const material = new LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
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
const createRaLines = (radius = 1, step = 15, color = new Color("#4488ff")) => {
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
        if (
          ra !== 0 &&
          [-90, -80, -70, -50, -30, -10, 0, 10, 30, 50, 70, 80, 90].includes(
            dec,
          )
        ) {
          let text = "";
          const raHours = ra / 15;
          // labelsSpriteGroup.add(
          //   createSpriteLabel("ra", sphericalCoords, raHours, horas),
          // );
          //
          if ([6, 12, 18, 24].includes(raHours)) {
            if (dec === 90 && raHours !== 12) {
              // nada
            } else {
              if (dec < 0) {
                // nada
                if (dec !== -90) {
                  text = `${dec}° | ${raHours}h`;
                }
              } else {
                text = `+${dec}° | ${raHours}h`;
              }
            }
          }
          // labelsCSS2DGroup.add(addLabelCSS2DObject(text, sphericalCoords));
        }
      }
    } else {
      // esto soluciona que las líneas no lleguen hasta -90° o 90
      for (let dec = -80; dec <= 80; dec++) {
        // Meridianos
        const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);
        points.push(sphericalCoords);

        // Colocar etiquetas
        if (
          [-80, -70, -50, -30, -10, 0, 10, 30, 50, 70, 80].includes(dec) &&
          [30, 60, 120, 150, 210, 240, 300, 330].includes(ra)
        ) {
          let text = "";
          const raHours = ra / 15;
          // labelsSpriteGroup.add(
          //   createSpriteLabel("ra", sphericalCoords, raHours, horas),
          // );
          //
          if (dec < 0) {
            // nada
            if (dec !== -90) {
              text = `${dec}° | ${raHours}h`;
            }
          } else {
            text = `+${dec}° | ${raHours}h`;
          }
          // labelsCSS2DGroup.add(addLabelCSS2DObject(text, sphericalCoords));
        }
      }
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
    });

    const line = new LineSegments(geometry, material);
    line.updateMatrix();

    group.add(line);
  }

  return group;
};

export { createDecLines, createRaLines };
