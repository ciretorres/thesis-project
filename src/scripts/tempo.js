import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  WireframeGeometry,
} from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const twoPi = Math.PI * 2;

function updateGroupGeometry(mesh, geometry) {
  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new WireframeGeometry(geometry);
  // mesh.children[1].geometry = geometry;

  // these do not update nicely together if shared
}

const guis = {
  SphereGeometry: function (mesh) {
    const data = {
      radius: 15,
      widthSegments: 32,
      heightSegments: 16,
      phiStart: 0,
      phiLength: twoPi,
      thetaStart: 0,
      thetaLength: Math.PI,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new SphereGeometry(
          data.radius,
          data.widthSegments,
          data.heightSegments,
          data.phiStart,
          data.phiLength,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    generateGeometry();
  },
};

function chooseFromHash(mesh) {
  // const selectedGeometry = window.location.hash.substring( 1 ) || 'TorusGeometry';
  const selectedGeometry =
    window.location.hash.substring(1) || "SphereGeometry";

  if (guis[selectedGeometry] !== undefined) {
    guis[selectedGeometry](mesh);
  }
}

/**
 * a scene is the space in which you can places objects,cameras and lighting
 * @property {backgroundColor}: of the scene.
 * @see https://threejs.org/docs/#api/en/scenes/Scene
 */
const createScene = (backgroundColor = new Color(0x444444)) => {
  let scene = new Scene();
  scene.background = backgroundColor;
  return scene;
};

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
const createPerspectiveCamera = (
  fov = 75,
  aspect = window.innerWidth / window.innerHeight,
  near = 1,
  far = 1000,
) => {
  let perspectiveCamera = new PerspectiveCamera(fov, aspect, near, far);
  return perspectiveCamera;
};

/**
 * Renders a view that contains your camera's "picture"
 * @property {canvas}: in which will render the scene and camera.
 * @property {alpha}: Controls the default clear alpha value. When set totrue, the value is 0. Otherwise it's 1. Default is false.
 * @property {antialias}: Whether to use the default MSAA or not. Default is false.
 * @see https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
 */
const createWebGLRenderer = (canvas, alpha = false, antialias = true) => {
  return canvas === undefined
    ? new WebGLRenderer({
        alpha,
        antialias,
      })
    : new WebGLRenderer({
        canvas,
        alpha,
        antialias,
      });
};

/**
 * Resize and update the size of render and camera aspect
 * @property {camera}:
 * * @property {renderer}:
 */
function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const selectedGeometry = window.location.hash.substring(1);

// scene
const scene = createScene(new Color(0x000000));

// camera
const camera = createPerspectiveCamera(75);
camera.near = 0.1;
camera.far = 50;
camera.position.z = 30;

// renderer
const canvas = document.querySelector("#canvasid");
const renderer = createWebGLRenderer(canvas);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

// lights
const color = 0xffffff;
const intensity = 1;
const light = new AmbientLight(color, intensity);
// const light = new AmbientLight( 0x404040 ); // soft white light
scene.add(light);
const lights = [];
lights[0] = new DirectionalLight(0xffffff, 3);
lights[0].position.set(0, 200, 0);
scene.add(lights[0]);

const group = new Group();

// geometry
const geometry = new BufferGeometry();
geometry.setAttribute("position", new Float32BufferAttribute([], 3));

// material
const lineMaterial = new LineBasicMaterial({
  color: 0x429ad2,
  transparent: true,
  opacity: 0.5,
});
const meshMaterial = new MeshPhongMaterial({
  color: 0x156289,
  // color: 0xffffff,
  emissive: 0x072534,
  side: DoubleSide,
  flatShading: true,
});

// Line, Mesh
group.add(new LineSegments(geometry, lineMaterial)); // las líneas blancas
group.add(new Mesh(geometry, meshMaterial)); // el globo azul

chooseFromHash(group); // SphereGeometry

scene.add(group);

//
function render() {
  requestAnimationFrame(render);

  // group.rotation.x += 0.005;
  // group.rotation.y += 0.005;

  renderer.render(scene, camera);
}

// Resize
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false,
);

render();
