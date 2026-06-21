import { Color, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import createSphericalGrid from "./grid.js";

const implementacion = (scene) => {
  // Mesh para integrar a scene

  const sphereRadius = 0.5;
  // const widthSegments = 5;
  // const heightSegments = 3;
  const geometry = new SphereGeometry(sphereRadius);

  // const wireframe = false;
  const material = new MeshBasicMaterial({
    color: new Color("#FFFFFF"),
    wireframe: false,
  });

  // // esfera
  // const mesh = new Mesh(geometry, material);
  // // esfera.position.set(0, 0, -0.0999); // mínima distancia de la cámara para ver completa con 0.1 de diámetro
  // mesh.position.set(0, 0, -2);
  // scene.add(mesh);
  for (let index = 0; index < 50; index++) {
    // esfera
    const mesh = new Mesh(geometry, material);
    // console.log(Math.floor(Math.random() * (10 + 1) - 1));
    const x = Math.floor(Math.random() * (100 + 1) - 1);
    const y = Math.floor(Math.random() * (100 + 1) - 1);
    const z = Math.floor(Math.random() * (100 + 1) - 1);
    // esfera.position.set(0, 0, -0.0999); // mínima distancia de la cámara para ver completa con 0.1 de diámetro
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }

  // TODO: Instancias de esferas/estrellas
  //

  // // UTILS
  /**
   * Creates a material that describe the appereance of objects
   * @see https://threejs.org/docs/index.html#api/en/constants/Materials
   * @see https://threejs.org/manual/#en/materials
   */
  function makeInstance(geometry, color, pos) {
    const material = new MeshBasicMaterial({ color, wireframe: true });
    // const material = new THREE.MeshPhongMaterial({ color });
    const cube = new Mesh(geometry, material);
    cube.position.x = pos.x;
    scene.add(cube);
    return cube;
  }
  const cubes = [
    makeInstance(geometry, 0x44aa88, new Vector3(0, 0, 0)),
    makeInstance(geometry, 0x8844aa, new Vector3(-2, 0, 0)),
    makeInstance(geometry, 0xaa8844, new Vector3(2, 0, 0)),
  ];

  /**
   * Creates a material that describe the appereance of objects
   * @see https://threejs.org/docs/index.html#api/en/constants/Materials
   * @see https://threejs.org/manual/#en/materials
   */
  function crearInstancia(geometria, color, posicionX, scene) {
    // const wireframe = true;
    const material = new MeshBasicMaterial({
      color,
      wireframe: true,
    });
    // adds the geometry to the mesh and apply the material to it
    const esfera = new Mesh(geometria, material);
    esfera.position.x = posicionX;
    scene.add(esfera);
    return esfera;
  }
  function obtenerEsferas(scene, geometria) {
    let colorEsfera = new Color("#7833aa");
    let hexadecimal = colorEsfera.getHex();
    return [
      crearInstancia(geometria, hexadecimal, 0, scene),
      // crearInstancia( geometry, 0x8844aa, - 2 ),
      // crearInstancia( geometry, 0xaa8844, 2 ),
    ];
  }
  /**
   * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
   */
  function obtenerGeometria(gui) {
    const twoPi = Math.PI * 2;
    const props = {
      // radius: 1,
      // widthSegments: 8,
      // heightSegments: 8,
      radius: 1,
      widthSegments: 32,
      heightSegments: 32,
      phiStart: Math.PI * 2,
      thetaStart: 0,
      thetaLength: Math.PI,
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
    return new SphereGeometry(
      props.radius,
      props.widthSegments,
      props.heightSegments,
    );
  }
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
    radius = 1,
    widthSegments = 8,
    heightSegments = 8,
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
    let geometry = new SphereGeometry(
      props.radius,
      props.widthSegments,
      props.heightSegments,
    );
    return geometry;
  };

  // Grid, Reticula Ecuatorial
  const radio = 1;
  // const color = new Color("#4488ff");
  const color = new Color("#ff0000");
  const grid = createSphericalGrid(scene, radio, color);
  scene.add(grid);

  // TODO: HUD/GUI
  // const gui = new GUI();

  return grid;
};
export default implementacion;
