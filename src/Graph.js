//a Graph is five scanlines concatenated to a single string
//
//   _________*_*_____________*____ scanLine 0
//   _______*_____*_________*______ scanLine 1
//   _____*_________*__*_*_________ scanLine 2
//   _*_*__________________________ scanLine 3
//   ______________________________ scanLine 4
//
//arguments :
//  game            : reference to current game 
//  x,y             : position of graph relative to top-left corner of game
//  scale           : font-size and width of <pre> times this scalevalues(default 1)
//  refreshRate     : draw graph every refreshRate ms
//  maxY (in dev)   : the highest value of your input variable
//  label (in dev)  : the label of your input variable
//  input (in dev)  : your input variable

var Graph = function (game,x,y,scale,refreshRate,maxY,label){
  this.game=game,this.scale=scale,this.label=label,this.maxY=maxY;
  //explained in Graph.draw(), the zeros are used to pad the final string result.
  this.scanBinary=this.shiftCount=0;this.zeros= Array(37).join("0");
  // add the 5 scanlines      
  this.line0=new Scanline(this,0),this.line1=new Scanline(this,1),
  this.line2=new Scanline(this,2),this.line3=new Scanline(this,3),
  this.line4=new Scanline(this,4);
  return this;
}
//graph drawing, concatenates Scanline.draw() outputs, then displays the string
Graph.prototype.draw =function(){
  //which input to draw
  this.input=this.label=="FPS"?this.game.time.fps:this.game.time.elapsedMS;
  //60 fps->row 0, 50 fps->row 1 , 40 fps->row 2.......
  this.rownumber=~~((this.input)/(this.maxY/5));
  //scanbinary is a reference number (zero lag binary).if reached MSB, reset to zero, else shift by one bit
  this.scanBinary=1>>this.scanBinary==0?0:1<<( this.shiftCount);
  //accumulator, used for scanBinary (see comment at 91); 
  this.shiftCount=1^this.shiftCount;
  //concatenate and display resulting string
  this.result=this.line4.draw()+this.line3.draw()+this.line2.draw()+this.line1.draw()+this.line0.draw();
  this.result+=this.input+" "+this.label+ " DC: "+this.game.renderer.renderSession.drawCount;
  this.node.textContent=this.result;
};