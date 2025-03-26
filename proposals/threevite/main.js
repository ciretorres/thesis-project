import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";

import { FlyControls } from "three/addons/controls/FlyControls.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

let perspectiveCamera,
  orthographicCamera,
  controls,
  controls2,
  scene,
  renderer,
  stats;

const params = {
  orthographicCamera: false,
};

const frustumSize = 400;

const clock = new THREE.Clock();

init();

function init() {
  // select canvas
  const canvas = document.querySelector("#canvasid");

  /**
   * Renders a view that contains your camera's "picture"
   * @use https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
   */
  const getRenderer = (canvas) => {
    let alpha = true;
    return new THREE.WebGLRenderer({
      alpha: alpha,
      antialias: true,
      canvas,
    });
  };
  renderer = getRenderer(canvas);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  // document.body.appendChild(renderer.domElement);

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

  const aspect = window.innerWidth / window.innerHeight;
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
    far = 1000
  ) => {
    perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return perspectiveCamera;
  };
  perspectiveCamera = getPerspectiveCamera(60, aspect, 0.1);

  const cameraPositionZ = (width) => {
    if (window.innerWidth <= width) {
      return 80;
    } else {
      return 50;
    }
  };
  perspectiveCamera.position.z = cameraPositionZ(375);

  orthographicCamera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  );
  orthographicCamera.position.z = 50;

  // Creates a box, geometry, 3d model, cube or mesh
  const radius = 24;
  const geometry = new THREE.SphereGeometry(radius, 32, 32);

  let color = new THREE.Color("#7833aa");
  let hex = color.getHex();
  let wireframe = true;
  const material = new THREE.MeshBasicMaterial({
    color: hex,
    wireframe: wireframe,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.updateMatrix();
  // mesh.matrixAutoUpdate = false;
  scene.add(mesh);

  // lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight1.position.set(1, 1, 1);
  // scene.add(dirLight1);
  const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
  dirLight2.position.set(-1, -1, -1);
  // scene.add(dirLight2);
  const ambientLight = new THREE.AmbientLight(0x555555);
  // scene.add(ambientLight);

  //

  stats = new Stats();
  document.body.appendChild(stats.dom);

  //

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

  // createFlyControls(perspectiveCamera);

  function createTrackballControls(camera) {
    controls = new TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = ["KeyA", "KeyS", "KeyD"];
  }

  function createFlyControls(camera) {
    controls2 = new FlyControls(camera, renderer.domElement);

    controls2.movementSpeed = 1000;
    controls2.domElement = renderer.domElement;
    controls2.rollSpeed = Math.PI / 24;
    controls2.autoForward = false;
    controls2.dragToLook = false;
  }

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    orthographicCamera.left = (-frustumSize * aspect) / 2;
    orthographicCamera.right = (frustumSize * aspect) / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = -frustumSize / 2;
    orthographicCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
  }

  function animate() {
    controls.update();

    render();

    stats.update();
  }

  function render() {
    const camera = params.orthographicCamera
      ? orthographicCamera
      : perspectiveCamera;

    // const delta = clock.getDelta();
    // const rotationSpeed = 0.02;
    // mesh.rotation.y += rotationSpeed * delta;
    // controls2.movementSpeed = 33;
    // controls2.update(delta);

    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;

    renderer.render(scene, camera);
  }
}
