class HeadsUpDisplay{
  
  Star starInfo;
  
  HeadsUpDisplay(){
    // Constructor
  }
  
  void show(int hip, float abs_mag, float app_mag, float distance, float ra_deg, float dec_deg, float x, float y, float z, float alpha){    
    /*  Esta función renderea todo lo que se va a dibujar en main. Imprime la distancia de la cámara del centro.
    */
    camera.beginHUD();    
    // Grid-System
    fill(255,0,0, 10);
    float w = (displayWidth / 12) - 20;
    //println("The width of each column: "+w);
    float x_axis = 40;
    for(int i = 0; i < 12; i++){
      //rect(x_axis,0,w,displayHeight);
      x_axis += w+18;
    }
    float h = (displayHeight / 10) - 20;
    //println("The width of each row: "+h);
    float y_axis = 40;
    for(int i = 0; i < 10; i++){
      //rect(0, y_axis, displayWidth,h);
      y_axis += h+16;
    }
    fill(255,0,0);
    //rect(width-118, height-422, 64, 64);
    
    dialog_controller();
    
    /* Retroalimenta la acción de incrementar y disminuir*/
    fill(255,255,255, 50);
    if(plus){
      ellipse(239, height-294, 64, 64);
      plus = !plus;
    } else {
      if(minus){
        ellipse(135, height-294, 64, 64);        
        minus = !minus;
      }
    }
    
    text_interface(hip, abs_mag, app_mag, distance, ra_deg, dec_deg, x, y, z, alpha);
    
    camera.endHUD();
  } // end show
  
  void text_interface(int hip, float abs_mag, float app_mag, float distance, float ra_deg, float dec_deg, float x, float y, float z, float alpha){
    /* Prints Information about the stars
    */
    imageMode(CORNER);
    
    //image(text_interface, width-322, height-462);    
    
    float[] r = camera.getRotations();
    float[] p = camera.getPosition();
    float[] look = camera.getLookAt();
    
    float ly = distance * 3.26;
    
    fill(43,182,255,50);
    rect(width-320,height-460,320,460,25,0,0,0);
    imageMode(CENTER);
    image(help_icon, width-86, height-390);
    
    if(app_active){
      textFont(font_1_semibold);
      fill(88,230,16);
      text("Star",width-285,height-355);
      
      fill(66,173,12);
      textFont(font_1_semibold_1);
      text("selection",width-285,height-320);
      
      fill(255);
      textFont(font_1_black);
      text("HIP: "
        +"\nRight Ascension: "
          +"\nDeclination: "
            +"\n"
              +"\nABSmag: "
                +"\n"
                  +"\n          : "
                    +"\n\nAlpha: "
                      +"\n\nFrameRate: ", width-285, height-260);
                          //+"\nFrameCount: ", width-285, height-260);
        text(""+hip
          +"\n"+ra_deg
            +"\n"+dec_deg
              +"\n"
                +"\n"+abs_mag
                  +"\n"+ly+" ly"
                    +"\n"
                      +"\n\n"+alpha
                        +"\n\n"+frameRate, width-125, height-260);
                            //+"\n"+frameCount, width-125, height-260);                                  
      fill(43,182,255);
      text("APPmag: "
        +"\n\nDist/Sol: ", width-285, height-187);
        //+"\n\nDist/Sol: ", width-285, height-203);
      text(""+app_mag
        +"\n\n\n"+distance+" pc", width-125, height-187);
    } else {
      if(abs_active){
        textFont(font_1_semibold);
        fill(88,230,16);
        text("Star",width-285,height-355);
        
        fill(66,173,12);
        textFont(font_1_semibold_1);
        text("selection",width-285,height-320);
        
        fill(255);
        textFont(font_1_black);
        text("HIP: "
          +"\nRight Ascension: "
            +"\nDeclination: "
              +"\nAPPmag:"
                +"\n"
                  +"\nDist/Sol:"
                    +"\n          : "
                      +"\n\nAlpha: "
                        +"\n\nFrameRate: ", width-285, height-260);
                            //+"\nFrameCount: ", width-285, height-260);
          text(""+hip
            +"\n"+ra_deg
              +"\n"+dec_deg
                +"\n"+app_mag
                  +"\n"
                    +"\n"+ly+" ly"
                      +"\n"+distance+" pc"
                        +"\n\n"+alpha
                          +"\n\n"+frameRate, width-125, height-260);
                              //+"\n"+frameCount, width-125, height-260);                                  
        
        fill(43,182,255);
        text("\nABSmag: ", width-285, height-187);
        text("\n"+abs_mag, width-125, height-187);
      } else {
        if(dist_active){
          textFont(font_1_semibold);
          fill(88,230,16);
          text("Star",width-285,height-355);
          
          fill(66,173,12);
          textFont(font_1_semibold_1);
          text("selection",width-285,height-320);
          
          fill(255);
          textFont(font_1_black);
          text("HIP: "
            +"\nRight Ascension: "
              +"\nDeclination: "
                +"\n"
                  +"\nABSmag: "
                    +"\n"
                      +"\n          : "
                        +"\n\nAlpha: "
                          +"\n\nFrameRate: ", width-285, height-260);
                              //+"\nFrameCount: ", width-285, height-260);
            text(""+hip
              +"\n"+ra_deg
                +"\n"+dec_deg
                  +"\n"
                    +"\n"+abs_mag
                      +"\n"+ly+" ly"
                        +"\n"
                          +"\n\n"+alpha
                            +"\n\n"+frameRate, width-125, height-260);
                                //+"\n"+frameCount, width-125, height-260);                                  
          fill(43,182,255);
          text("APPmag: "
            +"\n\nDist/Sol: ", width-285, height-187);
            //+"\n\nDist/Sol: ", width-285, height-203);
          text(""+app_mag
            +"\n\n\n"+distance+" pc", width-125, height-187);
        } else {
          if(app_active == false && abs_active == false && dist_active == false){
            textFont(font_1_semibold);
            fill(88,230,16);
            text("Star",width-285,height-355);
            
            fill(66,173,12);
            textFont(font_1_semibold_1);
            text("selection",width-285,height-320);
            
            fill(255);
            textFont(font_1_black);
            text("HIP: "
              +"\nRight Ascension: "
                +"\nDeclination: "
                  +"\nAPPmag: "
                    +"\nABSmag: "
                      +"\nDist/Sol: "
                        +"\n          : "
                          +"\n\nAlpha: "
                            +"\n\nFrameRate: ", width-285, height-260);
                                //+"\nFrameCount: ", width-285, height-260);
              text(""+hip
                +"\n"+ra_deg
                  +"\n"+dec_deg
                    +"\n"+app_mag
                      +"\n"+abs_mag
                        +"\n"+ly+" ly"
                          +"\n"+distance+" pc"
                            +"\n\n"+alpha
                              +"\n\n"+frameRate, width-125, height-260);
                                  //+"\n"+frameCount, width-125, height-260);
                                
                
          }      
          
        }  
      }      
    }               
  } // end text_interface
  
  void dialog_controller(){
    /*Builds the dialog controller*/
    imageMode(CORNER);
    //image(asset, 40, height-240);
    imageMode(CENTER);
    image(arrow_down_icon, 187, height-100);
    
    if(app_active){
      image(increase_icon_focused, 239, height-295);
      image(decrease_icon_focused, 135, height-295);
      
      image(app_mag_icon_focused, 83, height-210);
      image(abs_mag_icon_enabled, 187, height-210);
      image(dist_mag_icon_enabled, 291, height-210);
    } else {
      if(abs_active){      
      image(app_mag_icon_enabled, 83, height-210);
      image(abs_mag_icon_focused, 187, height-210);
      image(dist_mag_icon_enabled, 291, height-210);  
      } else {
        if(dist_active){
          image(increase_icon_focused, 239, height-295);
          image(decrease_icon_focused, 135, height-295);
          
          image(app_mag_icon_enabled, 83, height-210);
          image(abs_mag_icon_enabled, 187, height-210);
          image(dist_mag_icon_focused, 291, height-210);
        } else {
          if(app_active == false && abs_active == false && dist_active == false){
            image(app_mag_icon_enabled, 83, height-210);
            image(abs_mag_icon_enabled, 187, height-210);
            image(dist_mag_icon_enabled, 291, height-210);
          }
        }
      }
    }
    
  }
  
  void print_info(float hip, float abs_mag, float app_mag, float distance, float ra_deg, float dec_deg, float x, float y, float z, float alpha){
    //text("HIP: "+hip+"\nABSmag: "+abs_mag+"\nAPPmag: "+app_mag+"\nDist: "+distance+"\nra: "+ra_deg+"\ndec: "+dec_deg+"\nx: "+x+"\ny: "+y+"\nz: "+z+"\nalpha: "+alpha,10,10);  
  } // ennd print_info

} // end class
