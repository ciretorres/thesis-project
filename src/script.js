// import * as THREE from "three";
import { AxesHelper, Frustum, Group, Matrix4, Mesh } from "three";

// componentes
import camara from "./components/camara";
import newControls from "./components/controls";
import escena from "./components/escena";
import newLights from "./components/lights";
import { starsSprite } from "./components/models/estrellas";
import implementacion from "./components/models/index.js";
import newRenderer from "./components/renderer";
import newStats from "./components/stats";

// utils
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import onWindowResize from "./utils/resize.js";

// variables globales
let camera, controls, orbit, scene, renderer, stats, labelCSS2DRenderer;

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

    // Mesh para integrar a scene

    // Raycaster para detección de clics
    // let selectedObject = null;
    // const raycaster = new Raycaster();
    // const mouse = new Vector2();

    // const onMouseClick = (event) => {
    //   // console.log(event);
    //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    //   // Actualiza el raycaster
    //   raycaster.setFromCamera(mouse, camera);
    //   console.log(group.children[0]);
    //   // Intersecta con los objetos en la escena
    //   const intersects = raycaster.intersectObjects(group, true);
    //   console.log(intersects[0]);

    //   if (intersects.length > 0) {
    //     const selectedObject = intersects[0].object;
    //     console.log(selectedObject);

    //     // // Obtener información del objeto seleccionado
    //     // console.log('Objeto seleccionado:', selectedObject);
    //     // console.log('Posición actual:', selectedObject.position);

    //     // // Modificar la distancia del objeto (ejemplo: alejarlo)
    //     // selectedObject.position.z += 1; // Aumenta la distancia en el eje Z
    //   }
    // };

    // // Detección de clics en sprites
    // document.addEventListener("pointermove", onMouseClick);
    // renderer.domElement.addEventListener("click", (event) => {
    //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    //   // Actualizamos las coordenadas del mouse en el espacio de la cámara
    //   camera.updateMatrixWorld(); // make sure the camera's matrix is updated
    //   const vector = new Vector3(mouseX, mouseY, 0.5).unproject(camera);

    //   // Creamos un raycaster para detectar qué sprite fue clickeado
    //   const raycaster = new Raycaster();
    //   raycaster.setFromCamera(vector.sub(camera.position), camera);
    //   console.log(starsSprite[0].sprite);
    //   // const intersects = raycaster.intersectObjects(
    //   //   starsSprite.map((sprite) => sprite.sprite.isObject3D),
    //   // ); // Ajuste necesario porque los sprites no son objetos 3D estándar
    //   // console.log(intersects);
    //   // if (intersects.length > 0) {
    //   //   console.log("Sprite seleccionado:", intersects[0].object.userData); // Suponiendo que hay información adicional en userData
    //   //   // Ejemplo: Cambiar la distancia del sprite seleccionado a 10 unidades desde el centro
    //   //   // changeDistance(intersects[0].object, 10);
    //   // }
    // });

    //--

    const updateCullingStarsVisibility = (camera) => {
      // Culling personalizado
      // console.log(starsSprite.filter((sprite) => sprite.sprite.visible).length);

      // Actualizar la matriz de la cámara para asegurar que los cálculos sean correctos
      camera.updateMatrixWorld();

      // Obtener objetos visibles en el frustum
      const frustum = new Frustum();

      // Obtener la matriz de corte (frustum) a partir de la perspectiva actual de la cámara
      frustum.setFromProjectionMatrix(
        new Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );

      starsSprite.forEach((sprite, idx) => {
        const star = sprite.sprite;
        const isVisible = frustum.containsPoint(star.position);

        // Verificar si la estrella está dentro del frustum de la cámara
        if (isVisible) {
          star.visible = isVisible; // Establece visible o no según el resultado
          scene.add(star);
        } else {
          star.visible = isVisible; // Establece visible o no según el resultado
          scene.remove(star);
        }
      });
    };

    // render
    function render() {
      requestAnimationFrame(render);
      // group.rotation.x += 0.005;
      // group.rotation.y += 0.005;

      // rotarMesh(group);

      updateCullingStarsVisibility(camera);

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
