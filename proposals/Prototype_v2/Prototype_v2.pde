import peasy.*;
/**
 * Prototype_v2
 * Interfaz-interactiva para la visualización de un fenómeno astronómico. 
 * En este caso el módulo distancia que relaciona la distancia con el brillo 
 * de una estrella.
 *
 * @property {Object} camera Indica el objeto de la cámara Peasycam.
 * @property {int} distanciaCamera Indica la distancia de la cámara en pixeles desde el origen (0,0,0).
 * @property {boolean} rotarCamera (default: true) Activa la rotación de la cámara.
 * @property {float} count (default: 0) Indica el conteo de frames en el draw.
 *
 * @property {Object} HUD Indica el objeto del HeadsUpDisplay.
 *
 * @property {color} baseColor (default: color(0)) Indica el color base.
 * @property {color} backgroundColor (default: baseColor) Indica el color para el fondo.
 * @property {int} espaciado (default: 24) Indica el tamaño del espaciado.
 * @property {int} borderRadius (default: 20) Indica el tamaño del radio para los bordes.
 * @property {int} tituloTamanio (default: 24) Indica el tamaño del titulo.
 * @property {int} textoTamanio (default: 24) Indica el tamaño del texto.
 * @property {int} opcionDialogAbierto (default: 0) Indica la opción que debe estar abierta para el diálogo modal.
 *
 * @property {Object} Grid Indica la retícula esférica.
 * @property {int} globeRadius (default: 100) Indica el radio de la esfera.
 * @property {color} globeStrokeColor (default: color(0, 255 , 0, 80)) Indica el color del borde de la esfera.
 */
PeasyCam camera;
// int distanciaCamera = 80;
int distanciaCamera = 210;
boolean rotarCamera = true;
float count = 0;

HeadsUpDisplay HUD;

/** estilos generales */
color baseColor = color(0);
// color currentColor = baseColor;
color backgroundColor = baseColor;
// variables globales de estilo
int espaciado = 24;
int borderRadius = 20;
int tituloTamanio = 56;
int textoTamanio = 24;
/** variables globales */
int opcionDialogAbierto = 0;

/** variables de globe Grid */
Grid globe;
int globeRadius = 100;
color globeStrokeColor = color(0, 255 , 0, 80);
// color globeStrokeColor = color(255, 0 , 0, 80);

// Método para configurar el entorno
void setup() {
  // Tamaño de la pantalla
  // size(1366, 768, P3D);
  size(1024, 640, P3D);
  // fullScreen(P3D);

  orientation(LANDSCAPE); // orientación de la pantalla
  frameRate(60); // rango de cuadros por segundos
  smooth();

  // Cargar tipografía
  // Cargar iconos

  // iniciando cámara
  camera = new PeasyCam(this, distanciaCamera);
  // iniciando globo grid
  globe = new Grid(globeRadius, globeStrokeColor);
  // Cargar estrellas

  // iniciando interfaz gráfica
  HUD = new HeadsUpDisplay();
}

// Método para dibujar mientras se ejecuta el entorno
void draw() {
  // Color de fondo
  background(backgroundColor);
  lights(); // luz del ambiente predeterminada
  // Rotate camera
  if (rotarCamera) {
    camera.setRotations(count/2000, count/2000, count/2000);
    count++;
  } 

  /**
   * Push-Pop the current transformation matrix onto the matrix stack.
   * @see https://processing.org/reference/pushMatrix_.html
   * @see https://processing.org/reference/popMatrix_.html
   */
  pushMatrix();
  // mostrar grid
  globe.show();

  // Mostrar las estrellas

  // muestra la HeadsUpDisplay
  // HUD.display();


  popMatrix();
}

// Método para enterarse cuando se dió click
void mouseClicked() {
  println("click");
  println(opcionDialogAbierto);
  opcionDialogAbierto = abrirDialogAbierto;
}
