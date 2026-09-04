import { Frustum, Matrix4 } from "three";

/**
 * Método para actualizar culling basado en la visibilidad del frustum de la cámara
 * @param {Camera} camera
 * @param {Sprite} sprites
 * @returns {Array} visiblesSprites : con los sprites visibles
 * @see https://threejs.org/docs/#Frustum
 */
const updateCullingVisibility = (camera, sprites) => {
  // Culling personalizado
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

  // almacena los sprites visibles
  const visiblesSprites = [];

  // Verifica cada sprite contra el frustum
  sprites.children.forEach((star) => {
    const isVisible = frustum.containsPoint(star.position);
    // Verificar si la estrella está dentro del frustum de la cámara
    if (isVisible) {
      star.visible = true; // Establece visible o no según el resultado
      visiblesSprites.push(star);
    } else {
      star.visible = false;
    }
  });
  return visiblesSprites;
};

export default updateCullingVisibility;
