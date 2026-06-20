import {
  CanvasTexture,
  Group,
  LinearFilter,
  Sprite,
  SpriteMaterial,
} from "three";

import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const createTextTexture = (text, type, fontSize = 72, color = "#ff0000") => {
  // console.log("createTextTexture");

  // cada etiqueta es un canvas
  const mainid = document.querySelector("#mainid");
  const canvas = document.createElement("canvas");
  canvas.id = `spriteid-${Math.random().toString(36).substring(2)}`;

  // Tamaño de la etiqueta
  canvas.width = 192;
  canvas.height = 64;
  // contexto del canva 2d
  const ctx = canvas.getContext("2d");

  // Dibuja un Rect en la posición 0,0 del canvas, del ancho y alto del canvas
  // ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Configura estilo de Text
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = color;
  // ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${type === "dec" && text > 0 ? "+" : ""}${text}°`,
    0,
    canvas.height / 2,
  );

  mainid.appendChild(canvas);

  // Textura con el canvas
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  return texture;
};

const ajustarMargenes = (type, pos, sprite) => {
  if (type === "ra") {
    sprite.position.set(pos.x - 0.3, pos.y + 1.5, pos.z);
  }
  if (type === "dec") {
    sprite.position.set(pos.x + 0.6, pos.y + 0.3, pos.z);
  }
};

// Método para agregar etiqueta mediante Sprite
const createSpriteLabel = (type, pos, text, radius) => {
  // console.log('createSpriteLabel')
  const group = new Group();

  const spriteMaterial = new SpriteMaterial({
    map: createTextTexture(text, type),
    transparent: true,
    // rotar 90° si es línea ra
    rotation: type === "ra" ? (90 * Math.PI) / 180 : 0,
  });
  const sprite = new Sprite(spriteMaterial);

  // sprite.position.copy(pos);
  ajustarMargenes(type, pos, sprite);

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

const ajustarMargenesCSS2D = (type, pos, label) => {
  if (type === "dec") {
    label.position.set(pos.x + 0.01, pos.y + 0.01, pos.z);
  }
  if (type === "ra") {
    // label.position.set(pos.x - 0.7, pos.y + 0.8, pos.z);
    label.position.set(pos.x, pos.y, pos.z);
  }
};

const addLabelCSS2DObject = (type, pos, text, radiu, horas = false) => {
  // console.log("addLabel");
  const group = new Group();

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper-label";

  // const labelElement = document.createElement("label");
  // labelElement.for // for id line
  const labelElement = document.createElement("div");
  labelElement.className = "label";
  labelElement.id = `labelid-${Math.random().toString(36).substring(2)}`;
  labelElement.textContent = horas
    ? `${text}h`
    : `${type === "dec" && text > 0 ? "+" : ""}${text}°`;
  // rotar
  labelElement.style.transform =
    type === "ra" ? "rotate(-90deg)" : "rotate(0deg)";
  // labelElement.style.backgroundColor = "#ff0000";
  // labelElement.style.backgroundColor = "transparent";

  // Anidando para poder rotar
  wrapper.appendChild(labelElement);

  // CSS2DObject
  const label = new CSS2DObject(wrapper);

  ajustarMargenesCSS2D(type, pos, label);

  // Ajusta rotación para que apunte hacia arriba
  label.rotation.z = Math.atan2(pos.x, pos.y);
  type === "ra" ? label.center.set(1, 2.5) : label.center.set(0, 1);
  // label.center.set(0, 1);
  group.add(label);

  return group;
};

export { addLabelCSS2DObject, createSpriteLabel };
