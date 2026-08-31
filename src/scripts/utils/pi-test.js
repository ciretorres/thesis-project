import { formulaRaDecToCartesian } from "../../../scripts/utils/convert.js";

let conteoDec = 1;
for (let dec = -90; dec <= 90; dec += 90 / 5) {
  console.log("-");
  let conteoRA = 1;
  for (let ra = 0; ra <= 360; ra += 180 / 180) {
    console.log(
      "dec",
      conteoDec,
      dec,
      "ra",
      conteoRA,
      ra,
      "=",
      "{",
      "x:",
      formulaRaDecToCartesian(1, ra, dec).x,
      "y:",
      formulaRaDecToCartesian(1, ra, dec).y,
      "z:",
      formulaRaDecToCartesian(1, ra, dec).z,
      "}",
    );
    conteoRA++;
    // const sphericalCoords = formulaRaDecToCartesian(1, ra * 58, dec * 29);
  }
  conteoDec++;
}
//   // console.log(Math.PI / 12);

// conteoDec = 1;
// for (let dec = -Math.PI; dec <= Math.PI; dec += Math.PI / 5) {
//   console.log("-");
//   let conteoRA = 1;
//   for (let ra = 0; ra <= 2 * Math.PI; ra += Math.PI / 180) {
//     console.log(
//       "dec",
//       conteoDec,
//       dec * 29,
//       "ra",
//       conteoRA,
//       ra * 58,
//       "=",
//       "{",
//       "x:",
//       formulaRaDecToCartesian(100, ra * 58, dec * 29).x,
//       "y:",
//       formulaRaDecToCartesian(100, ra * 58, dec * 29).y,
//       "z:",
//       formulaRaDecToCartesian(100, ra * 58, dec * 29).z,
//       "}",
//     );
//     conteoRA++;
//     // const sphericalCoords = formulaRaDecToCartesian(1, ra * 58, dec * 29);
//   }
//   conteoDec++;
// }
// // console.log(Math.PI / 12);

// const piTest = () => {
//   let conteoDec = 1;
//   for (let dec = -Math.PI; dec <= Math.PI; dec += Math.PI / 5) {
//     console.log("-");
//     let conteoRA = 1;
//     for (let ra = 0; ra < 2 * Math.PI; ra += Math.PI / 180) {
//       console.log(
//         "dec",
//         conteoDec,
//         dec,
//         "ra",
//         conteoRA,
//         ra,
//         "=",
//         "{",
//         "x:",
//         formulaRaDecToCartesian(10, ra, dec).x,
//         "y:",
//         formulaRaDecToCartesian(10, ra, dec).y,
//         "z:",
//         formulaRaDecToCartesian(10, ra, dec).z,
//         "}",
//       );
//       conteoRA++;
//       // const sphericalCoords = formulaRaDecToCartesian(1, ra * 58, dec * 29);
//     }
//     conteoDec++;
//   }
//   // console.log(Math.PI * 2);
// };
