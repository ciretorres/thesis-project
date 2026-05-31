import peasy.*;
/**
 * Prototype_v2
 * Interfaz-interactiva para la visualización de un fenómeno astronómico.
 *
 * @property {Object} camera 
 * @property {int} distanciaCamera
 * @property {boolean} rotarCamera (default: true)
 * @property {float} count (default: 0)
 * @property {Object} HUD
 * @property {color} baseColor (default: color(0))
 * @property {color} backgroundColor (default: baseColor)
 * @property {int} espaciado (default: 24) 
 * @property {int} borderRadius (default: 20) 
 * @property {int} tituloTamanio (default: 24) 
 * @property {int} textoTamanio (default: 24) 
 * @property {int} opcionDialogAbierto (default: 0) 
 * @property {Object} 
 * @property {int} globeRadius (default: 100) 
 * @property {color} globeStrokeColor (default: color(0, 255 , 0, 80)) 
 */

// Indica el objeto de la cámara Peasycam
PeasyCam camera;
// int distanciaCamera = 80;
int distanciaCamera = 210; // Indica la distancia de la cámara en pixeles desde el origen (0,0,0)
boolean rotarCamera = true; //  Activa la rotación de la cámara
float count = 0; // Indica el conteo de frames en el draw

//--

// Indica el objeto del HeadsUpDisplay
HeadsUpDisplay HUD;

// estilos generales
color baseColor = color(0);
// color currentColor = baseColor;
color backgroundColor = baseColor;

// variables globales de estilo
int espaciado = 24; // Indica el tamaño del espaciado.
int borderRadius = 20; // Indica el tamaño del radio para los bordes.
int tituloTamanio = 56; // Indica el tamaño del titulo.
int textoTamanio = 24; // Indica el tamaño del texto.

// variables globales
// Indica la opción que debe estar abierta para el diálogo modal.
int opcionDialogAbierto = 0;

//--

// variables de globe Grid
// Grid Indica la retícula esférica.
Grid globe;
int globeRadius = 100; // Indica el radio de la esfera.
color globeStrokeColor = color(0, 255 , 0, 80); // Indica el color del borde de la esfera.
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
