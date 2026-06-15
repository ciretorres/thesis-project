import { AmbientLight, DirectionalLight } from "three";

const newLights = (scene) => {
  // const light;
  // const dirLight1 = getLight();
  // dirLight1.position.set(1, 1, 1);
  // const dirLight2 = getLight(0x002288);
  // dirLight2.position.set(-1, -1, -1);
  const color = 0xffffff;
  // const color = 0x555555;
  const intensity = 1;
  const light = new AmbientLight(color, intensity);
  // const light = new AmbientLight( 0x404040 ); // soft white light
  scene.add(light);
  const lights = [];
  lights[0] = new DirectionalLight(0xffffff, 3);
  lights[0].position.set(0, 200, 0);
  scene.add(lights[0]);
  //return light;
};

export default newLights;
