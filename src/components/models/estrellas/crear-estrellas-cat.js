import { Group, Object3D, Sprite, SpriteMaterial } from "three";

import normalizar from "../../../scripts/utils/normalizar.js";

const addPropsCatalog = (starSprite, star) => {
  starSprite["HIP"] = star.HIP;
  starSprite["RAhms"] = star.RAhms;
  starSprite["DEdms"] = star.DEdms;
  starSprite["Vmag"] = star.Vmag;
  starSprite["ABSmag"] = star.ABSmag;
  starSprite["Pc"] = star.Pc;
  starSprite["Ly"] = star.Ly;
};

/**
 * Método para crear a Polaris
 * @param {Number} numStars
 * @returns {Object3D} stars
 */
const createPolarisStar = (numStars = 1) => {
  const stars = new Object3D();
  // sprite
  const starMaterial = new SpriteMaterial({ color: 0xffffff });
  const starSprite = new Sprite(starMaterial);

  // color
  starSprite.material.color.set("orange");
  // info
  starSprite.HIP = 11767;
  starSprite.RAhms = "02 31 47.08";
  starSprite.DEdms = "+89 15 50.9";
  starSprite["Vmag"] = 1.97;
  starSprite["ABSmag"] = -3.637391;
  starSprite["Pc"] = 132.275132;
  starSprite["Ly"] = 431.428307;
  // console.log(starSprite);
  // Polaris
  starSprite.position.set(
    1.3396481090837498,
    1.0446215486735597,
    132.2642231564061,
  );
  // starSprite.scale.set(0.1, 0.1, 0.1); // Tamaño pequeño
  starSprite.scale.set(1, 1, 1);

  stars.add(starSprite);
  return stars;
};

/**
 * Método para crear los Sprite de las estrellas a partir del cátalogo
 * @param {Array} starCatalogue: con los datos del catálogo estelar
 * @returns {Object3D} stars
 */
const createStarsCatalogue = (starCatalogue = []) => {
  const stars = new Object3D();

  // crea y calcula la posición de los sprites
  starCatalogue.forEach((star) => {
    const starMaterial = new SpriteMaterial({ color: 0xffffff });
    const starSprite = new Sprite(starMaterial);

    // Asigna la posición en Z-up y normaliza (1:100)
    const x = normalizar(star.X);
    const y = normalizar(star.Y);
    const z = normalizar(star.Z);
    // posición
    starSprite.position.set(x, y, z);
    // starSprite.scale.set(0.1, 0.1, 0.1); // Tamaño pequeño
    starSprite.scale.set(1, 1, 1);
    // agrega estos campos del catálogo al ojeto del sprite
    addPropsCatalog(starSprite, star);

    stars.add(starSprite);
  });

  // agrega a polaris
  let polarisSprite = new Group();
  polarisSprite = createPolarisStar();
  stars.add(polarisSprite);

  return stars;
};

export default createStarsCatalogue;
