// Métodos para zoom
export const increasePositionZ = (camera) => {
  camera.position.z += 5;
};

export const decreasePositionZ = (camera) => {
  camera.position.z -= 5;
};

export const resetPosition = (camera) => {
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  // camera.position.z = 1.0; // vista hacia el sur
  camera.position.z = -1.0; // vista hacia el norte
};
