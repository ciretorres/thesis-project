import { Color } from "three";
import createSphericalGrid from "./grid.js";

const implementacion = (scene) => {
  // Grid, Reticula Ecuatorial
  const radio = 20;
  const color = new Color("#4488ff");
  // const color = new Color("#ff0000");
  const grid = createSphericalGrid(scene, radio, color);
  scene.add(grid);

  // Mesh para integrar a scene

  // const sphereRadius = 1;
  //   const widthSegments = 5;
  //   const heightSegments = 3;
  //   const geometry = new THREE.SphereGeometry(sphereRadius, widthSegments, heightSegments);

  // TODO: HUD/GUI
  // const gui = new GUI();

  // TODO: Instancias de esferas/estrellas
  // const sphereRadius = 1;
  //   const widthSegments = 5;
  //   const heightSegments = 3;
  //   const geometry = new THREE.SphereGeometry(sphereRadius, widthSegments, heightSegments);

  //

  // // UTILS
  // function makeInstance(geometry, color, x) {
  // /**
  //  * Creates a material that describe the appereance of objects
  //  * @see https://threejs.org/docs/index.html#api/en/constants/Materials
  //  * @see https://threejs.org/manual/#en/materials
  //  */
  // const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  //   const material = new THREE.MeshPhongMaterial({ color });
  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);
  //   cube.position.x = x;
  //   return cube;
  // }
  // const cubes = [
  //   makeInstance(geometry, 0x44aa88, 0),
  //   makeInstance(geometry, 0x8844aa, -2),
  //   makeInstance(geometry, 0xaa8844, 2),
  // ];
  // /**
  //  * Creates a material that describe the appereance of objects
  //  * @see https://threejs.org/docs/index.html#api/en/constants/Materials
  //  * @see https://threejs.org/manual/#en/materials
  //  */
  // function crearInstancia(geometria, color, posicionX, scene) {
  //   const wireframe = true;
  //   const material = new THREE.MeshBasicMaterial({
  //     color,
  //     wireframe: wireframe,
  //   });
  //   // adds the geometry to the mesh and apply the material to it
  //   const esfera = new THREE.Mesh(geometria, material);
  //   scene.add(esfera);
  //   // scene.add( mesh );
  //   esfera.position.x = posicionX;
  //   return esfera;
  // }
  // function obtenerEsferas(scene, geometria) {
  //   let colorEsfera = new THREE.Color("#7833aa");
  //   let hexadecimal = colorEsfera.getHex();
  //   return [
  //     crearInstancia(geometria, hexadecimal, 0, scene),
  //     // crearInstancia( geometry, 0x8844aa, - 2 ),
  //     // crearInstancia( geometry, 0xaa8844, 2 ),
  //   ];
  // }
  // function obtenerGeometria(gui) {
  //   /**
  //    * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
  //    */
  //   const twoPi = Math.PI * 2;
  //   const props = {
  //     // radius: 1,
  //     // widthSegments: 8,
  //     // heightSegments: 8,
  //     radius: 24,
  //     widthSegments: 32,
  //     heightSegments: 32,
  //     phiStart: Math.PI * 2,
  //     thetaStart: 0,
  //     thetaLength: Math.PI,
  //   };

  //   // TODO: hacer que cambien los valores y se actualice la geometría
  //   const folder = gui.addFolder("THREE.SphereGeometry");
  //   folder.open();
  //   // folder.close();
  //   folder.add(props, "radius", 1, 30).step(1);
  //   folder.add(props, "widthSegments", 3, 64).step(1);
  //   folder.add(props, "heightSegments", 2, 32);
  //   // folder.add( props, 'phiStart', 0, twoPi ).onChange( generateGeometry );
  //   // folder.add( props, 'phiLength', 0, twoPi ).onChange( generateGeometry );
  //   // folder.add( props, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
  //   // folder.add( props, 'thetaLength', 0, twoPi ).onChange( generateGeometry );

  //   return new THREE.SphereGeometry(
  //     props.radius,
  //     props.widthSegments,
  //     props.heightSegments,
  //   );
  // }
  // /**
  //  * Creates a geometry
  //  * @property {radius}:
  //  * @property {widthSegments}:
  //  * @property {heightSegments}:
  //  * @property {phiStart}:
  //  * @property {thetaStart}:
  //  * @property {thetaLength}:
  //  * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
  //  */
  // const createSphereGeometry = (
  //   radius = 1,
  //   widthSegments = 8,
  //   heightSegments = 8,
  //   phiStart = Math.PI * 2,
  //   thetaStart = 0,
  //   thetaLength = Math.PI,
  // ) => {
  //   const props = {
  //     radius: radius,
  //     widthSegments: widthSegments,
  //     heightSegments: heightSegments,
  //     phiStart: phiStart,
  //     thetaStart: thetaStart,
  //     thetaLength: thetaLength,
  //   };
  //   let geometry = new SphereGeometry(
  //     props.radius,
  //     props.widthSegments,
  //     props.heightSegments,
  //   );
  //   return geometry;
  // };

  return grid;
};
export default implementacion;
