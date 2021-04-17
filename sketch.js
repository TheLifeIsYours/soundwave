var stars = [];
var amt = 500;
var colOffset;
var duration;
var currHist;
var offsetX;
var pastAmp;
let volume = 0.05;
var maxVol = 0;
var song;
var textX;
var textY;
var col;
var amp;
var mic;
var hoverButton;
var y;
var songmeta;

var particles = [];
var volHist = [];
var currSong = 0;
var songs = [];
var q = 5;

var player;

this.format = function(t){
  var m = Math.floor(t / 60);
  var s = Math.floor(t % 60);
  if(s <= 9){
    s = "0"+s;
  }
  return m+":"+s;
} 

// function preload(){
//   // loadJSON("assets/audio/index.json", gotData);
// }

// function gotData(data){
//   songmeta = data;
  
//   for(var i = 0; i < data.length; i++){
//     songs[i] = "assets/audio/"+data[i].path;
//     loadSound(songs[i]);
//     console.log(data[i].path);
//   }
  
//   song = loadSound(songs[currSong]);
// }

// function changeSong(d){
//   song.stop();
//   if(d == "prev"){
//     currSong -= 1;
//   }
//   if(d == "next"){
//     currSong += 1;
//   }
  
//   song = loadSound(
//     songs[currSong], 
//     loadedSong(), 
//     console.log("Error occured whilst loading song: "+ songs[currSong]), 
//     loadingSong()
//     );
    
//     song.setVolume(volume)
//   }
  
//   function loadingSong(i){
//     console.log("loading"+ i++);
//   }
//   function loadedSong(){
//     if(song.isLoaded()){
//       console.log("loaded song!");
//       // toggleSong();
//     }
//   }
  
// function toggleSong(){
//   if(song.isPlaying()){
//     song.pause();
//   }else{
//     song.play();
//     song.setVolume(volume)
//     duration = this.format(player.song.duration());
//   }
// }

async function setup() {
  player = new Player()
  await player.init()

  createCanvas(innerWidth, innerHeight);
  colorMode(HSB, 100);
  noCursor();
  
  // player.song.play()
  
  amp = new p5.Amplitude();
  mic = new p5.AudioIn();

  // mic.start();

  offsetX = width/2 - player.song.duration()/2
  // duration = this.format(player.song.duration());
  
  //create clouds
  for(var i = 1; i < amt; i++){
    stars[i] = new Star();
  }
  
}

function draw() {
  if(!player.isLoaded) return
  player.update()
  
  background(0,0,0,  map(map(amp.getLevel(), 0, 1 * player.volume, 0, 1), 0, 1, 100, 0));//col+colOffset, 100, col);
  
  noStroke();
  for(var i = 1; i < stars.length; i++){
   stars[i].update();
   stars[i].show();
  }
  
  strokeWeight(2);
  noFill();
  
  if(player.song.isPlaying()){
    var vol = map(amp.getLevel(), 0, 1 * player.volume, 0, 1)
    volHist.push(vol);
  }else{
    if(volHist.length > player.song.currentTime()){
      volHist.splice(0, 1);
      q = 40;
    }
  }
  
  beginShape();
  for(var x = 0; x < volHist.length; x++){
    currHist = x;
    y = map(volHist[x], 0, 1, height/2, 0);
    col = map(volHist[x], 0, 1, 0, 200);
    
    
    stroke(col, 100, 100);
    // fill(volHist[x]*200, 100, 100);
    vertex(offsetX + x, y);
  }
  endShape();
  
  if(volHist[currHist] > 0.3){
    var p = new Particle(offsetX+x, y, volHist[currHist]);
    particles.push(p); 
  }
  
  //Color offset when volume reaches a certain level
  if(volHist[currHist] >= 0.55){
    colOffset = 50;
  }else{
    colOffset = 0;
  }
  
  //String pulling
  for(var i = 0; i < volHist.length ; i++){
    if(i <= player.song.currentTime() + q ){
      volHist[i] = lerp(volHist[i], 0, 0.125);
    }
  }
  
  if(volHist.length > player.song.duration()){
      volHist.splice(0, 1);
      q = 40;
    }else{
      q = 5;
  }

  //TextDisplaying below!!!
  stroke(100);
  strokeWeight(1);
  textSize(14);
  textX = offsetX - textWidth(player.durationText()); - 4;
  textY = height/2 + 16;

  //Time: duration and timestamp
  text(this.format(player.song.currentTime()), offsetX + player.song.currentTime(), textY);
  text(player.durationText(), textX, textY);

  //Title
  text(player.songData.title, 20, height-20);

  //Duration bar
  strokeWeight(4);
  line(offsetX, height/2, offsetX + player.song.currentTime(), height/2);

  noStroke();
  fill(255);
  
  //playButton
  if(!player.song.isPlaying() || player.song.isPaused()){
    beginShape();
    vertex(10+textX, 10+textY);
    vertex(30+textX, 20+textY);
    vertex(30+textX, 20+textY);
    vertex(10+textX, 30+textY);
    vertex(10+textX, 10+textY);
    vertex(10+textX, 30+textY);
    endShape();
  }

  //pauseButton
  if(player.song.isPlaying()){
    rect(10+textX, 10+textY, 7, 20);
    rect(23+textX, 10+textY, 7, 20);
  }

  //Next button
  beginShape();
  vertex(40+textX, 10+textY);
  vertex(60+textX, 20+textY);
  vertex(60+textX, 20+textY);
  vertex(40+textX, 30+textY);
  vertex(40+textX, 10+textY);
  vertex(40+textX, 30+textY);
  endShape();
  rect(57+textX, 10+textY, 5, 20);
  

  if(mouseX > 10+textX && mouseX < 30+textX && mouseY > 10+textY && mouseY < 30+textY){
    fill(0);
    hoverButton = 0;
  }else if(mouseX > 40+textX && mouseX < 63+textX && mouseY > 10+textY && mouseY < 30+textY){
    fill(0);
    hoverButton = 1;
  }else{
    fill(255);
  }

  noStroke();
  ellipse(mouseX, mouseY, 5, 5);
  
  //Removing Particles
  for(var i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].show();
    if(particles[i].pos.y > innerHeight){
     particles.splice(i, 1); 
    //  console.log("spliced");
    }
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  offsetX = width/2 - song.duration()/2
}
//Mouse Acctions
function mouseClicked(){
  if(hoverButton == 0){
    player.toggle()
  }
  if(hoverButton == 1){
    player.next()
  }
}

//KeyBoard commands
function keyReleased() {
  // console.log(keyCode);
  if(keyCode == 32){
    player.toggle()
  }
  if(keyCode == 78){
    player.next()
  }
  if(keyCode == 66){
    player.prev()
  }

  if(keyCode == LEFT_ARROW){
    player.rewind(5) //song.jump(song.currentTime() - 5);
  }

  if(keyCode == RIGHT_ARROW){
    player.forward(15) //song.jump(song.currentTime() + 15);
  }

  if(keyCode == UP_ARROW){
    player.volumeUp()
  }
  if(keyCode == DOWN_ARROW){
    player.volumeDown()
  }
}