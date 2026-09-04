// módulo para rotar y zoom en la escena
import { exportCamera } from "../../scripts/index.js";
import {
  decreasePositionZ,
  increasePositionZ,
  resetPosition,
} from "../../scripts/utils/zoom.js";

// Eventos del teclado
document.addEventListener("keydown", function (event) {
  // Navegar
  if (event.key === "w") {
    // pa delante
    console.log("W key pressed");
    increasePositionZ(exportCamera());
  }
  if (event.key === "s") {
    // pa trás
    console.log("S key pressed");
    decreasePositionZ(exportCamera());
  }
  if (event.key === "a") {
    // pa la izquierda
    console.log("A key pressed");
    exportCamera().position.x -= 5;
  }
  if (event.key === "d") {
    // pa la derecha
    console.log("D key pressed");
    exportCamera().position.x += 5;
  }
  if (event.key === "q") {
    // pararriba
    console.log("Q key pressed");
    exportCamera().position.y -= 5;
  }
  if (event.key === "e") {
    // parabajo
    console.log("E key pressed");
    exportCamera().position.y += 5;
  }

  if (event.key === "Enter") {
    // al centro
    console.log("Enter key pressed");
    resetPosition(exportCamera());
  }
});
