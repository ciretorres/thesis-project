import {
  Color,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from "three";

/**
 * Creates a geometry
 * @property {radius}:
 * @property {widthSegments}:
 * @property {heightSegments}:
 * @property {phiStart}:
 * @property {thetaStart}:
 * @property {thetaLength}:
 * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
 */
const createSphereGeometry = (
  radius = 0.05,
  widthSegments = 12,
  heightSegments = 12,
  phiStart = Math.PI * 2,
  thetaStart = 0,
  thetaLength = Math.PI,
) => {
  const props = {
    radius: radius,
    widthSegments: widthSegments,
    heightSegments: heightSegments,
    phiStart: phiStart,
    thetaStart: thetaStart,
    thetaLength: thetaLength,
  };

  // TODO: hacer que cambien los valores y se actualice la geometría
  // const folder = gui.addFolder("THREE.SphereGeometry");
  // folder.open();
  // // folder.close();
  // folder.add(props, "radius", 1, 30).step(1);
  // folder.add(props, "widthSegments", 3, 64).step(1);
  // folder.add(props, "heightSegments", 2, 32);
  // folder.add( props, 'phiStart', 0, twoPi ).onChange( generateGeometry );
  // folder.add( props, 'phiLength', 0, twoPi ).onChange( generateGeometry );
  // folder.add( props, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
  // folder.add( props, 'thetaLength', 0, twoPi ).onChange( generateGeometry );

  let geometry = new SphereGeometry(
    props.radius,
    props.widthSegments,
    props.heightSegments,
  );
  return geometry;
};

/**
 * Creates a material that describe the appereance of objects
 * @see https://threejs.org/docs/index.html#api/en/constants/Materials
 * @see https://threejs.org/manual/#en/materials
 */
const createSphereMaterial = () => {
  // const wireframe = false;
  // let colorEsfera = new Color("#7833aa");
  // let colorEsfera = new Color("#8844aa");
  // let colorEsfera = new Color("#aa8844");
  // let colorEsfera = new Color("#FFFFFF");
  let colorEsfera = new Color("#ffffe0");
  let hexadecimal = colorEsfera.getHex();

  // const material = new THREE.MeshPhongMaterial({ color });
  const material = new MeshBasicMaterial({
    color: colorEsfera,
    wireframe: true,
  });
  return material;
};

/**
 * Crea una o varias instancias de estrellas mediante SphereGeometry (InstancedMesh)
 * @param {Number} numStars : cantidad de estrellas
 * @param {Vector3} position : posición esférica en la escena
 * @returns {InstancedMesh} stars : con las instancias del mesh de estrellas
 */
const createInstancedMeshedStars = (
  numStars = 500,
  position = new Vector3(),
) => {
  const starGeometry = createSphereGeometry();
  const starMaterial = createSphereMaterial();

  const stars = new InstancedMesh(starGeometry, starMaterial, numStars);
  const matrix = new Matrix4();

  for (let i = 0; i < numStars; i++) {
    // Genera una posición aleatoria dentro de un rango deseado
    const x = Math.ceil(Math.random() * 200 - 100);
    const y = Math.ceil(Math.random() * 200 - 100);
    const z = Math.ceil(Math.random() * 200 - 100);

    matrix.makeTranslation(x, y, z);
    stars.setMatrixAt(i, matrix);
  }

  return stars;
};
