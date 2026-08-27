import {
  Color,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";
import normalizar from "../../../scripts/utils/normalizar";

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
  radius = 0.5,
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
 * Create una sola estrella mediante SphereGeometry (Mesh)
 * @param {Vector3} position : posición esférica en la escena
 * @returns {Mesh} sphere
 */
const createMeshedStar = (position = new Vector3(1, 1, 1)) => {
  // const starGeometry = new PlaneGeometry(0.1, 0.1);
  const material = createSphereMaterial();
  const geometry = createSphereGeometry();

  const starsMesh = new Object3D();

  const sphere = new Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);

  starsMesh.add(sphere);

  return starsMesh;
};

/**
 * Crea una o varias estrellas aleatorias mediante SphereGeometry (Mesh)
 * @param {Number} numStars : cantidad de estrellas
 * @returns {Object3D} stars : con los Mesh de las estrellas
 */
const createMeshedStarsRandom = (numStars = 500) => {
  const geometry = createSphereGeometry();
  const material = createSphereMaterial();

  const stars = new Object3D();

  for (let index = 0; index < numStars; index++) {
    const star = new Mesh(geometry, material);

    // prueba con valores aleatorios
    const x =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const y =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const z =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);

    star.position.set(x, y, z);
    stars.add(star);
  }

  return stars;
};

/**
 * Crea nuevos campos en el objeto 3D y les asigna el valor de los datos
 * @param {Object} starSprite: objeto para la estrella
 * @param {Object} star: con los datos de la estrella
 */
const addPropsCatalog = (starSprite, star) => {
  starSprite["HIP"] = star.HIP;
  starSprite["RAhms"] = star.RAhms;
  starSprite["DEdms"] = star.DEdms;
  starSprite["Vmag"] = star.Vmag;
  starSprite["ABSmag"] = star.ABSmag;
  starSprite["Pc"] = star.Pc;
  starSprite["Ly"] = star.Ly;
};

/**
 * Crea una o varias estrellas mediante SphereGeometry (Mesh)
 * @param {Array} starCatalogue : datos con las estrellas
 * @returns {Object3D} stars : con los Mesh de las estrellas
 */
const createMeshedStars = (starCatalogue = []) => {
  const stars = new Object3D();

  // crea y calcula la posición de los Mesh
  starCatalogue.forEach((star) => {
    const geometry = createSphereGeometry();
    const material = createSphereMaterial();

    const starMesh = new Mesh(geometry, material);

    // Asigna la posición en Z-up y normaliza (1:100)
    const x = normalizar(star.X);
    const y = normalizar(star.Y);
    const z = normalizar(star.Z);
    // posición
    starMesh.position.set(x, y, z);
    // agrega estos campos del catálogo al ojeto del sprite
    addPropsCatalog(starMesh, star);

    stars.add(starMesh);
  });

  return stars;
};

/**
 * Crea una o varias instancias de estrellas aleatorias mediante SphereGeometry (InstancedMesh)
 * @param {Number} numStars : cantidad de estrellas
 * @param {Vector3} position : posición esférica en la escena
 * @returns {InstancedMesh} stars : con las instancias del mesh de estrellas
 */
const createInstancedMeshedStarsRandom = (
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

/**
 * Crea una o varias instancias de estrellas mediante SphereGeometry (InstancedMesh)
 * @param {Number} numStars : cantidad de estrellas
 * @param {Vector3} position : posición esférica en la escena
 * @returns {InstancedMesh} stars : con las instancias del mesh de estrellas
 */
const createInstancedMeshedStars = (starCatalogue = []) => {
  const starGeometry = createSphereGeometry();
  const starMaterial = createSphereMaterial();

  const stars = new InstancedMesh(
    starGeometry,
    starMaterial,
    starCatalogue.length,
  );
  const matrix = new Matrix4();

  // crea y calcula la posición de los Mesh
  starCatalogue.forEach((star, i) => {
    // Asigna la posición en Z-up y normaliza (1:100)
    const x = normalizar(star.X);
    const y = normalizar(star.Y);
    const z = normalizar(star.Z);
    // posición
    matrix.makeTranslation(x, y, z);

    stars.setMatrixAt(i, matrix);
  });

  return stars;
};

export {
  createInstancedMeshedStars,
  createInstancedMeshedStarsRandom,
  createMeshedStar,
  createMeshedStars,
  createMeshedStarsRandom,
};
