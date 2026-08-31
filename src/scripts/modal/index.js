const mainid = document.querySelector("#mainid");

// crea controles para abrir y cerrar modal
const contenedorControles = document.createElement("div");
contenedorControles.id = "contenedorcontrolesid";
contenedorControles.className = "contenedor-controles";
contenedorControles.innerHTML = `
  <div class="toggle-controles">
    <button 
      id="botontogglecontrolesid" 
      class="boton-toggle-controles" 
      type="button">
      .
    </button>
  </div>
`;

mainid.append(contenedorControles);

const botonToggle = contenedorControles.querySelector(
  "#botontogglecontrolesid",
);

// Evento del botón
botonToggle.addEventListener("click", () => {
  toogleModal();
});

// crea el modal instructivo
const dialog = document.createElement("div");
dialog.id = "dialogid";
dialog.className = "modal-instructivo";
dialog.innerHTML = `
  <h2>¡Bienvenido!</h2>
  <p>
    Ahora puedes jugar a encontrar la luz y distancia de las estrellas.
    ¡Es fácil!
  </p>
  <ul>
    <li><b>Selecciona</b> o elige una estrella</li>
    <li>
      <b>Encuentra</b> su luminosidad en la Magnitud Aparente
      y Magnitud Absoluta
    </li>
    <li>
      <b>Relaciona</b> su brillo modificando su distancia
    </li>
  </ul>
  <p>
    ¡Mira cómo cambian al mismo tiempo según le agregues o quites cantidad!
  </p>
`;

mainid.append(dialog);

let toogledModal = false;

// exporta el método para mostrarlo u ocultarlo
export const toogleModal = () => {
  if (toogledModal) {
    dialog.style.display = "none";
    toogledModal = false;
  } else {
    dialog.style.display = "block";
    toogledModal = true;
  }
};
