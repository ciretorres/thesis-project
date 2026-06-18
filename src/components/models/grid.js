import { BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from "three";

// Método para convertir grados a radianes
const degreesToRadians = (degrees) => {
  const radians = degrees * (Math.PI / 180);
  return radians;
};

/**
 * Método para tranformar Coordenadas Ecuatoriales en Cartesianas
 * Tridimensionales (ra, dec -> x, y, z) en la forma Y-up
 * @property {Number} radius: el radio de la esfera
 * @property {Number} raDeg: la ascensión recta en grados
 * @property {Number} decDeg: la declinación en grados
 * @returns { Vector3 } con los valores de x, y, z
 */
const formulaRaDecToCartesian = (radius = 1, raDeg, decDeg) => {
  // Declinación en Radians
  const phi = degreesToRadians(decDeg);
  // Ascensión Recta en Radians
  const theta = degreesToRadians(raDeg);

  //       // forma uno z-up
  //       // const x = radio * Math.sin(lat) * Math.cos(lon);
  //       // const y = radio * Math.sin(lat) * Math.sin(lon);
  //       // const z = radio * Math.cos(lat);
  //       // forma dos y-up
  //       // const x = radio * Math.sin(lat) * Math.cos(lon);
  //       // const y = radio * Math.cos(lat);
  //       // const z = radio * Math.sin(lat) * Math.sin(lon);
  //       // forma tres x-up
  //       // const x = radio * Math.cos(lat);
  //       // const y = radio * Math.sin(lat) * Math.cos(lon);
  //       // const z = radio * Math.sin(lat) * Math.sin(lon);

  // +Y = polo norte celeste (Dec = +90°)
  // RA crece anti-horariamente al mirar desde +Y hacia el plano XZ
  const x = radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  // const z = -radius * Math.cos(phi) * Math.sin(theta); // signo negativo para conveniencia astronómina en Y-up

  // return { x, y, z };
  return new Vector3(x, y, z);
};

// formulaSphereToEcuatorial
const formulaSpehereToEcuatorial = (radius = 1, x, y, z) => {
  // return {radius, ra, dec};
};

/**
 * Método para calcular las líneas de Declinación
 * @property {scene}
 * @property {Number} radius: el radio de la esfera
 * @property {Number} step: los pasos de separación de las líneas en grados
 * @property {color}
 * @returns { Group } group
 */
const createDecLines = (scene, radius = 20, step = 20) => {
  // Calcula los valores de las coordenadas esféricas para cada punto en el grid
  // Crea 9 líneas de declinación de -90° a 90° de 20° en 20°
  // console.log("createDecLines");

  // const linesGroup;
  const group = new Group();
  const geometries = [];

  // Líneas de latitud (declinación)
  for (let dec = -90; dec <= 90; dec += step) {
    // const latitudePoints;
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
      // console.log({ x, y, z });
      points.push(new Vector3(x, y, z));
    }

    // const lineGeometry;
    const geometry = new BufferGeometry().setFromPoints(points);

    //     // const material = createMeshBasicMaterial(new Color("#ff0000"));
    //     // const material = createMeshBasicMaterial(new Color("#7833aa"));
    //     // const material = createMeshBasicMaterial(new Color("#4488ff"));
    const material = new LineBasicMaterial({
      color: 0xff0000,
      // transparent: true,
      // opacity: 0.6,
    });
    // const line = new LineSegments(geometry, material);
    const line = new Line(geometry, material);
    // return geometries.map(g => {g.computeBoundingSphere(); return new Line(g, material);});
    line.updateMatrix();
    group.add(line);
  }
  return group;
};

/**
 * Método para calcular las líneas de Ascensión Recta
 * @property {scene}
 * @property {Number} radius: el radio de la esfera
 * @property {Number} step: los pasos de separación de las líneas en grados
 * @property {color}
 * @returns { Group } group
 */
const createRaLines = (scene, radius = 20, step = 15) => {
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
      }
    } else {
      // esto soluciona que las líneas no lleguen hasta -90° o 90
      for (let dec = -70; dec <= 70; dec++) {
        // Meridianos
        const sphericalCoords = formulaRaDecToCartesian(radius, ra, dec);
        points.push(sphericalCoords);
      }
    }
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: 0xff0000,
      // transparent: true,
      // opacity: 0.6,
    });
    const line = new Line(geometry, material);
    line.updateMatrix();
    group.add(line);
  }
  return group;
};

/**
 * Método para crear el grid ecuatorial por tipo de coordenada
 * @property {scene}
 * @property {Number} stepRa: los pasos de las líneas meridianas en grados
 * @property {Number} stepDec: los pasos de las líneas paralelas en grados
 * @property {Number} radius: el radio de la esfera
 * @property {String} coordinates: el tipo de coordenadas. Ejemplos: declination, ascensión, all
 * @property {color}
 * @returns { Group } group
 */
const createEcuatorialGrid = (
  scene,
  stepRa,
  stepDec,
  radius = 20,
  coordinates = "all",
) => {
  // console.log("createEcuatorialGrid");
  let group = new Group();

  if (coordinates == "declination") {
    // Paralelos - Delinación
    group = createDecLines(scene, radius, stepDec);

    return group;
  } else {
    if (coordinates === "ascension") {
      // Meridianos - Ascensión Recta
      group = createRaLines(scene, radius, stepRa);

      return group;
    } else {
      // Calcula ambas direcciones
      const latitudeLines = createDecLines(scene, radius, stepDec);
      group.add(latitudeLines);
      //
      const longitudeLines = createRaLines(scene, radius, stepRa);
      group.add(longitudeLines);

      return group;
    }
  }
};

/**
 * Método para crear el grid
 * @property {scene}
 * @property {String} type: tipo de retícula. Ejemplos: ecuatorial, ...
 * @property {color}
 * @returns { Group } group
 */
const createGrid = (scene, type = "ecuatorial") => {
  // console.log("createGrid");
  let group = new Group();
  switch (type) {
    case "ecuatorial":
      const stepRa = 15;
      const stepDec = 20;
      group = createEcuatorialGrid(scene, stepRa, stepDec);

      break;

    default:
      // otros tipos de grid
      break;
  }

  // gridGroup
  return group;
};

/**
 * Método para crear la retícula esférica
 * @param {scene}
 * @param { Number } radius: radio de la esfera
 * @param {stepRa}
 * @param {stepDec}
 * @param {color}
 * @returns { Group } group
 */
const createSphericalGrid = (scene, radius) => {
  // Grid, Reticula Ecuatorial
  // sphericalGridGroup
  // const sphericalGrid;
  let group = new Group();

  const sphericalGridGroup = createGrid(scene, "ecuatorial");
  group.add(sphericalGridGroup);

  // const labelsGroup = createLabels()
  // group.add(labelsGroup);

  // // Etiquetas en líneas paraleas al ecuador
  // const spriteMap = new TextureLoader().load("/favicon.ico");
  // const spriteMaterial = new SpriteMaterial({ map: spriteMap });
  // for (let dec = -90; dec < 90; dec += 20) {
  //   const radio = 20;
  //   for (let ra = 0; ra <= 360; ra++) {
  //     const sprite = new Sprite(spriteMaterial);
  //     const x =
  //       radio *
  //       Math.cos((dec * Math.PI) / 180) *
  //       Math.cos((ra * Math.PI) / 180);
  //     const y = radio * Math.sin((dec * Math.PI) / 180);
  //     const z =
  //       radio *
  //       Math.cos((dec * Math.PI) / 180) *
  //       Math.sin((ra * Math.PI) / 180);
  //     // Posicionar la etiqueta en el punto correspondiente
  //     sprite.position.set(x, y + 0.6, z);
  //     // sprite.position.set(6.82, 19.79, 0.47);
  //     if ([253, 270, 287].includes(ra)) {
  //       // scene.add(sprite);
  //       group.add(sprite);
  //       scene.add(group);
  //     }
  //   }
  //   // console.log("-", dec);
  // }

  return group;
};
export default createSphericalGrid;
