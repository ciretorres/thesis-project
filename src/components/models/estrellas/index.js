import {
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
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
 * Crea una o varias estrellas mediante SphereGeometry (Mesh)
 * @param {Number} numStars : cantidad de estrellas
 * @returns {Object3D} stars : con los Mesh de las estrellas
 */
const createMeshedStars = (numStars = 500) => {
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
 * Create una sola estrella mediante SphereGeometry (Mesh)
 * @param {Vector3} position : posición esférica en la escena
 * @returns {Mesh} sphere
 */
const createMeshedStar = (position = new Vector3(0, 2, -10)) => {
  // const starGeometry = new PlaneGeometry(0.1, 0.1);
  const material = createSphereMaterial();
  const geometry = createSphereGeometry();

  const sphere = new Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);

  return sphere;
};

/**
 * Crea una o varias instancias de estrellas mediante SphereGeometry (InstancedMesh)
 * @param {Number} numStars : cantidad de estrellas
 * @param {Vector3} position : posición esférica en la escena
 * @returns {InstancedMesh} stars : con las instancias del mesh de estrellas
 */
const createInstancedStars = (numStars = 500, position = new Vector3()) => {
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
 * Crea una o varias estrellas utilizando Sprite
 * @param {Number} numStars : cantidad de estrellas
 * @returns {Object3D} stars : con los sprites de estrellas
 */
const createSpritedStars = (numStars = 500) => {
  const stars = new Object3D();

  // crea y calcula la posición de los sprites
  for (let i = 0; i < numStars; i++) {
    // const textureLoader = new TextureLoader();
    // const spriteTexture = textureLoader.load('ruta/a/tu/textura.png');
    // const starMaterial = new SpriteMaterial({map: spriteTexture, color: 0xffffff});
    const starMaterial = new SpriteMaterial({ color: 0xffffff });
    const starSprite = new Sprite(starMaterial);

    // TODO:
    if (starSprite.id === 22) {
      // esto para indicar el objeto seleccionado
      starSprite.material.color.set("green");

      // esto para agregar propiedades al objeto Three.js con info del catálogo hipparcos
      // const obj = { hip: starSprite.id, sprite: starSprite };
      starSprite.hip = starSprite.id;
      starSprite["apparentMagnitude"] = 1;
      // console.log(starSprite);
    }

    // Genera una posición aleatoria dentro de un rango deseado;
    // const x = Math.ceil(Math.random() * 200 - 100);
    // const y = Math.ceil(Math.random() * 200 - 100);
    // const z = Math.ceil(Math.random() * 200 - 100);
    const x =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const y =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const z =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);

    // starSprite.magnitude.set(apparentMagnitude);
    // star.push(createStar(position, magnitude));

    // starSprite.position.set(x, y, z);
    // Polaris
    starSprite.position.set(
      1.3396481090837498,
      1.0446215486735597,
      132.2642231564061,
    );
    // starSprite.scale.set(0.1, 0.1, 0.1); // Tamaño pequeño
    starSprite.scale.set(1, 1, 1);

    stars.add(starSprite);
  }
  return stars;
};

const normalizar = (n) => {
  /* Scale the stellar distance from 1 pársec to 100 pixels (1:100)
   */
  return n * 10;
};

const createCatalogueStars = (starCatalogue = []) => {
  const stars = new Object3D();

  // crea y calcula la posición de los sprites
  for (let i = 0; i < starCatalogue.length; i++) {
    // const textureLoader = new TextureLoader();
    // const spriteTexture = textureLoader.load('ruta/a/tu/textura.png');
    // const starMaterial = new SpriteMaterial({map: spriteTexture, color: 0xffffff});
    const starMaterial = new SpriteMaterial({ color: 0xffffff });
    const starSprite = new Sprite(starMaterial);

    // Asigna la posición en Z-up
    const x = normalizar(starCatalogue[i].X);
    const y = normalizar(starCatalogue[i].Y);
    const z = normalizar(starCatalogue[i].Z);

    starSprite["HIP"] = starCatalogue[i].HIP;
    starSprite["RAhms"] = starCatalogue[i].RAhms;
    starSprite["DEdms"] = starCatalogue[i].DEdms;
    starSprite["Vmag"] = starCatalogue[i].Vmag;
    starSprite["ABSmag"] = starCatalogue[i].ABSmag;
    starSprite["Pc"] = starCatalogue[i].Pc;
    // starSprite.magnitude.set(apparentMagnitude);
    // star.push(createStar(position, magnitude));

    starSprite.position.set(x, y, z);
    // starSprite.scale.set(0.1, 0.1, 0.1); // Tamaño pequeño
    starSprite.scale.set(1, 1, 1);

    stars.add(starSprite);
  }
  return stars;
};

let starsSprite = new Group();
/**
 * Crea las estrellas
 * @param {Number} numStars : cantidad de estrellas
 * @returns {Group} group
 */
const createStars = ({ data = [] }) => {
  const group = new Group();

  // usando sprites
  starsSprite = createCatalogueStars(data);
  // starsSprite = createSpritedStars({ numStars = 500 });
  group.add(starsSprite);

  // usando SphereGeometry (Mesh)
  // const stars = createInstancedStars();
  // group.add(stars);

  // const star = createMeshedStar();
  // group.add(star);

  // const starsMeshed = createMeshedStars();
  // starsMeshed.forEach((star) => group.add(star));

  return group;
};

export { createStars, starsSprite };
