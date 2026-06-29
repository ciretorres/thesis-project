/**
 * Método para que el grid siga la posición de la cámara
 * @param {Object} lastCamPos : con la última posición de la cámara registrada
 * @param {Object} cam : con la cámara a seguir
 * @param {Object} grid : el objeto que debe seguir
 * @returns {Object} con las posiciones actualizadas o las mismas
 */
const cameraFollowGrid = (lastCamPos, cam, grid) => {
  // si la cámara cambia de posición
  if (
    lastCamPos.x !== cam.position.x ||
    lastCamPos.y !== cam.position.y ||
    lastCamPos.z !== cam.position.z
  ) {
    // actualiza posición del grid
    grid.position.set(cam.position.x, cam.position.y, cam.position.z);

    // regresa nueva posición
    return {
      x: cam.position.x,
      y: cam.position.y,
      z: cam.position.z,
    };
  } else {
    // si no se ha movido
    return {
      x: lastCamPos.x,
      y: lastCamPos.y,
      z: lastCamPos.z,
    };
  }
};

export default cameraFollowGrid;
