var PocketDebug =this.Phaser.Plugin.PocketDebug = function (game, parent) {
  Phaser.Plugin.call(this, game, parent);
  this.name="Phaser Pocket Debug Plugin";
  this.graphs={};
}

Phaser.Plugin.PocketDebug.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.PocketDebug.prototype.constructor = Phaser.Plugin.PocketDebug;

PocketDebug.prototype.init = function() {
  this.game.time.advancedTiming = true;
};

PocketDebug.prototype.add = function(x,y,scale,refreshRate,maxY,label,input) {
  this.gr=new Graph(game,x,y,scale,refreshRate,maxY,label);
  this.gr.node=document.createElement("pre"); 
  this.gr.node.setAttribute("style", "background-color: rgba(255, 40, 255, 0.6); position: absolute;left:"+x+"px;top:"+y+"px;width:"+(32*10*this.gr.scale)+"px;text-align:justify;color:white;font-weight:bold;font-size:"+14*this.gr.scale+"px");
  this.game.canvas.parentNode.appendChild( this.gr.node); 
  this.game.time.events.loop(refreshRate, this.gr.draw,this.gr);
  this.graphs[this.gr.label]=this.gr;
  return this.gr;
};

PocketDebug.prototype.destroy = function() {
  for(var graph in this.graphs){
    this.game.canvas.parentNode.removeChild(this.graphs[graph].node);
    this.graphs[graph]=null;    
  }  
  Phaser.Plugin.prototype.destroy.apply(this,arguments);        
};

var Graph = function (game,x,y,scale,refreshRate,maxY,label){
  this.game=game,this.scale=scale,this.label=label,this.maxY=maxY;
  this.scanBinary=this.shiftCount=0;this.zeros= Array(37).join("0");//       
  this.line0=new Scanline(this,0);this.line1=new Scanline(this,1);
  this.line2=new Scanline(this,2);this.line3=new Scanline(this,3);
  this.line4=new Scanline(this,4);
  return this;
}

Graph.prototype.draw =function(){
  this.input=this.label=="FPS"?this.game.time.fps:this.game.time.elapsedMS;
  this.rownumber=~~((this.input)/(this.maxY/5));
  this.scanBinary=1>>this.scanBinary==0?0:1<<( this.shiftCount);
  this.shiftCount=this.shiftCount-1;
  this.result=this.line4.draw()+this.line3.draw()+this.line2.draw()+this.line1.draw()+this.line0.draw();
  this.result+=this.input+" "+this.label+ " DC: "+this.game.renderer.renderSession.drawCount;
  this.node.textContent=this.result;
};

var Scanline=function(gr,linenumber){
  this.gr=gr,this.linenumber=linenumber,this.binary=0;
  return  this;      
} 

Scanline.prototype.draw=function(){
  this.binary=1>> this.gr.scanBinary==0?0:(this.gr.rownumber== this.linenumber?(this.gr.scanBinary^this.binary):(this.binary&~this.gr.scanBinary));//this.binary=this.gr.scanBinary; 
  this.n=this.binary.toString(2); 
  this.n=(this.gr.zeros.substr( this.n.length)+ this.n).replace(/0/g, "_").replace(/1/g, '*');
  return this.n+'\n';
}
