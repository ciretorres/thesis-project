import { Group } from "three";

import createStarsCatalogue from "./crear-estrellas-catalogo";

// import {
//   createInstancedMeshedStars,
//   createInstancedMeshedStarsRandom,
//   createMeshedStar,
// } from "./crear-estrellas-mesh";

// import createSpritedStarsRandom from "./crear-estrellas-sprite";

let starsCatalogue,
  starsSprites = new Group();
/**
 * Crea las estrellas
 * @param {Array} data: datos con estrellas
 * @returns {Group} group
 */
const createStars = ({ data = [] }) => {
  const group = new Group();

  // crea el catalogo de estrellas con sprites
  starsCatalogue = createStarsCatalogue(data);
  group.add(starsCatalogue);

  // usando sprites
  // starsSprites = createSpritedStarsRandom();
  // group.add(starsSprites);

  // usando SphereGeometry (Mesh)
  // const meshedStar = createMeshedStar(new Vector3(-1, 1, 10));
  // group.add(meshedStar);
  // const meshedStarsRandom = createMeshedStarsRandom();
  // group.add(meshedStarsRandom);
  // const meshedStars = createMeshedStars(data);
  // group.add(meshedStars);
  // const instanceMeshedStarsRandom = createInstancedMeshedStarsRandom();
  // group.add(instanceMeshedStarsRandom);
  // const instanceMeshedStars = createInstancedMeshedStars(data);
  // group.add(instanceMeshedStars);

  return group;
};

export { createStars, starsCatalogue };
