console.log("console desde scripts/index");
/**
 * @see https://www.npmjs.com/package/three?activeTab=versions
 * */
import * as THREE from "three";

import WebGL from "three/addons/capabilities/WebGL.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// import * as r from "./_renderer.js";

function init() {
  r.imprime();
  // setup configurar
  function obtenerRenderer() {
    const alpha = false;
    const canvas = document.querySelector("canvas");
    return new THREE.WebGLRenderer({
      alpha: alpha,
      antialias: true,
      canvas,
    });
  }
  function obtenerEscena() {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    return scene;
  }
  function obtenerCamara() {
    const fov = 75; // degrees
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    let cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // cam.position.set(0, 0, 0);
    cam.position.z = 50;
    // cam.lookAt( 0, 0, 0 );
    return cam;
  }
  function obtenerLuz(scene) {
    const color = 0xffffff;
    const intensity = 3;
    let luz = new THREE.DirectionalLight(color, intensity);
    luz.position.set(-1, 2, 4);
    scene.add(luz);
    return luz;
  }
  function obtenerGeometria(gui) {
    /**
     * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
     */

    const twoPi = Math.PI * 2;
    const props = {
      // radius: 1,
      // widthSegments: 8,
      // heightSegments: 8,
      radius: 24,
      widthSegments: 32,
      heightSegments: 32,
      phiStart: Math.PI * 2,
      thetaStart: 0,
      thetaLength: Math.PI,
    };

    // TODO: hacer que cambien los valores y se actualice la geometría
    const folder = gui.addFolder("THREE.SphereGeometry");
    folder.open();
    // folder.close();
    folder.add(props, "radius", 1, 30).step(1);
    folder.add(props, "widthSegments", 3, 64).step(1);
    folder.add(props, "heightSegments", 2, 32);
    // folder.add( props, 'phiStart', 0, twoPi ).onChange( generateGeometry );
    // folder.add( props, 'phiLength', 0, twoPi ).onChange( generateGeometry );
    // folder.add( props, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
    // folder.add( props, 'thetaLength', 0, twoPi ).onChange( generateGeometry );

    return new THREE.SphereGeometry(
      props.radius,
      props.widthSegments,
      props.heightSegments,
    );
  }
  function crearInstancia(geometria, color, posicionX, scene) {
    /**
     * Creates a material that describe the appereance of objects
     * @see https://threejs.org/docs/index.html#api/en/constants/Materials
     * @see https://threejs.org/manual/#en/materials
     */
    const wireframe = true;
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: wireframe,
    });
    // adds the geometry to the mesh and apply the material to it
    const esfera = new THREE.Mesh(geometria, material);
    scene.add(esfera);
    // scene.add( mesh );
    esfera.position.x = posicionX;
    return esfera;
  }
  function obtenerEsferas(scene, geometria) {
    let colorEsfera = new THREE.Color("#7833aa");
    let hexadecimal = colorEsfera.getHex();
    return [
      crearInstancia(geometria, hexadecimal, 0, scene),
      // crearInstancia( geometry, 0x8844aa, - 2 ),
      // crearInstancia( geometry, 0xaa8844, 2 ),
    ];
  }
  function reescalarRendererParaMostrarTamanio(renderer, camera) {
    let canvas = renderer.domElement;
    const width = canvas.clientWidth;
    // const height = canvas.clientHeight;
    const height = window.innerHeight - 90;
    // const height = 250;
    const reescalar = canvas.width !== width || canvas.height !== height;

    if (reescalar) {
      renderer.setSize(width, height, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }
  function rotarEsferas(esferas) {
    esferas.forEach((esfera) => {
      esfera.rotation.x += 0.001;
      esfera.rotation.y += 0.001;
    });
  }
  //
  function main() {
    /**
     * Renders a view that contains your camera's "picture"
     * @use https://threejs.org/docs/api/en/renderers/WebGLRenderer.html
     */
    const renderer = obtenerRenderer();
    // const renderer = r.getRenderer();

    /**
     * A scene is the space in which you can places objects,cameras and lighting
     * @see https://threejs.org/docs/#api/en/scenes/Scene
     */
    const scene = obtenerEscena();
    // const scene = s.getScene();
    // scene.background = new THREE.Color(0xfd59d7);

    // Luces
    const light = obtenerLuz(scene);
    // const light = l.getLight(scene);
    // scene.add(light);

    /**
     * Adds a camera frustrum
     * A perspective view that simulates the behaviour of a film camera in real life
     * @see https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html
     */
    const camera = obtenerCamara();
    // const camera = c.getCamera();

    const gui = new GUI();
    // gui.close();

    // TODO: hacer una sola función
    // Geometría
    const geometria = obtenerGeometria(gui);
    // Esferas
    const esferas = obtenerEsferas(scene, geometria);

    function render() {
      // reescalando
      reescalarRendererParaMostrarTamanio(renderer, camera);

      // rotando esferas
      rotarEsferas(esferas);
      // render
      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  if (WebGL.isWebGL2Available()) {
    // Initiate function or other initializations here
    main();
    console.log(WebGL.isWebGL2Available());
  } else {
    // Mostrar mensaje de Advertencia WebGL no compatible
    const warning = WebGL.getWebGL2ErrorMessage();
    document.querySelector("main").appendChild(warning);
    //
    // // const element = document.createElement("h1");
    // const element = document.createElement("h2");
    // const textNode = document.createTextNode("Tu tarjeta gráfica no soporta ");
    // element.append(textNode);
    // const elementAnchor = document.createElement("a");
    // elementAnchor.href =
    //   "http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation";
    // elementAnchor.target = "_blank";
    // elementAnchor.rel = "noopener noreferrer";
    // const textNodeAnchor = document.createTextNode("WebGL 2");
    // elementAnchor.append(textNodeAnchor);
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
}

init();
