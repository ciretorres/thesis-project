import { Color, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { Group } from "three/examples/jsm/libs/tween.module.js";
// Instancias de esferas/estrellas
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
  widthSegments = 32,
  heightSegments = 32,
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

const createSphereMaterial = () => {
  // const wireframe = false;
  let colorEsfera = new Color("#7833aa");
  // let colorEsfera = new Color("#8844aa");
  // let colorEsfera = new Color("#aa8844");
  // let colorEsfera = new Color("#FFFFFF");
  let hexadecimal = colorEsfera.getHex();

  // const material = new THREE.MeshPhongMaterial({ color });
  const material = new MeshBasicMaterial({
    color: colorEsfera,
    wireframe: true,
  });
  return material;
};

/**
 * Creates a material that describe the appereance of objects
 * @see https://threejs.org/docs/index.html#api/en/constants/Materials
 * @see https://threejs.org/manual/#en/materials
 */
const createInstance = (pos) => {
  // console.log("createInstance");
  // adds the geometry to the mesh and apply the material to it
  const geometry = createSphereGeometry();
  const material = createSphereMaterial();

  const esfera = new Mesh(geometry, material);

  esfera.position.x = pos.x;
  esfera.position.y = pos.y;
  esfera.position.z = pos.z;

  return esfera;
};

const createStars = (limit = 1) => {
  let group = new Group();
  const esferas = [];
  // console.log("obtenerEsferas");
  // return [
  //   createInstance(scene, new Vector3(0, 0, -2)),
  //   // createInstance(scene, new Vector3(-2, 0, 0)),
  //   // createInstance(scene, new Vector3(2, 0, 0)),
  // ];
  for (let index = 0; index < limit; index++) {
    // prueba con valores aleatorios
    const x =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const y =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const z =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);

    esferas.push(createInstance(new Vector3(x, y, z)));
  }
  group = esferas;
  return group;
};
// obtenerEsferas();
// console.log(instEsferas.length);
// instEsferas.forEach((esfera) => scene.add(esfera));

export { createStars };
