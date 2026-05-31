/**
 * @class HeadsUpDisplay Se trata de la parte del software que interactúa
 * directamente con la interfaz de usuaria. Controla el diálogo entre
 * el backend y el frontend del proyecto.
 *
 * @property {Object} controladorDialogo Indica el controlador de diálogo.
 * @property {Object} modalBienvenida Indica el modal de bienvenida.
 * @property {Object} modalInstrucciones Indica el modal de intrucciones.

 * @property {function} display Renderea todo lo que se va a dibujar.
 *
 * @property {function} contruyeModalBienvenido Contruye el modal con las 
 * propiedades de bienvenida.
 * @property {function} construyeModalInstrucciones Contruye el modal con
 * las instrucciones.
 */
class HeadsUpDisplay {
  // inicia controlador de diálogo
  ControladorDialogo controladorDialogo = new ControladorDialogo();
  // inicia modales
  Modal modalBienvenida = new Modal();
  Modal modalInstrucciones = new Modal();

  HeadsUpDisplay() {
    // Constructor

    construyeModalBienvenido();
    construyeModalIntrucciones();    
  }

  // Método donde se renderea todo lo que se va a dibujar
  void display() {
    update();

    /**
     * Utility methods to permit the use of a Heads-Up Display.
     * Begin and end screen-aligned 2D-drawing.
     * @see https://mrfeinberg.com/peasycam/reference/index.html
     */  
    camera.beginHUD();
    //
    // mostrar controlador de dialogo
    controladorDialogo.mostrar();

    // abrir modal
    switch(opcionDialogAbierto) {
    case 0:
      modalBienvenida.show();
      break;
    case 1:
      modalInstrucciones.show();
      break;
    default:
      // println("cerrados");
    }

    camera.endHUD();
  }
  
  // Método para construir las propiedades del modal de bienvenida
  void construyeModalBienvenido() {
    // propiedades
    modalBienvenida.id = "dialogBienvenido";
    modalBienvenida.titulo = "Bievenida";
    modalBienvenida.texto = "";
    // btn instrucciones
    modalBienvenida.conBtnInferiorUno = true; 
    modalBienvenida.btnInferiorUnoId = "idBtnInstrucciones";     
    modalBienvenida.btnInferiorUnoColorFondo = color(255, 255, 255, 0);
    modalBienvenida.btnInferiorUnoTexto = "Instrucciones"; 
    modalBienvenida.btnInferiorUnoTextoTamanio = 24;
    // btn comenzar
    modalBienvenida.conBtnInferiorDos = true;
    modalBienvenida.btnInferiorDosId = "idBtnComenzar";
    modalBienvenida.btnInferiorDosColorFondo = color(0);    
    modalBienvenida.btnInferiorDosTexto = "Comenzar";
    modalBienvenida.btnInferiorDosTextoTamanio = 56;
  }
  // Método para construir las propiedades del modal con las instrucciones
  void construyeModalIntrucciones() {
    // propiedades
    modalInstrucciones.id = "dialogInstrucciones";
    modalInstrucciones.titulo = "Instrucciones";
    modalInstrucciones.texto = "";
    // btn instrucciones
    modalInstrucciones.conBtnInferiorUno = true;    
    modalInstrucciones.btnInferiorUnoId = "idBtnListo";
    modalInstrucciones.btnInferiorUnoColorFondo = color(255, 255, 255, 0);
    modalInstrucciones.btnInferiorUnoTexto = "Listo";
    modalInstrucciones.btnInferiorUnoTextoTamanio = 56;
    // btn cerrar
    modalInstrucciones.conBtnCerrar = true;
    modalInstrucciones.btnCerrarId = "idBtnCerrar";
    modalInstrucciones.btnForma = "circle";
    modalInstrucciones.btnCerrarFondoColor = color(255);
    modalInstrucciones.btnCerrarTamanio = 88;
    // insertar iconos

  }
  
  /** @function update Método para actualizar cada frame */
  void update() {

  }
}
