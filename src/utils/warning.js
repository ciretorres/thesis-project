// módulo para comprobar si es compatible con webgl
import WebGL from "three/addons/capabilities/WebGL.js";

const checaWebGLCompatibilidad = (renderer, animate, mainId, canvasId) => {
  if (WebGL.isWebGL2Available()) {
    // Initiate function or other initializations here
    // Manda lo que se debe actualizar cada cierto tiempo para animar
    renderer.setAnimationLoop(animate);

    console.log(WebGL.isWebGL2Available());
  } else {
    // Ocultar el elemento canvas
    document.querySelector(canvasId).style.display = "none";

    // Mostrar mensaje no compatible
    const warning = WebGL.getWebGL2ErrorMessage();
    document.querySelector(mainId).appendChild(warning);

    const AdvertenciaWebGLNoCompatible = document.createElement("div");

    AdvertenciaWebGLNoCompatible.innerHTML += `
        <h2>
          Tu tarjeta gráfica parece no soportar
          <a
            href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation"
            target="_blank"
            rel="noopener noreferrer">
            WebGL 2
          </a>
        </h2>`;

    document
      .querySelector("#webglmessage")
      .appendChild(AdvertenciaWebGLNoCompatible);
  }
};

export default checaWebGLCompatibilidad;
