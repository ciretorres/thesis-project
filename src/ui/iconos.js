/** Crea el icono decorativo de lupa en SVG (sin dependencias): círculo + mango, decorativa. */
export function crearLupa() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "buscador-lupa");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("aria-hidden", "true");

  const circulo = document.createElementNS(ns, "circle");
  circulo.setAttribute("cx", "11");
  circulo.setAttribute("cy", "11");
  circulo.setAttribute("r", "7");

  const mango = document.createElementNS(ns, "line");
  mango.setAttribute("x1", "16.5");
  mango.setAttribute("y1", "16.5");
  mango.setAttribute("x2", "21");
  mango.setAttribute("y2", "21");

  svg.append(circulo, mango);
  return svg;
}

/** Crea el icono decorativo de cerraren SVG (sin dependencias): dos líneas cruzadas, decorativa. */
export function crearCruz({ clase = "icono-cruz", tamano = 14 } = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", clase);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(tamano));
  svg.setAttribute("height", String(tamano));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("aria-hidden", "true");

  const lineaA = document.createElementNS(ns, "line");
  lineaA.setAttribute("x1", "6");
  lineaA.setAttribute("y1", "6");
  lineaA.setAttribute("x2", "18");
  lineaA.setAttribute("y2", "18");

  const lineaB = document.createElementNS(ns, "line");
  lineaB.setAttribute("x1", "18");
  lineaB.setAttribute("y1", "6");
  lineaB.setAttribute("x2", "6");
  lineaB.setAttribute("y2", "18");

  svg.append(lineaA, lineaB);
  return svg;
}
