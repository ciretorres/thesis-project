import {
  CanvasTexture,
  Group,
  LinearFilter,
  Sprite,
  SpriteMaterial,
} from "three";

import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

import { formulaRaDecToCartesian } from "../../utils/convert.js";

const createTextTexture = (text, type, fontSize = 72, color = "#ff0000") => {
  // console.log("createTextTexture");
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");

  // Rect
  // ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = color;
  // ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${type === "dec" && text > 0 ? "+" : ""}${text}°`,
    0,
    canvas.height / 2,
  );

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  return texture;
};

// Método para agregar etiqueta mediante Sprite
const createSpriteLabel = (type, raDeg, decDeg, text, radius) => {
  // console.log('createSpriteLabel')
  const group = new Group();
  const pos = formulaRaDecToCartesian(radius, raDeg, decDeg);

  const spriteMat = new SpriteMaterial({
    map: createTextTexture(text, type),
    transparent: true,
    rotation: type === "ra" ? (90 * Math.PI) / 180 : 0,
  });
  const sprite = new Sprite(spriteMat);
  // sprite.position.copy(pos);
  if (type === "ra") {
    sprite.position.set(pos.x - 0.3, pos.y + 1.5, pos.z);
  }
  if (type === "dec") {
    sprite.position.set(pos.x + 0.6, pos.y + 0.3, pos.z);
  }

  // sprite.scale.set(0.75, 0.25, 1); // Ajusta según distancia
  sprite.scale.set(0.9375, 0.3125, 1.25); // Ajusta según distancia
  group.add(sprite);
  return sprite;
};

// // Etiquetas en líneas paraleas al ecuador
// const spriteMap = new TextureLoader().load("/favicon.ico");
// const spriteMaterial = new SpriteMaterial({ map: spriteMap });
// for (let dec = -90; dec < 90; dec += 20) {
//   const radio = 20;
//   for (let ra = 0; ra <= 360; ra++) {
//     const sprite = new Sprite(spriteMaterial);
//     const x =
//       radio *
//       Math.cos((dec * Math.PI) / 180) *
//       Math.cos((ra * Math.PI) / 180);
//     const y = radio * Math.sin((dec * Math.PI) / 180);
//     const z =
//       radio *
//       Math.cos((dec * Math.PI) / 180) *
//       Math.sin((ra * Math.PI) / 180);
//     // Posicionar la etiqueta en el punto correspondiente
//     sprite.position.set(x, y + 0.6, z);
//     // sprite.position.set(6.82, 19.79, 0.47);
//     if ([253, 270, 287].includes(ra)) {
//       group.add(sprite);
//     }
//   }
//   // console.log("-", dec);
// }

const addLabelCSS2DObject = (type, raDeg, decDeg, text, radius) => {
  // console.log("addLabel");
  const group = new Group();
  const sphericalPosition = formulaRaDecToCartesian(radius, raDeg, decDeg);

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper-label";

  // const labelElement = document.createElement("label");
  // labelElement.for // for id line
  const labelElement = document.createElement("div");
  labelElement.className = "label";
  labelElement.textContent = `${type === "dec" && text > 0 ? "+" : ""}${text}°`;
  labelElement.style.backgroundColor = "#ff0000";
  // labelElement.style.backgroundColor = "transparent";
  if (type === "ra") {
    labelElement.style.transform = "rotate(-90deg)";
  }

  // Anidando para poder rotar
  wrapper.appendChild(labelElement);
  // CSS2DObject
  const label = new CSS2DObject(wrapper);

  if (type === "dec") {
    label.position.set(
      sphericalPosition.x + 0.1,
      sphericalPosition.y + 0.1,
      sphericalPosition.z,
    );
  }
  if (type === "ra") {
    label.position.set(
      sphericalPosition.x - 0.7,
      sphericalPosition.y + 0.8,
      sphericalPosition.z,
    );
  }
  label.center.set(0, 1);
  group.add(label);

  // label.layers.set(1);
  return group;
};

export { addLabelCSS2DObject, createSpriteLabel };
