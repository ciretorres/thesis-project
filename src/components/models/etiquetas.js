import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial } from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// Método que crea una Textura a partir de un canvas temporal para el SpriteMaterial
const createTextTexture = ({
  type,
  text,
  color = "#ff0000",
  horas = false,
}) => {
  // Crear un canvas y contexto temporal
  const mainid = document.querySelector("#mainid");
  const canvas = document.createElement("canvas");
  canvas.id = `spriteid-${Math.random().toString(36).substring(2)}`;
  const context = canvas.getContext("2d");

  // Tamaño del canvas (ajustable)
  canvas.width = 1024;
  canvas.height = 512;

  // Estilo del texto
  context.font = "32px monospace";
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Dibujar el texto en el canvas
  context.fillText(
    horas ? `${text}h` : `${type === "dec" && text > 0 ? "+" : ""}${text}°`,
    canvas.width / 2 + 60,
    canvas.height / 2 - 45,
  );

  mainid.appendChild(canvas);

  // Crear una textura a partir del canvas
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true; // Crítico para actualizar
  texture.minFilter = LinearFilter;

  return texture;
};

// Método para agregar etiqueta mediante Sprite
const createSpriteLabel = (type, pos, text, horas = false) => {
  // Crea textura
  const texture = createTextTexture({ type, text, horas });

  const material = new SpriteMaterial({
    map: texture,
    // rotar 90° si es línea ra
    rotation: type === "ra" ? (90 * Math.PI) / 180 : 0,
  });

  const sprite = new Sprite(material);

  sprite.position.copy(pos);
  sprite.scale.set(1, 0.5, 1); // Ajusta el tamaño del sprite según la distancia

  return sprite;
};

// Método para agregar etiqueta mediante CSS2DObject
const addLabelCSS2DObject = (type, pos, text, horas = false) => {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper-label";

  const labelElement = document.createElement("div");
  labelElement.id = `labelid-${Math.random().toString(36).substring(2)}`;
  labelElement.className = "label";

  // horas o grados
  labelElement.textContent = horas
    ? `${text}h`
    : `${type === "dec" && text > 0 ? "+" : ""}${text}°`;

  // rotar
  labelElement.style.transform =
    type === "ra" ? "rotate(-90deg)" : "rotate(0deg)";

  // Para rotar necesita anidar la etiqueta
  wrapper.appendChild(labelElement);

  // CSS2DObject
  const label = new CSS2DObject(wrapper);

  // ajustar
  label.position.copy(pos);

  // Ajusta rotación para que apunte hacia arriba
  // label.rotation.z = Math.atan2(pos.x, pos.y);

  // definir el centro de la etiqueta
  type === "ra" ? label.center.set(1, 2.5) : label.center.set(0, 1);
  // label.center.set(0, 1);

  return label;
};

// Ejemplo de texto
// async function etiquetasTextGeometry() {
//   const loader = new FontLoader();
//   let font = await loader.loadAsync("helvetiker_regular.typeface.json");
//   const textG = new TextGeometry(`hwllo world`, {
//     font: font,
//     size: 0.25,
//     depth: 0,
//     curveSegments: 12,
//     bevelEnabled: false,
//   });
//   textG.computeBoundingBox();

//   let materialt = new MeshBasicMaterial({ color: "white" });
//   let mesht = new Mesh(textG, materialt);

//   mesht.position.set(0, 0, -10);
//   scene.add(mesht);
// }
// etiquetasTextGeometry();

export { addLabelCSS2DObject, createSpriteLabel };
