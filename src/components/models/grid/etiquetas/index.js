import { Group } from "three";

import { addLabelCSS2DObject } from "./crear-etiquetas.js";

import { formulaRaDecToCartesian } from "../../../../scripts/utils/convert.js";

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

  const group = new Group();

  const angulosPolares = [0, 90, 180, 270, 360];

  const declinacionesPolares = [
    -90, -80, -70, -50, -30, -10, 0, 10, 30, 50, 70, 80, 90,
  ];

  const declinacionesNormales = [
    -80, -70, -50, -30, -10, 0, 10, 30, 50, 70, 80,
  ];

  // Líneas de longitud (ascensión recta)
  for (let ra = 0; ra <= 360; ra += step) {
    const esAnguloPolar = angulosPolares.includes(ra);

    const declinacion = esAnguloPolar ? 90 : 80;

    const declinaciones = esAnguloPolar
      ? declinacionesPolares
      : declinacionesNormales;

    const raHours = ra / 15;

    // Líneas Meridianos (declinación)
    for (let dec = -declinacion; dec <= declinacion; dec++) {
      // transforma ecuatoriales (ra,dec) a cartesianas (x,y,z)

      // dependiendo de si son ángulos rectos o no
      if (declinaciones.includes(dec)) {
        if (
          [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360].includes(
            ra,
          ) &&
          !(ra !== 180 && dec === 90) &&
          dec !== -90
        ) {
          // colocar etiquetas
          const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);

          const signo = dec >= 0 ? "+" : "";
          const text = `${signo}${dec}° | ${raHours}h`;
          const etiqueta = addLabelCSS2DObject(text, sphericalCoords);
          // const etiquetas = createSpriteLabel(text, sphericalCoords);

          labelsCSS2DGroup.add(etiqueta);
        }
      }
    }
  }

  return group;
};

createLabelsOnRaLines();

export default labelsCSS2DGroup;
