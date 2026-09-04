import { Raycaster, Vector2 } from "three";

import {
  agregarDistancia,
  restarDistancia,
} from "../../components/controls/changeVmag";

const mainid = document.querySelector("#mainid");

// crea la tarjeta informativa
const tarjetaInfo = document.createElement("div");
tarjetaInfo.id = "tarjetainfoid";
tarjetaInfo.className = "tarjeta-info";
tarjetaInfo.innerHTML = `
  <button class="btn-cerrar" type="button" autofocus>X</button>

  <table>
    <caption id="titleid" class="titulo">
      <h2>Nombre de la estrella</h2>
    </caption>

    <thead>
      <tr>
        <th>HIP</th>
        <th class="text-stroke">Magnitud Aparente</th>
        <th>Magnitud Absoluta</th>
        <th class="text-stroke">Distancia del Sol</th>
        <th>-</th>
        <th>Ascensión Recta</th>
        <th>Declinación</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td id="hipid">0</td>
      </tr>
      <tr>
        <td id="vmagid" class="text-stroke">0.0</td>
      </tr>
      <tr>
        <td id="absmagid">0.0</td>
      </tr>
      <tr>
        <td class="text-stroke">
          <span id="distanciaid">0.00</span> pársecs
        </td>
      </tr>
      <tr>
        <td class="text-stroke">
          <span id="lyid">0.00</span> años luz
        </td>
      </tr>
      <tr>
        <td id="rahmsid">00h 00m 00.00s</td>
      </tr>
      <tr>
        <td id="dedmsid">+00° 00' 00.0"</td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>
          <span id="idx">0.00</span>,
          <span id="idy">0.00</span>,
          <span id="idz">0.00</span>
        </td>
      </tr>
    </tfoot>
  </table>

  <div class="botones-modifica-distancia">
    <button class="restar-distancia" type="button">-</button>
    <button class="agregar-distancia" type="button">+</button>
  </div>
`;

mainid.append(tarjetaInfo);

const botonAgregar = tarjetaInfo.querySelector(".agregar-distancia");
botonAgregar.addEventListener("click", () => {
  agregarDistancia();
});

const botonCerrar = tarjetaInfo.querySelector(".btn-cerrar");
const botonRestar = tarjetaInfo.querySelector(".restar-distancia");
botonRestar.addEventListener("click", () => {
  restarDistancia();
});

botonCerrar.addEventListener("click", () => {
  tarjetaInfo.style.display = "none";
});

const titleid = document.querySelector("#titleid h2");
const phipid = document.querySelector("#hipid");
const pvmagid = document.querySelector("#vmagid");
const pabsmagid = document.querySelector("#absmagid");
const pdistanciaid = document.querySelector("#distanciaid");
const plyid = document.querySelector("#lyid");
const prahmsid = document.querySelector("#rahmsid");
const pdedmsid = document.querySelector("#dedmsid");

// objeto seleccionado
let selectedObject = null;

/**
 *
 * @param {PerspectiveCamera} camera :
 * @param {Group} group : con el Sprite, Object3D, Mesh
 * @returns
 */
const selectStar = (camera, group) => {
  const raycaster = new Raycaster();
  const pointer = new Vector2();

  // var
  // let selectedObject = null;
  let hoveredObject = null;

  // Función para resetear el color de un objeto
  const resetColor = (object) => {
    object.material.color.set(0xffffff); // Blanco
  };

  // Función para cambiar el color a rojo (hover)
  const setHoverColor = (object) => {
    if (object !== selectedObject) {
      // No cambia si ya está seleccionado
      object.material.color.set(0xff0000); // Rojo
    }
  };

  // Función para cambiar el color a verde (selección)
  const setSelectedColor = (object) => {
    object.material.color.set(0x00ff00); // Verde
  };

  // Raycaster para detección de mouse hover
  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster
    raycaster.setFromCamera(pointer, camera);

    // Intersecta con los objetos en la escena
    const intersects = raycaster.intersectObject(group, true);

    if (intersects.length > 0) {
      // Obtener información del objeto seleccionado
      const res = intersects.filter(function (res) {
        return res && res.object;
      })[0];

      // Si el objeto hovered cambia, resetear el color del anterior hovered
      if (
        hoveredObject &&
        hoveredObject !== res.object &&
        hoveredObject !== selectedObject
      ) {
        resetColor(hoveredObject);
      }

      setHoverColor(res.object);
      hoveredObject = res.object;
    } else {
      // No hay hover en ningún objeto
      if (hoveredObject && hoveredObject !== selectedObject) {
        resetColor(hoveredObject);
        hoveredObject = null;
      }
    }
  };
  document.addEventListener("pointermove", onPointerMove);

  // diccionario
  const dict_hip = {
    11767: "α Ursae Minoris (Polaris)",
    85665: "SAO 122446",
    70890: "Proxima Centauri",
    71683: "α Centauri A (Rigil Kentaurus o Toliman)",
    71681: "α Centauri B (Rigil Kentaurus o Toliman)",
    87937: "Estrella de Barnard",
    54035: "Lalande 21185",
    32349: "α Canis Majoris (Sirio)",
    92403: "Ross 154",
    37279: "α Canis Minoris (Procyon)",
    36208: "Estrella de Luyten",
    24186: "Estrella de Kapteyn",
    110893: "Kruger 60",
    3829: "Estrella de Van Maanen",
    97649: "α Aquilae (Altair)",
    113368: "α Piscis Austrini (Fomalhaut)",
    91262: "α Lyrae (Vega)",
    56997: "61 Ursae Majoris",
  };

  const dict_hip_completo = {
    // # HIP 1 ~ 10000
    667: "α Andromedae (Alpheratz o Sirrah)",
    3419: "β Ceti (Deneb Kaitos o Diphda)",
    3829: "Estrella de Van Maanen",
    5447: "β Andromedae (Mirach)",
    7588: "α Eridani (Achernar)",
    9884: "α Arietis (Hamal)",
    // # HIP 10001 ~ 20000
    10826: "ο Ceti (Mira)",
    11767: "α Ursae Minoris (Polaris)",
    15863: "α Persei (Mirfak o Algenib)",
    // # HIP 20001 ~ 30000
    21421: "α Tauri (Aldebarán)",
    24186: "Estrella de Kapteyn",
    24436: "β Orionis (Rigel)",
    24608: "α Aurigae (Capella)",
    25336: "γ Orionis (Bellatrix)",
    25428: "β Tauri (Elnath)",
    25930: "δ Orionis (Mintaka)",
    26311: "ε Orionis (Alnilam)",
    26727: "ζ Orionis (Alnitak)",
    27366: "κ Orionis (Saiph)",
    27989: "α Orionis (Betelgeuse)",
    28360: "β Aurigae (Menkalinan)",
    // # HIP 30001 ~ 40000
    30324: "β Canis Majoris (Mirzam o Murzim)",
    30438: "α Carinae (Canopo)",
    31681: "γ Geminorum (Alhena)",
    32349: "α Canis Majoris (Sirio)",
    33579: "ε Canis Majoris (Adhara)",
    34444: "δ Canis Majoris (Wezen)",
    36850: "α Geminorum (Cástor)",
    37279: "α Canis Minoris (Procyon)",
    37826: "β Geminorum (Pólux)",
    39953: "γ Velorum (Suhail o Regor)",
    // # HIP 40001 ~ 50000
    41037: "ε Carinae (Avior)",
    42913: "δ Velorum",
    45238: "β Carinae (Miaplacidus)",
    46390: "α Hydrae (Alphard)",
    49669: "α Leonis (Regulus)",
    // # HIP 50001 ~ 60000
    50583: "γ Leonis (Algieba)",
    54035: "Lalande 21185",
    54061: "α Ursae Majoris (Dubhe)",
    54872: "δ Leonis (Duhr o Zosma)",
    54879: "θ Leonis (Chertan)",
    56997: "61 Ursae Majoris",
    57362: "β Leonis (Denébola)",
    57757: "β Virginis (Zavijava)",
    58001: "γ Ursae Majoris (Phecda)",
    59196: "δ Centauri",
    // # HIP 60001 ~ 70000
    60351: "12 Comae Berenices",
    60718: "α Crucis (Acrux)",
    61084: "γ Crucis (Gacrux)",
    62434: "β Crucis (Becrux o Mimosa)",
    62956: "ε Ursae Majoris (Alioth)",
    63608: "ε Virginis (Vindemiatrix)",
    65474: "α Virginis (Espiga)",
    65835: "R Hydrae",
    66249: "ζ Virginis (Heze)",
    67301: "η Ursae Majoris (Alkaid o Benetnasch)",
    68702: "β Centauri (Hadar o Agena)",
    68933: "θ Centauri (Menkent)",
    69673: "α Bootis (Arturo)",
    // # HIP 70001 ~ 80000
    71681: "α Centauri B (Rigil Kentaurus o Toliman)",
    71683: "α Centauri A (Rigil Kentaurus o Toliman)",
    71860: "α Lupi (Kakkab o Men)",
    72607: "β Ursae Minoris (Kochab)",
    75097: "γ Ursae Minoris (Pherkad)",
    // # HIP 80001 ~ 90000
    80763: "α Scorpii (Antares)",
    82273: "α Trianguli Australis (Atria)",
    82396: "ε Scorpii (Wei)",
    85927: "λ Scorpii (Shaula)",
    86032: "α Ophiuchi (Rasalhague o Ras Alhague)",
    86228: "θ Scorpii (Sargas o Girtab)",
    // # HIP 90001 ~ 100000
    90185: "ε Sagittarii (Kaus Australis)",
    90496: "λ Sagittarii (Kaus Borealis)",
    91262: "α Lyrae (Vega)",
    92403: "Ross 154",
    92855: "σ Sagittarii (Nunki)",
    97278: "γ Aquilae (Tarazed)",
    97649: "α Aquilae (Altair)",
    // # HIP 100001 ~ 110000
    100751: "α Pavonis (Peacock)",
    102098: "α Cygni (Deneb, Arided o Aridif)",
    105881: "ζ Capricorni (Marakk)",
    109268: "α Gruis (Alnair)",
    109358: "β Canum Venaticorum (Asterion o Chara)",
    // # HIP 110001 ~ 120000
    112122: "β Gruis (Gruid)",
    113368: "α Piscis Austrini (Fomalhaut)",
  };

  // Detección de clics en sprites
  const onMouseClick = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster
    raycaster.setFromCamera(pointer, camera);

    // Intersecta con los objetos en la escena
    const intersects = raycaster.intersectObject(group, true);

    if (intersects.length > 0) {
      // Obtener información del objeto seleccionado
      const clickedObject = intersects[0].object;

      // Si se hace click en un objeto ya seleccionado, lo deseleccionamos
      if (clickedObject === selectedObject) {
        resetColor(clickedObject);
        tarjetaInfo.style.display = "none";
        selectedObject = null;
      } else {
        // Resetear el color del objeto previamente seleccionado
        if (selectedObject) {
          resetColor(selectedObject);
        }

        setSelectedColor(clickedObject);
        selectedObject = clickedObject;

        // console.log("selectedObject: ", selectedObject);
        // console.log({
        //   HIP: selectedObject.HIP,
        //   RAhms: selectedObject.RAhms,
        //   DEdms: selectedObject.DEdms,
        //   Vmag: selectedObject.Vmag,
        //   ABSmag: selectedObject.ABSmag.toFixed(2),
        //   Pc: selectedObject.Pc.toFixed(2),
        // });

        titleid.innerText = dict_hip[selectedObject.HIP]
          ? dict_hip[selectedObject.HIP]
          : "Estrella";
        phipid.innerText = selectedObject.HIP;
        pvmagid.innerText = selectedObject.Vmag.toFixed(2);
        pabsmagid.innerText = selectedObject.ABSmag.toFixed(2);
        pdistanciaid.innerText = selectedObject.Pc.toFixed(2);
        plyid.innerText = (selectedObject.Pc * 3.261598).toFixed(2);
        // plyid.innerText = selectedObject.Ly.toFixed(2);

        const ra = selectedObject.RAhms;
        const RApartes = ra.split(" ");
        const RAhoras = RApartes[0];
        const RAminutos = RApartes[1];
        const RAsegundos = RApartes[2];

        prahmsid.innerText = `${RAhoras}h ${RAminutos}m ${RAsegundos}s`;

        const dec = selectedObject.DEdms;
        const DEpartes = dec.split(" ");
        const DEgrados = DEpartes[0];
        const DEminutos = DEpartes[1];
        const DEsegundos = DEpartes[2];
        pdedmsid.innerText = `${DEgrados}° ${DEminutos}' ${DEsegundos}"`;

        // mostrar la tarjeta informativa
        tarjetaInfo.style.display = "block";
      }
    } else {
      // Click fuera de cualquier objeto, deseleccionar
      if (selectedObject) {
        // si la tarjeta no fue clickeada
        if (!tarjetaInfo.contains(event.target)) {
          resetColor(selectedObject);
          // quita la tarjeta informativa
          tarjetaInfo.style.display = "none";
          selectedObject = null;
        } else {
          // si dió click en el botón de cerrar
          if (botonCerrar.contains(event.target)) {
            resetColor(selectedObject);
            selectedObject = null;
          }
        }
      }
    }
  };
  document.addEventListener("click", onMouseClick);

  // Limpiar eventos al destruir el componente o cuando ya no sea necesario
  return () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("click", onMouseClick);
  };
};

// export default selectStar;
export { selectedObject, selectStar };
