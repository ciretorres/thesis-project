// módulo para rotar y zoom en la escena
// import { exportCamera } from "../../scripts/index.js";
import {
  decreasePositionZ,
  increasePositionZ,
  resetPosition,
} from "../utils/zoom.js";

const moverCamaraConTeclado = (cam) => {
  // Eventos del teclado
  document.addEventListener("keydown", function (event) {
    // Navegar
    if (event.key === "w") {
      // pa delante
      console.log("W key pressed");
      increasePositionZ(cam);
    }
    if (event.key === "s") {
      // pa trás
      console.log("S key pressed");
      decreasePositionZ(cam);
    }
    if (event.key === "a") {
      // pa la izquierda
      console.log("A key pressed");
      cam.position.x -= 5;
    }
    if (event.key === "d") {
      // pa la derecha
      console.log("D key pressed");
      cam.position.x += 5;
    }
    if (event.key === "q") {
      // pararriba
      console.log("Q key pressed");
      cam.position.y -= 5;
    }
    if (event.key === "e") {
      // parabajo
      console.log("E key pressed");
      cam.position.y += 5;
    }

    if (event.key === "Enter") {
      // al centro
      console.log("Enter key pressed");
      resetPosition(cam);
    }
  });
};

export default moverCamaraConTeclado;
