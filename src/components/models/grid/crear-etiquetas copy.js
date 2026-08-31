import { Group } from "three";

import { addLabelCSS2DObject } from "../etiquetas.js";

import { formulaRaDecToCartesian } from "../../../scripts/utils/convert.js";

let labelsCSS2DGroup = new Group();

/**
 * Método para calcular las líneas de Ascensión Recta y colocar las etiquetas de tipo CSS2D o Sprites
 * @property {Number} radius : el radio de la esfera
 * @property {Number} step : los pasos de separación de las líneas en grados
 * @returns {Group} group : con las líneas meridianas y las etiquetas
 */
const createLabelsOnRaLines = (radius = 1, step = 15) => {
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
          labelsCSS2DGroup.add(addLabelCSS2DObject(text, sphericalCoords));
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
          labelsCSS2DGroup.add(addLabelCSS2DObject(text, sphericalCoords));
        }
      }
    }

    // crea geometría
    // const geometry = new BufferGeometry().setFromPoints(points);
    // const material = new LineBasicMaterial({
    //   color: gridMaterialColor.isColor
    //     ? gridMaterialColor
    //     : new Color("#4488ff"),
    //   transparent: true,
    //   opacity: 0.6,
    // });
    // const line = new LineSegments(geometry, material);
    // line.updateMatrix();
    // group.add(line);
  }

  return group;
};

createLabelsOnRaLines();

export default labelsCSS2DGroup;
