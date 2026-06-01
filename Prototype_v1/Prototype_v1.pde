import peasy.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
/*
 Title: Interactive-Interface
 Author: Eric Torres, @ciretorres 
 Description: Prototype
 Version: v1
 Update: 03/2021
*/
PeasyCam camera;

Star stars;

Grid globe;
Grid globe_1;

HeadsUpDisplay HUD;

String[] data;

boolean small = false;

int ratioGlobe = 100; // ratio in pixels

//int camDistance = 2500;
//int camDistance = 270;
//int camDistance = 1270;
//int camDistance = 70;
int camDistance = 80;

int total_stars = 183; // stars quantity

PImage asset, welcome, text_interface, instructions_1, instructions_2;

PImage app_mag_icon_enabled, abs_mag_icon_enabled, dist_mag_icon_enabled;
PImage app_mag_icon_focused, abs_mag_icon_focused, dist_mag_icon_focused, increase_icon_focused, decrease_icon_focused;
PImage arrow_down_icon, arrow_up_icon, help_icon;
PImage bg;

PFont font_1_black, font_1_bold, font_1_semibold, font_1_semibold_1, font_1_regular;
PFont font_2_extrabold, font_2_bold, font_2_semibold, font_2_medium, font_2_regular;

boolean up, down, plus, minus  = false;
boolean app_active, abs_active, dist_active, help, help_2  = false;
boolean print = false;
boolean show_dialog_controller = true;
boolean start_welcome = true;

int lookAtX, lookAtY, lookAtZ = 0;

PImage assets_0, assets_1, assets_2, assets_3, assets;

PFont Font1, Font1_Bold, Font1_Semibold, Font1_Extrabold; 
PFont Font2, Font3;

void setup() {
  /*  Configuración
   */
  //size(displayWidth, displayHeight, P3D);
  //size(1366, 768, P3D); // SAMSUNG 32"
  //size(1280, 800, P3D); // ANDROID 8" or 15"
  //size(1024, 640, P3D);
  //size(1100, 700, P3D);
  fullScreen(P3D);
  orientation(LANDSCAPE);
  
  //frameRate(120);
  frameRate(60);
  //frameRate(30);
  smooth();  
  
  color baseColor = color(102);
  currentcolor = baseColor;
  
  // Define and create circle button
  color buttoncolor = color(204);
  color highlight = color(153);
  ellipseMode(CENTER);
  circle1 = new CircleButton((width/2)+255, (height/2)-255, 60, buttoncolor, highlight);
  
  circle2 = new CircleButton(width-87, height-390, 66, buttoncolor, highlight);
  
  circle3 = new CircleButton(85, height-211, 66, buttoncolor, highlight);
   
  circle4 = new CircleButton(186, height-211, 66, buttoncolor, highlight);
   
  circle5 = new CircleButton(290, height-211, 66, buttoncolor, highlight);
   
  circle6 = new CircleButton(240, height-295, 66, buttoncolor, highlight);
   
  circle7 = new CircleButton(135, height-295, 66, buttoncolor, highlight);
   
  circle8 = new CircleButton(186, height-110, 66, buttoncolor, highlight);
  
  // Define and create rectangular button
  rect1 = new RectButton((width/2)-290, (height/2)+130, 580, 70, buttoncolor, highlight);
  
  rect2 = new RectButton((width/2)-50, (height/2)+210, 100, 20, buttoncolor, highlight);
  
  rect3 = new RectButton((width/2)-290, (height/2)+210, 580, 70, buttoncolor, highlight);
  
  // FONTS
  font_1_black = createFont("fonts/Roboto/Roboto-Black.ttf", 16);
  font_1_bold = createFont("fonts/Roboto/Roboto-Bold.ttf", 32); 
  font_1_semibold = createFont("fonts/Roboto/Roboto-Medium.ttf", 64);
  font_1_semibold_1 = createFont("fonts/Roboto/Roboto-Medium.ttf", 32);
  font_1_regular = createFont("fonts/Roboto/Roboto-Regular.ttf", 16);
  
  font_2_extrabold = createFont("fonts/Baloo_Tamma_2/BalooTamma2-ExtraBold.ttf", 32);
  font_2_bold = createFont("fonts/Baloo_Tamma_2/BalooTamma2-Bold.ttf", 32); 
  font_2_semibold = createFont("fonts/Baloo_Tamma_2/BalooTamma2-SemiBold.ttf", 32);
  font_2_medium = createFont("fonts/Baloo_Tamma_2/BalooTamma2-Medium.ttf", 16);
  font_2_regular = createFont("fonts/Baloo_Tamma_2/BalooTamma2-Regular.ttf", 16);
  
  // ICONS
  app_mag_icon_enabled = loadImage("assets/1x/Artboard 48.png");
  abs_mag_icon_enabled = loadImage("assets/1x/Artboard 52.png");
  dist_mag_icon_enabled = loadImage("assets/1x/Artboard 56.png");
  
  app_mag_icon_focused = loadImage("assets/1x/Artboard 50.png");
  abs_mag_icon_focused = loadImage("assets/1x/Artboard 54.png");
  dist_mag_icon_focused = loadImage("assets/1x/Artboard 58.png");
  increase_icon_focused = loadImage("assets/1x/Artboard 65.png");
  decrease_icon_focused = loadImage("assets/1x/Artboard 61.png");
  
  arrow_down_icon = loadImage("assets/0.5x/Artboard 69@0.5x.png");
  arrow_up_icon = loadImage("assets/0.5x/Artboard 71@0.5x.png");
  help_icon = loadImage("assets/1x/Artboard 73.png");
  
  welcome = loadImage("assets/1x/welcome.png");
  
  instructions_1 = loadImage("assets/1x/instructions_1.png");
  instructions_2 = loadImage("assets/1x/instructions_2.png");  
  
  stars  = new Star(total_stars);
  
  camera = new PeasyCam(this, camDistance); // camera pixel's away
  camera.setRotations(-1.1, -0.5, 0);
  
  HUD = new HeadsUpDisplay();
  
  BufferedReader br;
  String line;
  
  try {    
    InputStream is = createInput("hip_100pc.csv");
    br = new BufferedReader(new InputStreamReader(is, "UTF-8"));    
    while((line=br.readLine())!=null){      
      //System.out.println(line);
      stars.parseDB(line); // <------- !
    }
  } catch (IOException e) {    
    System.out.println("IOException when trying to read sample.txt:\n"+e);
    System.exit(0);
  }
} // end setup

void draw() {  
  /* Dibujar 
  */
  background(0);  
  lights();  
  
  pushMatrix();  
  
  stars.render();  
  
  popMatrix();  
  
} // end draw

void keyPressed() {
  if (key == CODED) {
    if (keyCode == UP) {
      println("UP");
      camera.rotateX(-0.01);
    }
    if (keyCode == DOWN) {
      println("DOWN");
      camera.rotateX(+0.01);
    }
    if (keyCode == LEFT) {
      println("UP");
      camera.rotateY(-0.01);
    }
    if (keyCode == RIGHT) {
      println("DOWN");
      camera.rotateY(+0.01);
    }
  }
  
  if (key == ENTER) {
    println("ENTER");   
  }
  
  if (key == 'q') {    
    lookAtX = lookAtX -1; 
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }  
  if (key == 'e') {    
    
    lookAtX = lookAtX +1; 
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }  
  if (key == 'w') {    
    //cameraera.rotateY(+0.01);
    lookAtY = lookAtY +1; 
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }  
  if (key == 's') {
    //camera.rotateY(-0.01);
    lookAtY = lookAtY -1; 
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }  
  
  if(key == 'n'){    
    abs_active = false;
    dist_active = false;
    app_active = true;
  }
  if(key == 'm'){    
    app_active = false;
    dist_active = false;
    abs_active = true;
  }
  if(key == 'd'){    
    abs_active = false;
    app_active = false;
    dist_active = true;
  }
  
  if(key == '+'){
    up = true;
  } 
  if(key == '-'){   
    down = true;
  }  
  if(key == 'h'){    
    //help_active = false;
  }

} // end keyPressed

void mousePressed() {
  //println("x: ",mouseX," y: ",height-mouseY);
    
} // end mousePressed()
