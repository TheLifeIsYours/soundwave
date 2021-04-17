function Particle(x, y, v){
  var vx = map(v, 0.2, 1, .7, 5);
  var vy = map(v, 0.2, 1, .7, 5);
  var r = map(v, 0.2, 1, 1, 12);
  var col = random(100);
  
  // console.log("vx: "+vx);
  // console.log("vy: "+vy);

  this.pos = createVector(x, y);
  this.vel = createVector(x + random(-vx, vx), y-vy);
  
  
  this.vel.sub(this.pos);
  this.vel.setMag(5);
  
  this.update = function(){
    this.mxm = map(mouseX, 0, width, 1, -1);
    this.grav = createVector(this.mxm, 0.2);
    this.pos.add(this.vel);
    this.vel.add(this.grav);
  }
  
  this.show = function(){
    noStroke();
    fill(col, 100, 100);
    ellipse(this.pos.x, this.pos.y, r, r);
  }
}