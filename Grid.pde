class Grid{
  
  int total;
  int ratio;
  PVector[][] grid;
  
  Grid(){
    // Constructor
  }
  
  Grid(int radius){
    ratio = radius;
    total = 100; // pixel's resolution
    grid = new PVector[total+1][total+1];
    
    calculateGrid(ratio);
  }
  
  void show(){
    /* Shows a Spherical Vectorial Grid
    */
    noFill();
    strokeWeight(1);
    stroke(255, 10);
    
    for(int i = 0; i < total; i++){
      beginShape(LINES);
      for(int j = 0; j < total; j++){
        // Assigns vector values to PVector vector1
        PVector vector1 = grid[i][j];
        PVector v1 = vector1;
        // Draws vertex
        vertex(v1.x, v1.y, v1.z);
        
        // Assigns vector values to PVector vector2
        PVector vector2 = grid[i+1][j];;
        PVector v2 = vector2;
        // Draws vertex
        vertex(v2.x, v2.y, v2.z);
      } // for
      endShape();
      
      beginShape();
      for(int j = 0; j < total+1; j++){
        // Assigns vector values to PVector vector3
        PVector vector3 = grid[i+1][j];
        PVector v3 = vector3;
        // Dibuja vertex
        vertex(v3.x, v3.y, v3.z);
      } // for
      endShape(CLOSE);
    } // for
    
  } // end render
  
  void calculateGrid(float ratio){
    /* Converts 2D ecuatorial coordinates to 3D rectangular cartesian coordinates
    */    
    float r = ratio;
    
    for(int i = 0; i < total+1; i++){
      // Calculate 100 latitudes values from 0.0 * PI
      float pi = PI;
      float lat = map(i, 0, total, 0, pi);
      //println("\n-------");
      //println("Latitude: "+lat+" i :"+i+" pi:"+pi);
      
      for(int j = 0; j < total+1; j++){
        // For every latitude value, Calculate 100 longitudes values from 0.0 to TWO_PI
        float two_pi = TWO_PI;
        float lon = map(j, 0, total, 0, two_pi);
        //println("\nLongitude:"+lon+" i:"+i+" pi:"+two_pi);
        
        /* Formula for obtaining spheric dimensions values
           x = r sin(θ) cos(Φ/φ)
           y = r sin(θ) sin(Φ/φ)
           z = r cos(θ)
        */
        float x = r * sin(lat) * cos(lon);
        float y = r * sin(lat) * sin(lon);
        float z = r * cos(lat);
        //println("X: "+x+", Y: "+y+", Z: "+z);
        
        // Assigns PVector(x,y,z) to bidimensional grid[][] array
        grid[i][j] = new PVector(x, y, z);
        //println("gridArray["+i+"]["+j+"]\n[ z:"+grid[i][j].x+" y:"+grid[i][j].y+" z:"+grid[i][j].z+" ]");
        
      } // for
    } // for
    
  } // end calculateGrid

} //----- end class
