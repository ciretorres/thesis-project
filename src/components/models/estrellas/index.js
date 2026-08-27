import { Group, Vector3 } from "three";

import createStarsCatalogue from "./crear-estrellas-cat";

import {
  createInstancedMeshedStars,
  createInstancedMeshedStarsRandom,
  createMeshedStar,
} from "./crear-estrellas-mesh";

let starsCatalogue,
  starsSprites = new Group();
/**
 * Crea las estrellas
 * @param {Array} data: datos con estrellas
 * @returns {Group} group
 */
const createStars = ({ data = [] }) => {
  const group = new Group();

  // usando sprites
  // starsSprites = createSpritedStars(500);
  // group.add(starsSprites)

  // catalogo con sprites
  starsCatalogue = createStarsCatalogue(data);
  group.add(starsCatalogue);

  // usando SphereGeometry (Mesh)
  const meshedStar = createMeshedStar(new Vector3(-1, 1, 10));
  group.add(meshedStar);
  // const meshedStarsRandom = createMeshedStarsRandom();
  // group.add(meshedStarsRandom);
  // const meshedStars = createMeshedStars(data);
  // group.add(meshedStars);
  const instanceMeshedStarsRandom = createInstancedMeshedStarsRandom();
  group.add(instanceMeshedStarsRandom);
  const instanceMeshedStars = createInstancedMeshedStars(data);
  // group.add(instanceMeshedStars);

  return group;
};

export { createStars, starsCatalogue };
