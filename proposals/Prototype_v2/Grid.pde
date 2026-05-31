/** 
 * @class Grid
 *
 * @property {total}: 
 * @property {radio}: 
 * @property {strokeWeight}: 
 * @property {strokeColor}: 
 * @property {grid}: 
 */
class Grid {
  // propiedades
  int total = 100; // la resolución total del grid en pixeles
  int ratio = 100; // el radio del grid
  int strokeWeight = 1; // el ancho del borde del grid
  color strokeColor = color(255); // el color del borde del grid
  PVector[][] grid; // un vector con el total de dimensiones por resolución
  
  Grid() {
    // Constructor
  }
  
  Grid(int radius) {
    ratio = radius;
    grid = new PVector[total + 1][total + 1];    
    calcularGrid(ratio);
  }

  Grid(int radius, color strokeColor) {
    this.ratio = radius;
    this.strokeColor = strokeColor;
    grid = new PVector[total + 1][total + 1];    
    calcularGrid(ratio);
  }
  
  // Muestra un Grid vectorial esférico
  void show() {
    noFill();
    strokeWeight(strokeWeight);
    stroke(strokeColor);
    
    for(int i = 0; i < total; i++) {
      beginShape(LINES);
      for(int j = 0; j < total; j++) {
        // Asignando valores de vector a PVector vector1
        PVector vector1 = grid[i][j];
        PVector v1 = vector1;
        // Dibujar el vertex
        vertex(v1.x, v1.y, v1.z);        

        // Asignando valores de vector a PVector vector2
        PVector vector2 = grid[i + 1][j];;
        PVector v2 = vector2;
        // Dibujar el vertex
        vertex(v2.x, v2.y, v2.z);
      }
      endShape();
      
      beginShape();
      for(int j = 0; j < total+1; j++) {
        // Asignando valores de vector a PVector vector3
        PVector vector3 = grid[i + 1][j];
        PVector v3 = vector3;
        // Dibujar vertex
        vertex(v3.x, v3.y, v3.z);
      }
      endShape(CLOSE);
    }    
  }
  
  /* 
   * Convierte coordenadas 2D ecuatoriales a cartesianas 3D rectangulares
   * @property {ratio}: el radio para calcular grid
   */    
  void calcularGrid(float ratio) {    
    
    for(int i = 0; i < total+1; i++) {
      // Calcula 100 valores de latitude a partir de 0.0 * PI (3.1415927)
      float pi = PI;
      float latitude = map(i, 0, total, 0, pi);
      // println("Latitude: "+ latitude + ", i: " + i + ", pi: "+ pi);      

      for(int j = 0; j < total+1; j++) {
        // Por cada valor de latitude, calcula 100 valores de longitude 
        // a partir de 0.0 to TWO_PI (6.2831855)
        float two_pi = TWO_PI;
        float longitude = map(j, 0, total, 0, two_pi);
        // println("Longitude: " + longitude + ", i: " + i + ", pi: " + two_pi);        

        /* 
         * Fórmula para obtener los valores de las dimensiones esféricas:
         * x = r sin(θ) cos(Φ / φ)
         * y = r sin(θ) sin(Φ / φ)
         * z = r cos(θ)
        */
        float r = ratio;
        float x = r * sin(latitude) * cos(longitude);
        float y = r * sin(latitude) * sin(longitude);
        float z = r * cos(latitude);
        // println("X: " + x + ", Y: " + y + ", Z: " + z);        

        // Asignando PVector(x,y,z) a arreglo bidimensional grid[][]
        grid[i][j] = new PVector(x, y, z);
        // println("grid[ " + i + " ][ " + j 
        //   + " ] = [ X:" + grid[i][j].x 
        //   + " Y:" + grid[i][j].y 
        //   + " Z:" + grid[i][j].z + " ]");        
      } 
    }     
  }

}
