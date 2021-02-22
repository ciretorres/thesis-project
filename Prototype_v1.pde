import peasy.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
/*
 Title: Interactive-Interface
 Author: Eric Torres, @ciretorres 
 Description: Prototype
 Version: v0.1
 Update: 02/2021
*/
PeasyCam camera;

Star stars;

Grid globe;
Grid globe_1;

HeadsUpDisplay HUD;

String[] data;

int ratioGlobe = 100; // ratio in pixels

//int camDistance = 2500;
//int camDistance = 270;
//int camDistance = 1270;
//int camDistance = 70;
int camDistance = 80;

int total_stars = 183; // stars quantity

PImage asset, welcome, text_interface;

PImage app_mag_icon_enabled, abs_mag_icon_enabled, dist_mag_icon_enabled;
PImage app_mag_icon_focused, abs_mag_icon_focused, dist_mag_icon_focused, increase_icon_focused, decrease_icon_focused;
PImage arrow_down_icon, arrow_up_icon, help_icon;

PFont font_1_black, font_1_bold, font_1_semibold, font_1_semibold_1, font_1_regular;
PFont font_2_extrabold, font_2_bold, font_2_semibold, font_2_medium, font_2_regular;

boolean up, down, plus, minus  = false;
boolean app_active, abs_active, dist_active  = false;
boolean print = false;

int lookAtX, lookAtY, lookAtZ = 0;

PImage assets_0, assets_1, assets_2, assets_3, assets;

PFont Font1, Font1_Bold, Font1_Semibold, Font1_Extrabold; 
PFont Font2, Font3;

void setup() {
  /*  Configuración
   */
  //size(displayWidth, displayHeight, P3D);
  //size(1366, 768, P3D); // SAMSUNG 32"
  //size(1280, 800, P3D); // ANDROID 8"
  //size(1024, 640, P3D);
  fullScreen(P3D);
  //size(1100, 700, P3D);  
  
  //colorMode(RGB);
  //loadPixels();
  //noLights();
  //lights();
  smooth();  
  
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
  asset = loadImage("assets/1x/dialog-controller.png");
  app_mag_icon_enabled = loadImage("assets/1x/Artboard 48.png");
  abs_mag_icon_enabled = loadImage("assets/1x/Artboard 52.png");
  dist_mag_icon_enabled = loadImage("assets/1x/Artboard 56.png");
  
  app_mag_icon_focused = loadImage("assets/1x/Artboard 50.png");
  abs_mag_icon_focused = loadImage("assets/1x/Artboard 54.png");
  dist_mag_icon_focused = loadImage("assets/1x/Artboard 58.png");
  //increase_icon_focused = loadImage("assets/0.5x/Artboard 65@0.5x.png");
  //decrease_icon_focused = loadImage("assets/0.5x/Artboard 61@0.5x.png");
  increase_icon_focused = loadImage("assets/1x/Artboard 65.png");
  decrease_icon_focused = loadImage("assets/1x/Artboard 61.png");
  
  arrow_down_icon = loadImage("assets/0.5x/Artboard 69@0.5x.png");
  arrow_up_icon = loadImage("assets/0.5x/Artboard 71@0.5x.png");
  help_icon = loadImage("assets/1x/Artboard 73.png");
  
  welcome = loadImage("assets/1x/welcome.png");
  text_interface = loadImage("assets/1x/text-interface.png");
  
  String[] fontList = PFont.list();
  for(int i = 0; i < fontList.length; i++){
    //println(fontList[i]);
    if(fontList[i].contains("OpenSans")){
      //println(fontList[i]);
    }
  }  
  
  Font1 = createFont("OpenSans", 18);
  Font1_Bold = createFont("OpenSans-Bold", 24);
  Font1_Semibold = createFont("OpenSans-Semibold", 18);  
  Font1_Extrabold = createFont("OpenSans-Extrabold", 18);  
  
  assets_0 = loadImage("imgs/Assets_0.png");
  assets_1 = loadImage("imgs/Assets_1.png");
  assets_2 = loadImage("imgs/Assets_2.png");
  assets_3 = loadImage("imgs/Assets_3.png");
  assets = loadImage("assets/1x/asset.png");
  
  stars  = new Star(total_stars);
  
  globe = new Grid(ratioGlobe); 
  globe_1 = new Grid(ratioGlobe*10);  
  
  camera = new PeasyCam(this, camDistance); // camera pixel's away
  //cam.setRotations(1.4, -0.19, 0);
  camera.setRotations(-1.1, -0.5, 0);
  
  HUD = new HeadsUpDisplay();
  
  //stars = new Star();
  
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
  
  //globe.show();
  globe_1.show();
  
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
    print = true;
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
  if(mouseX >= 40 && mouseX <= 126 
      && mouseY >= height-243 && mouseY <= height-178){    // Magnitud Aparente
      abs_active = false;
      dist_active = false;
      app_active = true;
      println("App_mag Pressed");
    }
    if(mouseX >= 144 && mouseX <= 230 
      && mouseY >= height-243 && mouseY <= height-178){    // Magnitud Absoluta
      app_active = false;
      dist_active = false;
      abs_active = true;
      println("Abs_mag Pressed");
    }
    if(mouseX >= 248 && mouseX <= 334 
      && mouseY >= height-243 && mouseY <= height-178){    // Distancia
      abs_active = false;
      app_active = false;
      dist_active = true;
      println("Dist Pressed");
    }
    
    if(mouseX >= 207 && mouseX <= 239 
      && mouseY >= height-311 && mouseY <= height-247){ // Increase
      if(app_active || dist_active){
        up = true;
      }      
    }
    if(mouseX >= 103 && mouseX <= 167 
      && mouseY >= height-311 && mouseY <= height-247){   // Decrease
      if(app_active  || dist_active){
        down = true;
      }      
    }
    
    if(mouseX >= width-118 && mouseX <= width-182 
      && mouseY >= height-422 && mouseY <= height-486){   // Help
      
    }
  
} // end mousePressed()
