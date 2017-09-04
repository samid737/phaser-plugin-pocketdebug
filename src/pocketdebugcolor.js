//Phaser Pocket Debug Plugin by samid737
//Pocket sized debug module that displays debug info in a DOM text element.
//Displays FPS and MS graph using bitwise and logical operators.
//https://github.com/samid737/phaser-pocket-debug

var PocketDebug =this.Phaser.Plugin.PocketDebug = function (game, parent) {
  Phaser.Plugin.call(this, game, parent);
  this.name="Phaser Pocket Debug";
  this.graphs={};
}

Phaser.Plugin.PocketDebug.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.PocketDebug.prototype.constructor = Phaser.Plugin.PocketDebug;

PocketDebug.prototype.init = function() {
  this.game.time.advancedTiming = true;
};
//add a graph to the DOM and update this graph using timer events
PocketDebug.prototype.add = function(x,y,scale,refreshRate,maxY,label,input) {
  this.gr=new Graph(game,x,y,scale,refreshRate,maxY,label);
  this.gr.node=document.createElement("pre"); 
  this.gr.node.setAttribute("style", "background-color: rgba(0, 0, 0, 0.4); position: absolute;left:"+x+"px;top:"+y+"px;width:"+(32*10*this.gr.scale)+"px;text-align:justify;font-size:"+14*this.gr.scale+"px");
  this.game.canvas.parentNode.appendChild(this.gr.node); 
  this.game.time.events.loop(refreshRate, this.gr.draw,this.gr);
  this.graphs[this.gr.label]=this.gr;
  return this.gr;
};
//destroy me
PocketDebug.prototype.destroy = function() {
  for(var graph in this.graphs){
    this.game.canvas.parentNode.removeChild(this.graphs[graph].node);
    this.graphs[graph]=null;    
  }  
  Phaser.Plugin.prototype.destroy.apply(this,arguments);        
};
//a Graph is five scanlines concatenated to a single string
//
//   _________*_*_____________*____ scanLine 0 all 32 bit numbers
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
  //which input
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
  //RGB---> 0 -> red , 255-> green
  this.node.style.color ='rgba('+(255-this.coloring())+', '+this.coloring()+',0,1.0)';
};
//graph coloring. 
Graph.prototype.coloring = function() {
  return ~~((this.game.time.fps/61)*255);
};
//a scanline is a 32 bit integer:  00000000000000000000000000000000
var Scanline=function(gr,linenumber){
  this.gr=gr,this.linenumber=linenumber,this.binary=0;
  return  this;      
} 
//draw the scanLine  --> _________________________*______ 
Scanline.prototype.draw=function(){
  //if reached MSB then reset scanline, else, if this fps is at my level, draw at my scanline, else silence me
  this.binary=1>> this.gr.scanBinary==0?0:(this.gr.rownumber== this.linenumber?(this.gr.scanBinary^this.binary):(this.binary&~this.gr.scanBinary));//this.binary=this.gr.scanBinary;//for debugging   
  this.n=this.binary.toString(2); 
  this.n=(this.gr.zeros.substr( this.n.length)+ this.n).replace(/0/g, "_").replace(/1/g, '*');
  return this.n+'\n';
}
