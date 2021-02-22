class Star{  
  
  Star[] stars;
  String[] data;
  
  int hip;
  
  float ra_hms;
  float dec_dms;
  float app_mag;
  float abs_mag;
  float distance;
  float ra_deg;
  float dec_deg;
  float parallax;
  
  PVector starVector;
  float x;
  float y;
  float z;
  float alpha;
  
  int n = 0;
  
  
  Star(int total){
    // Constructor
    stars = new Star[total];
    
    //parseDataBase(total);
  }
  
  Star(int h, float Vmag, float absMag, float parsecs, float RAdeg, float DEdeg, float Plx, PVector starVector){    
    
    hip = h;
    //ra_hms = RAhms;
    //dec_dms = DEdms;
    app_mag = Vmag;
    alpha = 128;
    
    abs_mag = absMag;
    distance = parsecs;
    
    ra_deg = RAdeg;
    dec_deg = DEdeg;
    parallax = Plx;
    
    starVector = starVector;
    x = normalize(starVector.x);
    y = normalize(starVector.y);
    z = normalize(starVector.z);   
    
  }
  
  void render(){
    /* Draws the geometrical representation
    */
    pushMatrix();    
    noStroke();    
    fill(255);    
    translate(0,0, 0);    
    
    sphere(1); // The sun    
    
    // Draws Star 181 HIP: 85665
    fill(stars[181].alpha);
    translate(stars[181].x, stars[181].y, stars[181].z);    
    sphere(1);
    
    // Shows Stars Info in HeadsUpDisplay
    HUD.show(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, 
      stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, 
        stars[181].x, stars[181].y, stars[181].z, stars[181].alpha);    
   
    // Reset the translate
    x = stars[181].x*-1;
    y = stars[181].y*-1;
    z = stars[181].z*-1;
    translate(x,y,z);
   
   /* Draws all stars*/
   for(int i = 1; i < stars.length; i++){
      
      float x = stars[i].x*100;
      float y = stars[i].y*100;
      float z = stars[i].z*100;      
      
      translate(x,y,z);      
      
      if(i == 181){
        // do nothing
      } else {
        fill(255);
        sphere(1);
      }      
      
      // Reset the translate
      x = x*-1;
      y = y*-1;
      z = z*-1;
      translate(x,y,z);
      
    } // end for
    
    if(print){      
      // print the current info parameters star
      //println("HIP"+"   ABSmag"+"  APPmag"+"  Dist"+"        ra"+"      dec"+"        x"+"        y"+"        z"+"        alpha");
      //println(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, stars[181].x, stars[181].y, stars[181].z, stars[181].alpha);
      print = !print;
    }
    popMatrix();
    
    /* Modifies the Apparent Magnitude*/
    //modify_app_mag();
    modifies_app_mag();
    
    /* Modifies the Distance*/
    //modify_distance();
    modifies_distance();
    
    /* Modifies the Absolute Magnitude*/
    modify_abs_mag();
  } // end render
  
  void increase_app_mag(int index){
    int i = index;
    plus = true;
      
    stars[i].app_mag = stars[i].app_mag + 1;
    // Re-Assigns Distance value
    stars[i].distance = distance(stars[i].abs_mag, stars[i].app_mag);
    
    // Convert spherical to cartesian with a new 3D calculate position value
    PVector starVector = spherical_to_cartesian(stars[i].ra_deg, stars[i].dec_deg, stars[i].distance);
    
    // Re-Assigns X, Y, Z values
    stars[i].x = normalize(starVector.x);
    stars[i].y = normalize(starVector.y);
    stars[i].z  = normalize(starVector.z);
    
    // Re-Assigns the new calculate alpha value
    stars[i].alpha = calculate_alpha(stars[i].app_mag);
    
    up = !up;
  } // end increase_app_mag
  
  void decrease_app_mag(int index){
    int i = index;
    minus = true;
    
    stars[i].app_mag = stars[i].app_mag - 1;
    
    // Limit minimun distance (FIX!!!)
    //if(stars[181].distance < 1){
    //  stars[181].distance = stars[181].distance;
    //  stars[181].app_mag = stars[181].app_mag;
    //} else {
    //  stars[181].distance = stars[181].distance -1;
    //}
    
    // Re-Assigns Distance value
    stars[i].distance = distance(stars[181].abs_mag, stars[i].app_mag);
    
    // Convert spherical to cartesian with a new 3D calculate position value
    PVector starVector = spherical_to_cartesian(stars[i].ra_deg, stars[i].dec_deg, stars[i].distance);
    
    // Re-Assigns X, Y, Z values
    stars[i].x = normalize(starVector.x);
    stars[i].y = normalize(starVector.y);
    stars[i].z  = normalize(starVector.z);
    
    // Re-Assigns the new calculate Alpha value
    stars[i].alpha = calculate_alpha(stars[i].app_mag);
    
    down = !down;
  } // end decrease_app_mag
  
  void modifies_app_mag(){
    // n de index de stars[n].app_mag y .distance
    int n = 181;
    
    if(up && app_active){
      // Increase Apparent Magnitud
      increase_app_mag(n);            
    } else {
      if(down && app_active){
        // Decrease Apparent Magnitud        
        decrease_app_mag(n);        
      }
    }
    
  } // end modifies_app_mag
  
  void increase_distance(int index){
    int i = index;
    plus = true;
    println("Increase distance");      
    
    stars[i].distance = stars[i].distance + 1;      
    
    // Convert spherical to castesian with a new 3D calculate position values
    PVector starVector = spherical_to_cartesian(stars[i].ra_deg, stars[i].dec_deg, stars[i].distance);
    
    // Re-Assigns X, Y, Z values
    stars[i].x = normalize(starVector.x);
    stars[i].y = normalize(starVector.y);
    stars[i].z  = normalize(starVector.z);
    
    // Re-Assigns Apparent Magnitude value
    stars[i].app_mag = apparent_magnitude(stars[i].abs_mag, stars[i].distance);
    
    // Re-Assigns Alpha value
    stars[i].alpha = calculate_alpha(stars[i].app_mag);
    
    up = !up;
  } // end increase_distance
  
  void decrease_distance(int index){
    int i = index;
    minus = true;
    println("Decrease distance");      
        
    // Limit minimun distance
    if(stars[i].distance < 1){
      stars[i].distance = stars[i].distance;
    } else {
      stars[i].distance = stars[i].distance -1;
    }                
    
    // Convert spherical to castesian with a new 3D calculate position values
    PVector starVector = spherical_to_cartesian(stars[i].ra_deg, stars[i].dec_deg, stars[i].distance);
    
    // Re-Assign vector(x, y, z) values
    stars[i].x = normalize(starVector.x);
    stars[i].y = normalize(starVector.y);
    stars[i].z  = normalize(starVector.z);
    
    // Re-Assigns Apparent Magnitude value
    stars[i].app_mag = apparent_magnitude(stars[i].abs_mag, stars[i].distance);
    
    // Re-Assigns Alpha value
    stars[i].alpha = calculate_alpha(stars[i].app_mag);
    
    down = !down;
  } // end decrease_distance
  
  void modifies_distance(){
    // n de index de stars[n].app_mag y .distance
    int n = 181;
    
    if(up && dist_active){
      // Increase Distance
      increase_distance(n);            
    } else {
      if(down && dist_active){
        // Decrease Distance        
        decrease_distance(n);        
      }
    }
    
  } // end modifies_dist_mag
  
 float apparent_magnitude(float abs_mag, float distance){
    /* Obtains Apparent Magnitude from Absolute Magnitude and Distance in pársecs*/
    float m = log10(distance) * 5 - 5 + abs_mag;
    
    return m;
  } // end apparent_magnitude()
  
  float distance(float abs_mag, float app_mag){
    /* Obtains Distance from Absolute Magnitude and Apparent Magnitude*/
    float d = pow(10,(((app_mag-(abs_mag))+5)/5));
    
    return d;
  } // end distance()
  
  float calculate_alpha(float app_mag){
    /* Calculates alpha value
    */
    float alpha = ((128 * app_mag / 9.33)-(128 * 2)) * -1; // <------------------------!
    if(alpha <= 0){
      alpha = 0;
    }
    
    return alpha;
  } // end calculate_alpha
  
  void parseDB(String line){
    //System.out.println(line);
    
    String d = line;
    //System.out.println(d);
    
    String[] column = split(d, ',');
    //println(column[0], column[1], column[2], column[3], column[4]);
    //println(column[0]);
    
    int h = int(column[0]);
    float RAdeg = float(column[1]);
    float DEdeg = float(column[2]);
    float Vmag = float(column[3]);
    float Plx = float(column[4]);
    
    //println(Plx);
    
    float parsecs = parallax_to_parsecs(Plx);
      
    float absMag = distance_modulus(Vmag, parsecs);
        
    PVector star_vector = spherical_to_cartesian(RAdeg, DEdeg, parsecs);
    
    //println(parsecs);
    
    if(h != 0 && n < 184){
      println(n, h, Vmag, absMag, parsecs, RAdeg, DEdeg, Plx, star_vector);
      //print(n);
      stars[n-1] = new Star(h, Vmag, absMag, parsecs, RAdeg, DEdeg, Plx, star_vector);
    }
    n++;
    
  } // end parseDB
  
  void modify_abs_mag(){
    
  } // end modify_abs_mag()
  
  void modify_app_mag(){
    if(up && app_active){
      // Increases Apparent Magnitude
      
      plus = true;
      
      // Chooses star
      stars[181].app_mag = stars[181].app_mag +1;      
      
      // Re-Assigns Distance value
      stars[181].distance = distance(stars[181].abs_mag, stars[181].app_mag);
      
      // Calculates new 3D position values
      PVector starVector = spherical_to_cartesian(stars[181].ra_deg, stars[181].dec_deg, stars[181].distance);
      
      // Re-Assigns X, Y, Z values
      stars[181].x = normalize(starVector.x);
      stars[181].y = normalize(starVector.y);
      stars[181].z  = normalize(starVector.z);
      
      // Re-Assigns Alpha value
      stars[181].alpha = calculate_alpha(stars[181].app_mag);
      
      //println("HIP"+"   ABSmag"+"  APPmag"+"  Dist"+"        ra"+"      dec"+"        x"+"        y"+"        z"+"        alpha");
      //println(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, stars[181].x, stars[181].y, stars[181].z, stars[181].alpha);
      
      up = !up;
      
    } else {
      if(down && app_active){
        // Decreases Distance
        
        minus = true;        
        
        // Chooses star
        stars[181].app_mag = stars[181].app_mag -1;
        
        // Limit minimun distance (FIX!!!)
        //if(stars[181].distance < 1){
        //  stars[181].distance = stars[181].distance;
        //  stars[181].app_mag = stars[181].app_mag;
        //} else {
        //  stars[181].distance = stars[181].distance -1;
        //}
        
        // Re-Assigns Distance value
        stars[181].distance = distance(stars[181].abs_mag, stars[181].app_mag);
        
        // Calculates new 3D position values
        PVector starVector = spherical_to_cartesian(stars[181].ra_deg, stars[181].dec_deg, stars[181].distance);
        
        // Re-Assigns X, Y, Z values
        stars[181].x = normalize(starVector.x);
        stars[181].y = normalize(starVector.y);
        stars[181].z  = normalize(starVector.z);
        
        // Re-Assigns Alpha value
        stars[181].alpha = calculate_alpha(stars[181].app_mag);
        
        
        //println("HIP"+"   ABSmag"+"  APPmag"+"  Dist"+"        ra"+"      dec"+"        x"+"        y"+"        z"+"        alpha");
        //println(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, stars[181].x, stars[181].y, stars[181].z, stars[181].alpha);
        
        down = !down;
      }
    } // if-else-if
  } // end modify_app_mag()
  
  void modify_distance(){
    if(up && dist_active){
      // Increases Distance
      
      plus = true;
      
      // Chooses star
      stars[181].distance = stars[181].distance +1;      
      
      // Calculates new 3D position values
      PVector starVector = spherical_to_cartesian(stars[181].ra_deg, stars[181].dec_deg, stars[181].distance);
      
      // Re-Assigns X, Y, Z values
      stars[181].x = normalize(starVector.x);
      stars[181].y = normalize(starVector.y);
      stars[181].z  = normalize(starVector.z);
      // Re-Assigns Apparent Magnitude value
      stars[181].app_mag = apparent_magnitude(stars[181].abs_mag, stars[181].distance);
      // Re-Assigns Alpha value
      stars[181].alpha = calculate_alpha(stars[181].app_mag);
      
      //println("HIP"+"   ABSmag"+"  APPmag"+"  Dist"+"        ra"+"      dec"+"        x"+"        y"+"        z"+"        alpha");
      //println(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, stars[181].x, stars[181].y, stars[181].z, stars[181].alpha);
      
      up = !up;
      
    } else {
      if(down && dist_active){
        // Decreases Distance
        
        minus = true;
        
        // Limit minimun distance
        if(stars[181].distance < 1){
          stars[181].distance = stars[181].distance;
        } else {
          stars[181].distance = stars[181].distance -1;
        }                
        
        // Calculates new 3D position values
        PVector starVector = spherical_to_cartesian(stars[181].ra_deg, stars[181].dec_deg, stars[181].distance);
        
        // Re-Assigns X, Y, Z values
        stars[181].x = normalize(starVector.x);
        stars[181].y = normalize(starVector.y);
        stars[181].z  = normalize(starVector.z);
        // Re-Assigns Apparent Magnitude value
        stars[181].app_mag = apparent_magnitude(stars[181].abs_mag, stars[181].distance);
        // Re-Assigns Alpha value
        stars[181].alpha = calculate_alpha(stars[181].app_mag);
        
        
        //println("HIP"+"   ABSmag"+"  APPmag"+"  Dist"+"        ra"+"      dec"+"        x"+"        y"+"        z"+"        alpha");
        //println(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, stars[181].x, stars[181].y, stars[181].z, stars[181].alpha);
        
        down = !down;
      }
    } // if-else-if
  } // end modify_distance()
  
  
  
  void parseDataBase(int total){
    /* Parses DataBase
    */
    data = loadStrings("data/hip_100pc.csv");
    println("\nLoading csv data...\n");
    
    /* Assigns data table to variables
    */      
    stars = new Star[total];
    
    for(int i = 0; i < stars.length; i++){
      // Split CSV by ',' 
      String[] row = split(data[i], ',');
      
      //println(row[0], row[1], row[2], row[3], row[4]);  
      
      int h = int(row[0]); // HIP
      //float RAhms;
      //float DEdms;
      float Vmag = float(row[3]); // Vmag
      float RAdeg = float(row[1]); // RAdeg
      float DEdeg = float(row[2]); // DEdeg
      float Plx = float(row[4]); // Plx
      
      // Convertions
      float parsecs = parallax_to_parsecs(Plx); // Distance in pársecs
      
      float absMag = distance_modulus(Vmag, parsecs); // absMag
      
      PVector star_vector = spherical_to_cartesian(RAdeg, DEdeg, parsecs); // star_vector
      
      // Assigns
      stars[i] = new Star(h, Vmag, absMag, parsecs, RAdeg, DEdeg, Plx, star_vector);
      
    } // for
    
    //println("\nAssinging data to "+total+" objects...\n");
    
    //printArray(stars);
    //println();
    
    //println(stars[1].hip, stars[1].abs_mag, stars[1].app_mag, stars[1].distance, stars[1].x, stars[1].y, stars[1].z);
    //println(stars[181].hip, stars[181].abs_mag, stars[181].app_mag, stars[181].distance, stars[181].ra_deg, stars[181].dec_deg, stars[181].x, stars[181].y, stars[181].z);
    
  } // end parseDataBase
  
  float parallax_to_parsecs(float Plx){
    /* Converts Parallax to Pársecs
    */
    float pc = 1000/Plx;   
    
    return pc;
  } // end parallax_to_parsecs
  
  
  
  
  float distance_modulus(float Vmag, float parsecs){
    /* Calculates Absolute Magnitude from Apparent Magnitude and Distance in pársecs*/
    float m = Vmag;
    float d = parsecs;
    
    float abs_mag = log10(d) * -5 + 5 + m; 
    
    return abs_mag;
  } // end distance_modulus
  
  float log10(float x){
    /* Returns the logarithm of x with base 10
    */
    return (log(x) / log(10));
  } // end log
  
  PVector spherical_to_cartesian(float RAdeg, float DEdeg, float parsecs){
    /* Converts spherical polar coordinates to 3D rectangular cartesian coordinates
    
        Parameters
        ----------
        r : scalar, array_like, or `~astropy.units.Quantity`
            The radial coordinate (in the same units as the inputs).
        lat : scalar, array_like, or `~astropy.units.Quantity`
            The latitude (in radians if array or scalar)
        lon : scalar, array_like, or `~astropy.units.Quantity`
            The longitude (in radians if array or scalar)
    
        Returns
        -------
        x : float or array
            The first cartesian coordinate.
        y : float or array
            The second cartesian coordinate.
        z : float or array
            The third cartesian coordinate.
    */
    float r = parsecs;
    float lat = DEdeg;
    float lon = RAdeg;
    
    float x = r * cos(radians(lat)) * cos(radians(lon));
    float y = r * cos(radians(lat)) * sin(radians(lon));
    float z = r * sin(radians(lat));
    
    PVector v1 = new PVector(x, y, z);
    
    return v1;
  } // end spherical_to_cartesian
  
  float normalize(float n){
    /* Scale the stellar distance from 1 pársec to 100 pixels (1:100)
    */
    return n * 1;
  } // end normalize
  
  
} // end class
