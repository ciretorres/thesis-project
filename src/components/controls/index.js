// módulo para rotar y zoom en la escena
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const newControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  return controls;
};

export default newControls;
