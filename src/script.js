// import * as THREE from "three";
import { AxesHelper, Group, Mesh } from "three";

// componentes
import camara from "./components/camara";
import newControls from "./components/controls";
import escena from "./components/escena";
import newLights from "./components/lights";
import implementacion from "./components/models/index.js";
import newRenderer from "./components/renderer";
import newStats from "./components/stats";

// utils
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import onWindowResize from "./utils/resize.js";

// variables globales
let camera, controls, orbit, scene, renderer, stats, labelCSS2DRenderer;

// let selectedObject = null;

init();

// función de inicio
function init() {
  // setup
  // selector html tags
  const p = document.querySelector("#pid");

  function rotarMesh(object = new Mesh(), value = 0.001) {
    // // mesh.rotation.x += 0.001;
    // // mesh.rotation.y += 0.001;
    // //
    object.rotation.x += value;
    object.rotation.y += value;
    //
    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * 0.1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });
  }

  main();

  function main() {
    // SCENE
    scene = escena();
    // scene.background = new Color("#302a73");

    // CAMERA
    camera = camara();
    camera.position.z = 1;
    // camera.position.z = 80;
    // camera.position.z = 5;
    camera.layers.enableAll();

    // STATS
    stats = newStats("#mainid");

    // RENDERER
    renderer = newRenderer(animate, "#mainid", "#canvasid");

    // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
    labelCSS2DRenderer = new CSS2DRenderer();
    labelCSS2DRenderer.setSize(window.innerWidth, window.innerHeight);
    // labelCSS2DRenderer.setCamera(camera);
    labelCSS2DRenderer.domElement.id = "labelcss2drendererid";
    labelCSS2DRenderer.domElement.style.position = "absolute";
    labelCSS2DRenderer.domElement.style.top = "0px";
    labelCSS2DRenderer.domElement.style.pointerEvents = "none";
    const mainid = document.querySelector("#mainid");
    mainid.appendChild(labelCSS2DRenderer.domElement);
    // document.body.appendChild(labelCSS2DRenderer.domElement);

    // CONTROLS
    orbit = newControls(camera, renderer.domElement);
    orbit.enableZoom = true;
    orbit.enableDamping = true;
    // const orbit = new OrbitControls(camera, labelCSS2DRenderer.domElement);
    // orbit.minDistance = 5;
    // orbit.maxDistance = 100;

    // LIGHTS
    newLights(scene);

    const axesHelper = new AxesHelper(5);
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    //--

    // IMPLEMENTACIÓN
    let group = new Group();
    group = implementacion(scene);
    scene.add(group);
    //console.log(group.children[0]);

    // Mesh para integrar a scene

    // // Raycaster para detección de clics
    // const raycaster = new Raycaster();
    // const pointer = new Vector2();
    // const onPointerMove = (event) => {
    //   if (selectedObject) {
    //     selectedObject.material.color.set("#fff");
    //     selectedObject = null;
    //   }
    //   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //   raycaster.setFromCamera(pointer, camera);
    //   // console.log(group)
    //   const intersects = raycaster.intersectObject(group.children[0], true);
    //   // console.log(intersects);
    //   if (intersects.length > 0) {
    //     const res = intersects.filter(function (res) {
    //       return res && res.object;
    //     })[0];
    //     if (res && res.object) {
    //       selectedObject = res.object;
    //       console.log("Objeto seleccionado:", selectedObject.uuid);
    //       selectedObject.material.color.set("#f00");
    //     }
    //   }
    // };
    // const onMouseClick = (event) => {
    //   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //   //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   //   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    //   // Actualizamos las coordenadas del mouse en el espacio de la cámara
    //   //   camera.updateMatrixWorld(); // make sure the camera's matrix is updated
    //   //   const vector = new Vector3(mouseX, mouseY, 0.5).unproject(camera);

    //   // Actualiza el raycaster
    //   raycaster.setFromCamera(pointer, camera);
    //   //   raycaster.setFromCamera(vector.sub(camera.position), camera);

    //   // // Intersecta con los objetos en la escena
    //   const intersects = raycaster.intersectObject(group.children[0], true);
    //   if (intersects.length > 0) {
    //     // console.log("Sprite seleccionado:", intersects[0].object.userData); // Suponiendo que hay información adicional en userData
    //     // Ejemplo: Cambiar la distancia del sprite seleccionado a 10 unidades desde el centro
    //     // changeDistance(intersects[0].object, 10);
    //     const res = intersects.filter(function (res) {
    //       return res && res.object;
    //     })[0];
    //     if (res && res.object) {
    //       // Obtener información del objeto seleccionado
    //       // selectedObject = res.object;
    //       // selectedObject.material.color.set("#f00");
    //       console.log("Objeto seleccionado:", res.object);
    //       console.log("Posición actual:", res.object.position);
    //       // Modificar la distancia del objeto (ejemplo: alejarlo)
    //       // selectedObject.position.z += 1; // Aumenta la distancia en el eje Z
    //     }
    //   }
    // };
    // // // Detección de clics en sprites
    // document.addEventListener("pointermove", onPointerMove);
    // renderer.domElement.addEventListener("click", onMouseClick);

    //--

    // const updateCullingStarsVisibility = (camera) => {
    //   // Culling personalizado
    //   // console.log(starsSprite.filter((sprite) => sprite.sprite.visible).length);

    //   // Actualizar la matriz de la cámara para asegurar que los cálculos sean correctos
    //   camera.updateMatrixWorld();

    //   // Obtener objetos visibles en el frustum
    //   const frustum = new Frustum();

    //   // Obtener la matriz de corte (frustum) a partir de la perspectiva actual de la cámara
    //   frustum.setFromProjectionMatrix(
    //     new Matrix4().multiplyMatrices(
    //       camera.projectionMatrix,
    //       camera.matrixWorldInverse,
    //     ),
    //   );

    //   starsSprite.forEach((sprite, idx) => {
    //     const star = sprite.sprite;
    //     const isVisible = frustum.containsPoint(star.position);

    //     // Verificar si la estrella está dentro del frustum de la cámara
    //     if (isVisible) {
    //       star.visible = isVisible; // Establece visible o no según el resultado
    //       scene.add(star);
    //     } else {
    //       star.visible = isVisible; // Establece visible o no según el resultado
    //       scene.remove(star);
    //     }
    //   });
    // };

    // render
    function render() {
      requestAnimationFrame(render);
      // group.rotation.x += 0.005;
      // group.rotation.y += 0.005;

      // rotarMesh(group);

      // updateCullingStarsVisibility(camera);

      renderer.render(scene, camera);
      // window.requestAnimationFrame(animate);

      // CSS2DRENDERER (necesario para las etiquetas CSS2DObject)
      labelCSS2DRenderer.render(scene, camera);
    }

    // resize
    window.addEventListener(
      "resize",
      () => onWindowResize(camera, renderer, labelCSS2DRenderer),
      false,
    );

    // animation
    function animate(time) {
      // console.log((time *= 0.001));
      // time *= 0.001; // convert time to seconds
      // controls.update();
      orbit.update();

      render();

      p.innerText = `x: ${camera.position.x}; y: ${camera.position.y}; z: ${camera.position.z}`;

      stats.update();
    }
    // animate();
  }
}

// exports
export const exportCamera = () => {
  // console.log(camera);
  return camera;
};
