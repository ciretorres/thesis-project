import {
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

/**
 * Creates a material that describe the appereance of objects
 * @property {color}:
 * @property {wireframe}:
 * @see https://threejs.org/docs/index.html#api/en/constants/Materials
 * @see https://threejs.org/manual/#en/materials
 */
const createMeshBasicMaterial = (
  color = new Color("#ffffff"),
  wireframe = true,
) => {
  let hexadecimal = color.getHex();
  let material = new MeshBasicMaterial({
    color: hexadecimal,
    wireframe: wireframe,
  });
  return material;
};

/**
 * Adds the geometry to the mesh and apply the material to it
 * @property {geometry}:
 * @property {material}:
 */
const createMesh = (geometry, material) => {
  let mesh = new Mesh(geometry, material);
  // scene.add(mesh);
  return mesh;
};
function eventos(mesht) {
  // Eventos del teclado
  document.addEventListener("keydown", function (event) {
    if (event.key === "Meta") {
      console.log("Meta key pressed");
      mesht.rotation.z -= 0.1;
      console.log("mesht.rotation.z", mesht.rotation.z);
    }
    if (event.key === "Alt") {
      console.log("Alt key pressed");
      mesht.rotation.z += 0.1;
      console.log("mesht.rotation.z", mesht.rotation.z);
    }
    if (event.key === "ArrowLeft") {
      console.log("ArrowLeft key pressed");
      mesht.rotation.x -= 0.1;
      console.log("mesht.rotation.x", mesht.rotation.x);
    }
    if (event.key === "ArrowRight") {
      console.log("ArrowRight key pressed");
      mesht.rotation.x += 0.1;
      console.log("mesht.rotation.x", mesht.rotation.x);
    }
    if (event.key === "ArrowDown") {
      console.log("ArrowRight key pressed");
      mesht.rotation.y -= 0.1;
      console.log("mesht.rotation.y", mesht.rotation.y);
    }
    if (event.key === "ArrowUp") {
      console.log("ArrowLeft key pressed");
      mesht.rotation.y += 0.1;
      console.log("mesht.rotation.y", mesht.rotation.y);
    }
    if (event.key === "a") {
      console.log("A key pressed");
      mesht.position.x -= 0.1;
      console.log("mesht.position.x", mesht.position.x);
    }
    if (event.key === "d") {
      console.log("D key pressed");
      mesht.position.x += 0.1;
      console.log("mesht.position.x", mesht.position.x);
    }
    if (event.key === "w") {
      console.log("W key pressed");
      mesht.position.y += 0.1;
      console.log("mesht.position.y", mesht.position.y);
    }
    if (event.key === "s") {
      console.log("S key pressed");
      mesht.position.y -= 0.1;
      console.log("mesht.position.y", mesht.position.y);
    }
    if (event.key === "e") {
      console.log("E key pressed");
      mesht.position.z += 0.1;
      console.log("mesht.position.z", mesht.position.z);
    }
    if (event.key === "q") {
      console.log("Q key pressed");
      mesht.position.z -= 0.1;
      console.log("mesht.position.z", mesht.position.z);
    }
  });
}
function alinearTexto(mesht, array, j, x, y, z) {
  let dx;
  let dy;
  let dz;

  // Rotar y alinear según la posición
  if (array.indexOf(j) === 0) {
    // console.log(j);
    // 0 / 360
    dz = z + 0.1;
    dy = y + 0.2;
    mesht.rotation.y = mesht.rotation.y - Math.PI / 2;
    // console.log(-Math.PI / 2); // -1.57
    mesht.position.set(x, dy, dz);
  } else {
    if (array.indexOf(j) === 1) {
      // 15
      dz = z + 0.1;
      dy = y + 0.2;
      mesht.rotation.y = mesht.rotation.y - Math.PI / 1.5;
      // console.log(-Math.PI / 1.5); // -1.57
      mesht.position.set(x, dy, dz);
    } else {
      if (array.indexOf(j) === 2) {
        // 30
        // eventos(mesht);
        dz = z + 0.1;
        dy = y + 0.2;
        mesht.rotation.y = mesht.rotation.y - Math.PI / 1.4;
        // console.log(-Math.PI / 1.5); // -2.09
        mesht.position.set(x, dy, dz);
      } else {
        if (array.indexOf(j) === 3) {
          // 45
          dx = x - 0.19;
          dy = y + 0.2;
          mesht.rotation.y = mesht.rotation.y - Math.PI / 1.35;
          // console.log(-Math.PI / 1.35); // -2.32
          mesht.position.set(dx, dy, z);
        } else {
          if (array.indexOf(j) === 4) {
            // 60
            // eventos(mesht);
            dx = x - 0.19;
            dy = y + 0.2;
            mesht.rotation.y = mesht.rotation.y - Math.PI / 1.15;
            // console.log(-Math.PI / 1.15); // -2.73
            mesht.position.set(dx, dy, z);
          } else {
            if (array.indexOf(j) === 5) {
              // 75
              // eventos(mesht);
              dx = x - 0.19;
              dy = y + 0.2;
              mesht.rotation.y = mesht.rotation.y - Math.PI / 1.1;
              // console.log(-Math.PI / 1.1); // -2.85
              mesht.position.set(dx, dy, z);
            } else {
              if (array.indexOf(j) === 6) {
                // 90
                dx = x - 0.19;
                dy = y + 0.2;
                mesht.rotation.y = mesht.rotation.y - Math.PI;
                // console.log(-Math.PI); // -3.14
                mesht.position.set(dx, dy, z);
              } else {
                if (array.indexOf(j) === 7) {
                  // 105
                  dx = x - 0.3;
                  dy = y + 0.2;
                  mesht.rotation.y = mesht.rotation.y - Math.PI * 1.1;
                  // console.log(-Math.PI * 1.25); // -3.92
                  // console.log(Math.PI / 1.35); // 2.32
                  mesht.position.set(dx, dy, z);
                } else {
                  if (array.indexOf(j) === 8) {
                    // 120
                    dx = x - 0.3;
                    dy = y + 0.2;
                    mesht.rotation.y = mesht.rotation.y - Math.PI * 1.2;
                    // console.log(-Math.PI * 1.25); // -3.92
                    // console.log(Math.PI / 1.35); // 2.32
                    mesht.position.set(dx, dy, z);
                  } else {
                    if (array.indexOf(j) === 9) {
                      // 135
                      dx = x - 0.3;
                      dy = y + 0.2;
                      mesht.rotation.y = mesht.rotation.y - Math.PI * 1.3;
                      // console.log(-Math.PI * 1.25); // -3.92
                      // console.log(Math.PI / 1.35); // 2.32
                      mesht.position.set(dx, dy, z);
                    } else {
                      if (array.indexOf(j) === 10) {
                        // 150
                        // eventos(mesht);
                        dz = z - 0.1;
                        dy = y + 0.2;
                        mesht.rotation.y = mesht.rotation.y - Math.PI * 1.35;
                        // console.log(-Math.PI * 1.35); // -4.24
                        mesht.position.set(x, dy, dz);
                      } else {
                        if (array.indexOf(j) === 11) {
                          // 165
                          dz = z - 0.1;
                          dy = y + 0.2;
                          mesht.rotation.y = mesht.rotation.y - Math.PI * 1.45;
                          // console.log(-Math.PI * 1.45); // -4.55
                          mesht.position.set(x, dy, dz);
                        } else {
                          if (array.indexOf(j) === 12) {
                            // 180
                            dz = z - 0.1;
                            dy = y + 0.2;
                            mesht.rotation.y = mesht.rotation.y - Math.PI * 1.5;
                            // console.log(-Math.PI * 1.5); // -4.71
                            // console.log(Math.PI / 2); // 1.57
                            mesht.position.set(x, dy, dz);
                          } else {
                            if (array.indexOf(j) === 13) {
                              // 225
                              dx = x + 0.1;
                              dy = y + 0.2;
                              mesht.rotation.y =
                                mesht.rotation.y - Math.PI * 1.6;
                              // console.log(-Math.PI * 1.6); // -5.02
                              mesht.position.set(dx, dy, z);
                            } else {
                              if (array.indexOf(j) === 14) {
                                // 225
                                dx = x + 0.1;
                                dy = y + 0.2;
                                mesht.rotation.y =
                                  mesht.rotation.y - Math.PI * 1.7;
                                // console.log(-Math.PI * 1.7); // -5.34
                                mesht.position.set(dx, dy, z);
                              } else {
                                if (array.indexOf(j) === 15) {
                                  // 225
                                  dx = x + 0.1;
                                  dy = y + 0.2;
                                  mesht.rotation.y =
                                    mesht.rotation.y - Math.PI * 1.8;
                                  // console.log(-Math.PI * 1.8); // -5.65
                                  mesht.position.set(dx, dy, z);
                                } else {
                                  if (array.indexOf(j) === 16) {
                                    // 240
                                    dx = x + 0.1;
                                    dy = y + 0.2;
                                    mesht.rotation.y =
                                      mesht.rotation.y + Math.PI / 8;
                                    // console.log(Math.PI / 8); // -0.39
                                    mesht.position.set(dx, dy, z);
                                  } else {
                                    if (array.indexOf(j) === 17) {
                                      // 255
                                      // eventos(mesht);
                                      dx = x + 0.1;
                                      dy = y + 0.2;
                                      mesht.rotation.y =
                                        mesht.rotation.y + Math.PI / 30;
                                      // console.log(Math.PI / 30); // 0.104
                                      mesht.position.set(dx, dy, z);
                                    } else {
                                      if (array.indexOf(j) === 18) {
                                        // 270
                                        // eventos(mesht);
                                        dx = x + 0.1;
                                        dy = y + 0.2;
                                        // no rotación
                                        //
                                        mesht.position.set(dx, dy, z);
                                      } else {
                                        if (array.indexOf(j) === 19) {
                                          // 285
                                          // eventos(mesht);
                                          dx = x + 0.1;
                                          dy = y + 0.2;
                                          mesht.rotation.y =
                                            mesht.rotation.y - Math.PI / 10.5;
                                          // console.log(-Math.PI / 10.5); // -0.29
                                          //
                                          mesht.position.set(dx, dy, z);
                                        } else {
                                          if (array.indexOf(j) === 20) {
                                            // 300
                                            // eventos(mesht);
                                            dx = x + 0.1;
                                            dy = y + 0.2;
                                            mesht.rotation.y =
                                              mesht.rotation.y - Math.PI / 5;
                                            // console.log(-Math.PI / 5); // -0.62
                                            mesht.position.set(dx, dy, z);
                                          } else {
                                            if (array.indexOf(j) === 21) {
                                              // 315
                                              // eventos(mesht);
                                              dx = x + 0.2;
                                              dy = y + 0.2;
                                              mesht.rotation.y =
                                                mesht.rotation.y -
                                                Math.PI / 3.5;
                                              // console.log(-Math.PI / 3.5); // -0.89
                                              mesht.position.set(dx, dy, z);
                                            } else {
                                              if (array.indexOf(j) === 22) {
                                                // 330
                                                // eventos(mesht);
                                                dx = x + 0.2;
                                                dy = y + 0.2;
                                                mesht.rotation.y =
                                                  mesht.rotation.y -
                                                  Math.PI / 3;
                                                // console.log(-Math.PI / 3); // -1.04
                                                mesht.position.set(dx, dy, z);
                                              } else {
                                                if (array.indexOf(j) === 23) {
                                                  // 345
                                                  // eventos(mesht);
                                                  dx = x + 0.2;
                                                  dy = y + 0.2;
                                                  mesht.rotation.y =
                                                    mesht.rotation.y -
                                                    Math.PI / 2.5;
                                                  // console.log(-Math.PI / 2.5); // -1.25
                                                  mesht.position.set(dx, dy, z);
                                                } else {
                                                  if (array.indexOf(j) === 24) {
                                                    // 360
                                                    console.log(j);
                                                    dz = z + 0.1;
                                                    dy = y + 0.6;
                                                    mesht.rotation.y =
                                                      mesht.rotation.y -
                                                      Math.PI / 2;
                                                    // console.log(-Math.PI / 2); // -1.57
                                                    mesht.position.set(
                                                      x,
                                                      dy,
                                                      dz,
                                                    );
                                                  } else {
                                                    mesht.position.set(x, y, z);
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
async function etiquetas(scene, size = 0.25, texto, j, x, y, z) {
  const loader = new FontLoader();
  let font = await loader.loadAsync("helvetiker_regular.typeface.json");
  const array = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
    255, 270, 285, 300, 315, 330, 345,
  ];
  if (array.includes(j) && texto !== 90 && texto !== -90) {
    // console.log(font);
    // const textG = new TextGeometry(`${array.indexOf(j)} ${texto}° (${j})`, {
    const textG = new TextGeometry(`${texto}°`, {
      font: font,
      size: size,
      depth: 0,
      curveSegments: 12,
      bevelEnabled: false,
    });
    textG.computeBoundingBox();

    let materialt = new MeshBasicMaterial({ color: "white" });
    let mesht = new Mesh(textG, materialt);

    // Ajustar texto para ver en grid
    alinearTexto(mesht, array, j, x, y, z);

    // mesht.position.set(x, y, z);
    scene.add(mesht);
  }
}

async function etiquetasAscRect(scene, size = 0.25, texto, j, x, y, z) {
  const loader = new FontLoader();
  let font = await loader.loadAsync("helvetiker_regular.typeface.json");
  const array = [-90, -70, -50, -30, -10, 10, 30, 50, 70, 90];
  if (array.includes(j)) {
    // if (true) {
    // console.log(font);
    // const textG = new TextGeometry(`${array.indexOf(j)} ${texto}° (${j})`, {
    const textG = new TextGeometry(`${texto}°`, {
      font: font,
      size: size,
      depth: 0,
      curveSegments: 12,
      bevelEnabled: false,
    });
    textG.computeBoundingBox();

    let materialt = new MeshBasicMaterial({ color: "white" });
    let mesht = new Mesh(textG, materialt);

    // Ajustar texto para ver en grid
    // alinearTexto(mesht, array, j, x, y, z);

    // console.log(-Math.PI / 2 - array.indexOf(j) / 10); // -1.57

    if (texto >= 0 && texto <= 360) {
      let dx = x - 0.19;
      let dy = y + 0.2;

      mesht.rotation.z = mesht.rotation.z + Math.PI / 2;

      if (texto === 360) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 2;
      }
      if (texto === 345) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 2.1;
      }
      if (texto === 330) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 2.2;
      }
      if (texto === 315) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 2.5;
      }
      if (texto === 300) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 3.5;
      }
      if (texto === 285) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 10;
      }
      if (texto === 255) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 10;
      }
      if (texto === 240) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 3.5;
      }
      if (texto === 225) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 2.5;
      }
      if (texto === 210) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 2.2;
      }
      if (texto === 195) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 2.1;
      }
      if (texto === 180) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 2;
      }
      if (texto === 165) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 1.9;
      }
      if (texto === 150) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 1.8;
      }
      if (texto === 135) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 1.5;
      }
      if (texto === 120) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 1.3;
      }
      if (texto === 105) {
        mesht.rotation.y = mesht.rotation.y + Math.PI / 1.1;
      }
      if (texto === 90) {
        mesht.rotation.y = mesht.rotation.y - Math.PI;
      }
      if (texto === 75) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 1.1;
      }
      if (texto === 60) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 1.3;
      }
      if (texto === 45) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 1.5;
      }
      if (texto === 30) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 1.8;
      }
      if (texto === 15) {
        mesht.rotation.y = mesht.rotation.y - Math.PI / 1.9;
      }
      mesht.position.set(dx, dy, z);
    } else {
      // mesht.rotation.z = mesht.rotation.z + Math.PI / 2;
      // mesht.position.set(x, y, z);
    }

    // mesht.position.set(x, y, z);
    scene.add(mesht);
  }
}

const grid = (scene) => {
  // Ejemplo de texto
  async function etiquetasTextGeometry() {
    const loader = new FontLoader();
    let font = await loader.loadAsync("helvetiker_regular.typeface.json");
    const textG = new TextGeometry(`hwllo world`, {
      font: font,
      size: 0.25,
      depth: 0,
      curveSegments: 12,
      bevelEnabled: false,
    });
    textG.computeBoundingBox();

    let materialt = new MeshBasicMaterial({ color: "white" });
    let mesht = new Mesh(textG, materialt);

    // // Eventos del teclado
    // document.addEventListener("keydown", function (event) {
    //   if (event.key === "ArrowLeft") {
    //     console.log("ArrowLeft key pressed");
    //     mesht.rotation.x -= 0.1;
    //     console.log(mesht.rotation.x);
    //   }
    //   if (event.key === "ArrowRight") {
    //     console.log("ArrowRight key pressed");
    //     mesht.rotation.x += 0.1;
    //     console.log(mesht.rotation.x);
    //   }
    //   if (event.key === "ArrowDown") {
    //     console.log("ArrowRight key pressed");
    //     mesht.rotation.y -= 0.1;
    //     console.log(mesht.rotation.y);
    //   }
    //   if (event.key === "ArrowUp") {
    //     console.log("ArrowLeft key pressed");
    //     mesht.rotation.y += 0.1;
    //     console.log(mesht.rotation.y);
    //   }
    //   if (event.key === "a") {
    //     console.log("A key pressed");
    //     mesht.position.x -= 0.1;
    //     console.log(mesht.position.x);
    //   }
    //   if (event.key === "d") {
    //     console.log("D key pressed");
    //     mesht.position.x += 0.1;
    //     console.log(mesht.position.x);
    //   }
    // });

    mesht.position.set(0, 0, -10);
    scene.add(mesht);
  }
  etiquetasTextGeometry();

  // Ejemplo de Código para Retícula Ecuatorial
  // Grid, Reticula Ecuatorial

  const group = new Group();

  const radio = 20;

  // Declinación
  function gridDeclinationLines() {
    // 9 líneas de declinación de -90° a 90° de 20° en 20°
    const start1 = -90;
    const condition1 = 90;
    const step1 = 20;
    const start2 = 0;
    const condition2 = 360;

    for (let i = start1; i <= condition1; i += step1) {
      const pi = Math.PI;
      const points = [];

      for (let j = start2; j <= condition2; j++) {
        // // aquí cambia con declination
        const dec = (i * pi) / 180;
        const ra = (j * pi) / 180;

        // forma uno z-up
        // const x = radio * Math.sin(lat) * Math.cos(lon);
        // const y = radio * Math.sin(lat) * Math.sin(lon);
        // const z = radio * Math.cos(lat);
        // forma dos y-up
        // const x = radio * Math.sin(lat) * Math.cos(lon);
        // const y = radio * Math.cos(lat);
        // const z = radio * Math.sin(lat) * Math.sin(lon);
        // forma tres x-up
        // const x = radio * Math.cos(lat);
        // const y = radio * Math.sin(lat) * Math.cos(lon);
        // const z = radio * Math.sin(lat) * Math.sin(lon);

        // forma cuatro y-up
        const x = radio * Math.cos(dec) * Math.cos(ra);
        const y = radio * Math.sin(dec);
        const z = radio * Math.cos(dec) * Math.sin(ra);

        // Elige qué ángulo de declinación quieres calcular
        // if ([70, 50].includes(i)) {
        //   // console.log(x, y, z);
        //   points.push(new Vector3(x, y, z));
        // }
        points.push(new Vector3(x, y, z));
        // Etiquetas
        etiquetas(scene, 0.25, i, j, x, y, z);
      }

      const geometry = new BufferGeometry().setFromPoints(points);

      // const material = createMeshBasicMaterial(new Color("#ff0000"));
      // const material = createMeshBasicMaterial(new Color("#7833aa"));
      // const material = createMeshBasicMaterial(new Color("#4488ff"));
      const material = new LineBasicMaterial({
        color: 0xff0000,
        // transparent: true,
        // opacity: 0.6,
      });

      // const mesh = createMesh(geometry, material);
      // mesh.updateMatrix();
      // mesh.matrixAutoUpdate = false;
      const line = new Line(geometry, material);

      line.updateMatrix();
      // scene.add(line);
      group.add(line);
      scene.add(group);

      // Etiquetas
      // if ([253, 270, 287].includes(ra)) {
      //   // scene.add(sprite);
      //   group.add(sprite);
      //   scene.add(group);
      // }
    }
  }

  // Ascesión recta
  function gridAscesionLines() {
    // 24 lineas de ascención recta de 0° a 360° de 15° en 15°
    const start1 = 0;
    const condition1 = 360;
    const step1 = 15;
    const start2 = -90;
    const condition2 = 90;

    for (let i = start1; i <= condition1; i += step1) {
      const pi = Math.PI;
      const points = [];
      const angulosRectos = [0, 90, 180, 270, 360];
      // console.log(i);
      if (angulosRectos.includes(i)) {
        for (let j = start2; j <= condition2; j++) {
          // aquí cambia con ascensión
          const ra = (i * pi) / 180;
          const dec = (j * pi) / 180;

          // forma cuatro y-up
          const x = radio * Math.cos(dec) * Math.cos(ra);
          const y = radio * Math.sin(dec);
          const z = radio * Math.cos(dec) * Math.sin(ra);

          // Para visualizar una por una
          // if ([0, 180].includes(i)) {
          //   // // console.log(x, y, z);
          //   points.push(new Vector3(x, y, z));
          // }
          points.push(new Vector3(x, y, z));
          // Etiquetas
          if (i !== 0) {
            etiquetasAscRect(scene, 0.25, i, j, x, y, z);
          }
        }
      } else {
        // esto soluciona que las líneas no lleguen hasta -90° o 90
        for (let j = -70; j <= 70; j++) {
          // aquí cambia con ascensión
          const ra = (i * pi) / 180;
          const dec = (j * pi) / 180;

          // forma cuatro y-up
          const x = radio * Math.cos(dec) * Math.cos(ra);
          const y = radio * Math.sin(dec);
          const z = radio * Math.cos(dec) * Math.sin(ra);
          // Para visualizar una por una
          // if ([15, 30].includes(i)) {
          //   // console.log(x, y, z);
          //   points.push(new Vector3(x, y, z));
          // }
          points.push(new Vector3(x, y, z));
          // Etiquetas
          etiquetasAscRect(scene, 0.25, i, j, x, y, z);
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
      // scene.add(line);
      group.add(line);
      scene.add(group);
    }
  }

  function gridEcuatorialLines(coordinates) {
    if (coordinates === "declination") {
      gridDeclinationLines();
    } else {
      if (coordinates === "ascension") {
        gridAscesionLines();
      } else {
        gridDeclinationLines();
        gridAscesionLines();
      }
    }
  }

  // Líneas de Declinación (paralelos al ecuador celestial)
  // gridEcuatorialLines("declination");

  // Líneas de Ascensión Recta (meridianos que pasan por los polos)
  // gridEcuatorialLines("ascension");

  // Todas
  gridEcuatorialLines();

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

  // // LINE
  // const lineBasicMaterial = new LineBasicMaterial({ color: 0xff0000 });
  // const points = [];
  // points.push(
  //   new Vector3(0, 0, -98.07852804032305),
  //   new Vector3(
  //     31.81896451432087,
  //     -76.81777567114163,
  //     -55.55702330196019,
  //   ),
  // );
  // const bufferGeometryPoints = new BufferGeometry().setFromPoints(
  //   points,
  // );
  // console.log(bufferGeometryPoints);
  // const lineVertical = new Line(
  //   bufferGeometryPoints,
  //   lineBasicMaterial,
  // );
  // scene.add(lineVertical);

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

  return group;
};
export default grid;
