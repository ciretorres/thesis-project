import * as THREE from "three";

import WebGL from "three/addons/capabilities/WebGL.js";

import Stats from "three/addons/libs/stats.module.js";

import { TrackballControls } from "three/addons/controls/TrackballControls.js";

let perspectiveCamera, controls, scene, renderer, stats;

const params = {
  orthographicCamera: false,
};

const frustumSize = 400;

const clock = new THREE.Clock();

init();

function init() {
  stats = new Stats();
  document.body.appendChild(stats.dom);
  // select canvas
  const canvas = document.querySelector("#canvasid");

  /**
   * Renders a view that contains your camera's "picture"
   * @see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
   */
  const getRenderer = (canvas) => {
    let alpha = true;
    let renderer = new THREE.WebGLRenderer({
      alpha: alpha,
      antialias: true,
      canvas,
    });
    return renderer;
  };
  renderer = getRenderer(canvas);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setAnimationLoop(animate);
  // document.body.appendChild(renderer.domElement);

  if (WebGL.isWebGL2Available()) {
    // Initiate function or other initializations here
    renderer.setAnimationLoop(animate);
    console.log(WebGL.isWebGL2Available());
  } else {
    // Mostrar mensaje de Advertencia WebGL no compatible
    canvas.style.display = "none";
    const warning = WebGL.getWebGL2ErrorMessage();
    document.querySelector("main").appendChild(warning);
    const AdvertenciaWebGLNoCompatible = document.createElement("div");
    AdvertenciaWebGLNoCompatible.innerHTML += `
        <h2>
          Tu tarjeta gráfica no soporta
          <a
            href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation"
            target="_blank"
            rel="noopener noreferrer">
            WebGL 2
          </a>
        </h2>`;
    document
      .querySelector("#webglmessage")
      .appendChild(AdvertenciaWebGLNoCompatible);
  }

  // universe

  /**
   * a scene is the space in which you can places objects,cameras and lighting
   * @see https://threejs.org/docs/#api/en/scenes/Scene
   */
  const getScene = (backgroundColor = new THREE.Color(0x000000)) => {
    let scene = new THREE.Scene();
    scene.background = backgroundColor;
    return scene;
  };
  scene = getScene(new THREE.Color(0x000000));
  // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  /**
   * Adds a camera
   * A perspective view that simulates the behaviour of a film camera in real life
   * @property {fov}: the vertical field of view.
   * @property {aspect}: this is the aspect ratio you use to create the horizontal field of view based off the vertical.
   * @property {near}: this is the nearest plane of view (where the camera's view begins) .
   * @property {far}: this is far plane of view (where the camera's view ends).
   * new THREE.PerspectiveCamera(fov, aspect, near, far)
   * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
   */
  const getPerspectiveCamera = (
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 1,
    // near = 0.1,
    far = 1000
  ) => {
    perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return perspectiveCamera;
  };
  perspectiveCamera = getPerspectiveCamera(60);

  const cameraPositionZ = (width) => {
    if (window.innerWidth <= width) {
      return 80;
    } else {
      return 50;
    }
  };
  perspectiveCamera.position.z = cameraPositionZ(375);

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
  const getGeometry = (
    radius = 1,
    widthSegments = 8,
    heightSegments = 8,
    phiStart = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI
  ) => {
    // const twoPi = Math.PI * 2;
    const props = {
      radius: radius,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
      phiStart: phiStart,
      thetaStart: thetaStart,
      thetaLength: thetaLength,
    };
    let geometry = new THREE.SphereGeometry(
      props.radius,
      props.widthSegments,
      props.heightSegments
    );
    return geometry;
  };
  const geometry = getGeometry(24, 32, 32);

  /**
   * Creates a material that describe the appereance of objects
   * @property {color}:
   * @property {wireframe}:
   * @see https://threejs.org/docs/index.html#api/en/constants/Materials
   * @see https://threejs.org/manual/#en/materials
   */
  const getMaterial = (
    color = new THREE.Color("#ffffff"),
    wireframe = true
  ) => {
    let hexadecimal = color.getHex();
    let material = new THREE.MeshBasicMaterial({
      color: hexadecimal,
      wireframe: wireframe,
    });
    return material;
  };
  const material = getMaterial(new THREE.Color("#7833aa"));

  /**
   * Adds the geometry to the mesh and apply the material to it
   * @property {geometry}:
   * @property {material}:
   */
  const getMesh = (geometry, material) => {
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  };
  const mesh = getMesh(geometry, material);
  mesh.updateMatrix();
  // mesh.matrixAutoUpdate = false;

  // lights
  // const getLight = (color = 0xffffff, intensity = 3) => {
  //   let light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(-1, 2, 4);
  //   scene.add(light);
  //   return light;
  // };
  // const dirLight1 = getLight();
  // dirLight1.position.set(1, 1, 1);
  // const dirLight2 = getLight(0x002288);
  // dirLight2.position.set(-1, -1, -1);
  // const ambientLight = new THREE.AmbientLight(0x555555);
  // scene.add(ambientLight);

  // TODO: HUD/GUI
  // const gui = new GUI();
  // gui
  //   .add(params, "orthographicCamera")
  //   .name("use orthographic")
  //   .onChange(function (value) {
  //     controls.dispose();
  //     createTrackballControls(value ? orthographicCamera : perspectiveCamera);
  //   });

  //

  window.addEventListener("resize", onWindowResize);

  createTrackballControls(perspectiveCamera);

  function createTrackballControls(camera) {
    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.keys = ["KeyA", "KeyS", "KeyD"];
  }

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    // orthographicCamera.left = (-frustumSize * aspect) / 2;
    // orthographicCamera.right = (frustumSize * aspect) / 2;
    // orthographicCamera.top = frustumSize / 2;
    // orthographicCamera.bottom = -frustumSize / 2;
    // orthographicCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
  }

  function animate() {
    controls.update();

    render();

    stats.update();
  }

  function rotarMesh() {
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;
  }

  function render() {
    const camera = perspectiveCamera;

    rotarMesh();

    renderer.render(scene, camera);
  }
  // requestAnimationFrame(render);
}
