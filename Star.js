function Star(x, y){
  var maxSize = 25;
  //var col = random(100);
  
  this.r = random(maxSize);
  this.pos = createVector(random(width), randY());
  this.vel = createVector(0, 0);
  
  //returns random y
  function randY(){
    return random(0, height);
  }
  
  //returns random x
  function randX(){
    return random(0, width);
  }
  
  //Returns new R
  function randR(){
    return random(1, maxSize);
  }

  this.update = function(){


    //FIX THIS SHIT!
    if(volHist[currHist] > maxVol){
      this.vel.y = map(volHist[currHist-1], 0, 1, this.r+15, -this.r-15);
      this.vel.x = map(volHist[currHist-1], 0, 1, this.r+15, -this.r-15);
      maxVol = volHist[currHist-1];
    }
    if(volHist[currHist] < maxVol){
      this.vel.y = map(volHist[currHist-1], -1, 0, this.r+15, -this.r-15);
      this.vel.x = map(volHist[currHist-1], -1, 0, this.r+15, -this.r-15);
      maxVol = volHist[currHist-1];
    }

    if(player.song.isPaused() || !player.song.isPlaying()){
      this.vel.x = map(mouseX, width, 0, this.r+15, -this.r-15);
      this.vel.y = map(mouseY, height, 0, this.r+15, -this.r-15);
    }else{
      this.vel.x = map(mouseX, width, 0, this.r+15, -this.r-15) * (1 + volHist[currHist-1] * 2)
      this.vel.y = map(mouseY, height, 0, this.r+15, -this.r-15) * (1 + volHist[currHist-1] * 2)
    }
  
    this.pos.sub(this.vel);
    
    //Hit top border
    if(this.pos.y < -15){
      this.r = randR();
      this.pos.x = randX();
      this.pos.y = height+this.r;
    }
    
    //Hit bottom border
    if(this.pos.y > height+15){
      this.r = randR();
      this.pos.x = randX();
      this.pos.y = -this.r;
    }
    
    //Hit left border
    if(this.pos.x < -15){
      this.r = randR();
      this.pos.x = width+this.r;
      this.pos.y = randY();
    }
    
    //Hit right border
    if(this.pos.x > width+15){
      this.r = randR();
      this.pos.x = -this.r;
      this.pos.y = randY();
    }
  }
  
  this.show = function(){
    if(col < 7){
     fill(0, 0, 20);
    }else{
      fill(col+colOffset, 100, col + 20);
    }
    ellipse(this.pos.x, this.pos.y, this.r + (this.r ** volHist[currHist-1]) ** 1.25, this.r  + (this.r ** volHist[currHist-1]) ** 1.25);
  }
}