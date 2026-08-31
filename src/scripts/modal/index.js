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

// toogle
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

// crea el contenedor de texto
const dialogTexto = document.createElement("div");
dialogTexto.className = "modal-texto";
const tileDFN = "El módulo de distancia es un fenómeno astronómico que relaciona la luminosidad de una estrella con su distancia. Este fenómeno está asociado a una ecuación que describe la diferencia de magnitudes para el brillo de un objeto celeste con su distancia | m - M = 5 log d - 5 | Esta ecuación se programa en tiempo real para expresar la causalidad en la acción e interacción de la persona usuaria que incide en el cambio de magnitudes y las magnitudes mismas."
dialogTexto.innerHTML = `
  <h2>¡Hola!</h2>
  <p>Esta <i>interfaz-interactiva</i> lúdica visualiza de manera pedagógica el <dfn title="${tileDFN}"><b>módulo de distancia</b></dfn>.</p>
  <p>
    Cómo es que el brillo que vemos de las estrellas, aparenta ser algo de lo que en verdad es, y
    cómo es que la distancia a la que están de nosotros, se relaciona con el tiempo que tarda 
    en llegar la luz desde el lugar en donde nos encontremos viéndolas.
  </p>
  <p>Puedes aprender sobre el brillo real vs. aparente de las estrellas modificando su luz y distancia.</p>
  <p>
    Hay estrellas que están muy cerca pero parece que brillan más en relación con otras,
    que están más lejos y brillan más, pero que su luz disminuye conforme aumenta su distancia.
  </p>  
`;
dialog.append(dialogTexto)

// crea el contenedor de botones
const dialogBotones = document.createElement("div");
dialogBotones.className = "dialog-botones"

// crea el botón de anterior
const buttonPrevious = document.createElement("button");
buttonPrevious.type = "button"
buttonPrevious.innerText = "<"
dialogBotones.append(buttonPrevious)
buttonPrevious.hidden = true;
// crea el botón de siguiente
const buttonNext = document.createElement("button");
buttonNext.type = "button"
buttonNext.innerText = ">"
dialogBotones.append(buttonNext)
// agrega contenedor al modal
dialog.append(dialogBotones)

let contador = 1
buttonNext.addEventListener('click', () => {
  if(contador === 1) {
    dialogTexto.innerHTML = `
      <h2>¡Comienza!</h2>
      <ul><li>
        Da clic sobre una estrella para <b>seleccionarla</b> y aumentar o disminuir su brillo o distancia.
      </li> </ul>
      <p>
        Mira cómo cambia la distancia en relación con el brillo de la estrella.
      </p>
      <p>
        No porque una estrella que parece que brilla más que la otra significa que está más grande o es más grande.
        Si no que puede ser que la otra esté más lejos y brilla más en comparación con la primera
        que puede estar más cerca y brillar menos.
      </p>
      <p>
        Una estrella poco luminosa puede verse brillante si está cerca de nosotros
        o una estrella muy luminosa puede verse tenue si está muy lejos.
      </p>
    `;
    buttonPrevious.hidden = false;
    contador = 2;
  } else if(contador === 2) {
    dialogTexto.innerHTML = `
      <h2>Créditos</h2>
      <ul>
        <li>
          <p><b>Github</b> repositorio.</p>
          <a 
            href="https://github.com/ciretorres/thesis-project" 
            target="_blank">
            https://github.com/ciretorres/thesis-project
          </a>
        </li>
        <li>
          <p><b>Tesis</b> proyecto. </p>          
          <a 
            href="http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf" 
            target="_blank">
            Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica
          </a>
        </li>
        <li>
          <p><b>Autor</b> Eric.</p>
          <a 
            href="https://ciretorres.github.io/" 
            target="_blank">
            https://ciretorres.github.io/
          </a>
        </li>
      </ul>
    `;
    buttonNext.hidden = true;
    contador = 3;
  }  
  
})

const dialogPrevious = () => {
  if(contador === 3) {
    dialogTexto.innerHTML = `
      <h2>¡Comienza!</h2>
      <ul><li>
        Da clic sobre una estrella para <b>seleccionarla</b> y aumentar o disminuir su brillo o distancia.
      </li> </ul>
      <p>
        Mira cómo cambia la distancia en relación con el brillo de la estrella.
      </p>
      <p>
        No porque una estrella que parece que brilla más que la otra significa que está más grande o es más grande.
        Si no que puede ser que la otra esté más lejos y brilla más en comparación con la primera
        que puede estar más cerca y brillar menos.
      </p>
      <p>
        Una estrella poco luminosa puede verse brillante si está cerca de nosotros
        o una estrella muy luminosa puede verse tenue si está muy lejos.
      </p>
    `;
    buttonNext.hidden = false;
    contador = 2;
  } else if(contador === 2) {
    dialogTexto.innerHTML = `
      <h2>¡Hola!</h2>
      <p>Esta <i>interfaz-interactiva</i> lúdica visualiza de manera pedagógica el <dfn title="${tileDFN}"><b>módulo de distancia</b></dfn>.</p>
      <p>
        Cómo es que el brillo que vemos de las estrellas, aparenta ser algo de lo que en verdad es, y
        cómo es que la distancia a la que están de nosotros, se relaciona con el tiempo que tarda 
        en llegar la luz desde el lugar en donde nos encontremos viéndolas.
      </p>
      <p>Puedes aprender sobre el brillo real vs. aparente de las estrellas modificando su luz y distancia.</p>
      <p>
        Hay estrellas que están muy cerca pero parece que brillan más en relación con otras,
        que están más lejos y brillan más, pero que su luz disminuye conforme aumenta su distancia.
      </p>  
    `;
    contador = 1;
    buttonPrevious.hidden = true;
  }  
}

buttonPrevious.addEventListener('click', () => {
  dialogPrevious();
})


mainid.append(dialog);

let toogledModal = false;

// exporta el método para mostrarlo u ocultarlo
export const toogleModal = () => {
  if (toogledModal) {
    dialog.style.display = "none";
    toogledModal = false;
  } else {
    contador = 2;
    buttonNext.hidden = false;
    dialogPrevious();
    dialog.style.display = "block";
    toogledModal = true;
  }
};
