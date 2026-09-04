import { selectedObject } from "../../scripts/events/select.js";

function log10(x) {
  /* Returns the logarithm of x with base 10
   */
  return Math.log(x) / Math.log(10);
}
// window.log10 = log10;
/*
 * Obtains Apparent Magnitude from Absolute Magnitude and Distance in pársecs
 */
function getApparentMagnitude(abs_mag, distance) {
  let m = Math.log10(distance) * 5 - 5 + abs_mag;
  return m;
}
// window.getApparentMagnitude = getApparentMagnitude;

const pvmagid = document.querySelector("#vmagid");
// const pabsmagid = document.querySelector("#absmagid");
const pdistanciaid = document.querySelector("#distanciaid");
const plyid = document.querySelector("#lyid");

// Eventos del teclado
document.addEventListener("keydown", function (event) {
  if (selectedObject) {
    // console.log(selectedObject);
    if (event.key === "+") {
      console.log("+ key pressed");
      // console.log(starsCatalogue.children.find((s) => s.HIP === 85665));
      let star = selectedObject;

      // let star = starsCatalogue.children[
      //   starsCatalogue.children.length - 1
      // ].children.find((star) => star.HIP === 11767);

      star.Pc += 1;
      star.position.z += 1;

      star.Vmag = getApparentMagnitude(star.ABSmag, star.Pc);
      pvmagid.innerText = star.Vmag.toFixed(2);
      pdistanciaid.innerText = star.Pc.toFixed(2);
      plyid.innerText = (star.Pc * 3.261598).toFixed(2);
      console.log(star.HIP, star.Pc, star.position.z);
    }

    if (event.key === "-") {
      console.log("- key pressed");
      // console.log(starsCatalogue);
      let star = selectedObject;

      // let star = starsCatalogue.children[
      //   starsCatalogue.children.length - 1
      // ].children.find((star) => star.HIP === 11767);

      // star.position.z -= 1;
      // console.log(star.HIP, star.Pc)
      if (star.Pc > 1) {
        star.Pc -= 1;
        star.position.z -= 1;
      }
      star.Vmag = getApparentMagnitude(star.ABSmag, star.Pc);
      pvmagid.innerText = star.Vmag.toFixed(2);
      // pabsmagid.innerText = selectedObject.ABSmag.toFixed(2);

      pdistanciaid.innerText = star.Pc.toFixed(2);
      plyid.innerText = (star.Pc * 3.261598).toFixed(2);
      console.log(star.HIP, star.Pc, star.position.z);
    }
  } else {
    console.log("selecciona una estrella");
  }
});

// Eventos del mouse y botón
const agregarDistancia = () => {
  console.log("+ button clicked");
  let star = selectedObject;

  star.Pc += 1;
  star.position.z += 1;

  star.Vmag = getApparentMagnitude(star.ABSmag, star.Pc);
  pvmagid.innerText = star.Vmag.toFixed(2);
  pdistanciaid.innerText = star.Pc.toFixed(2);
  plyid.innerText = (star.Pc * 3.261598).toFixed(2);
  console.log(star.HIP, star.Pc, star.position.z);
};

const restarDistancia = () => {
  console.log("- button clicked");
  let star = selectedObject;

  if (star.Pc > 1) {
    star.Pc -= 1;
    star.position.z -= 1;
  }
  star.Vmag = getApparentMagnitude(star.ABSmag, star.Pc);
  pvmagid.innerText = star.Vmag.toFixed(2);

  pdistanciaid.innerText = star.Pc.toFixed(2);
  plyid.innerText = (star.Pc * 3.261598).toFixed(2);
  console.log(star.HIP, star.Pc, star.position.z);
};

export { agregarDistancia, restarDistancia };
