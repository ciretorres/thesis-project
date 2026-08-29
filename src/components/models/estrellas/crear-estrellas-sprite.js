import { Object3D, Sprite, SpriteMaterial } from "three";

/**
 * Crea una o varias estrellas utilizando Sprite
 * @param {Number} numStars : cantidad de estrellas
 * @returns {Object3D} stars : con los sprites de estrellas
 */
const createSpritedStarsRandom = (numStars = 500) => {
  const stars = new Object3D();

  // crea y calcula la posición de los sprites
  for (let i = 0; i < numStars; i++) {
    // const textureLoader = new TextureLoader();
    // const spriteTexture = textureLoader.load('ruta/a/tu/textura.png');
    // const starMaterial = new SpriteMaterial({map: spriteTexture, color: 0xffffff});
    const starMaterial = new SpriteMaterial({ color: 0xffffff });
    const starSprite = new Sprite(starMaterial);

    // Genera una posición aleatoria dentro de un rango deseado
    // const x = Math.ceil(Math.random() * 200 - 100);
    // const y = Math.ceil(Math.random() * 200 - 100);
    // const z = Math.ceil(Math.random() * 200 - 100);
    const x =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const y =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
    const z =
      Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);

    starSprite.position.set(x, y, z);
    // starSprite.scale.set(0.1, 0.1, 0.1); // Tamaño pequeño
    starSprite.scale.set(1, 1, 1);

    stars.add(starSprite);
  }
  return stars;
};

export default createSpritedStarsRandom;
