//Phaser Pocket Debug Plugin by samid737
//Pocket sized debug graph fit into a DOM text element.
//Displays FPS and MS graphs using strings.

var PocketDebug =this.Phaser.Plugin.PocketDebug = function (game, parent) 
{
  Phaser.Plugin.call(this, game, parent);
  this.name="Phaser Pocket Debug Plugin";
  this.graphs={};
}

Phaser.Plugin.PocketDebug.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.PocketDebug.prototype.constructor = Phaser.Plugin.PocketDebug;

PocketDebug.prototype.init = function() 
{
  this.game.time.advancedTiming = true;
};
//add a graph to the DOM and update this graph using timer events
//two DOM elements are added, one contained with the actual graph, and another is a mask on top of the graph to cancel out zeros.
PocketDebug.prototype.add = function(x,y,scale,refreshRate,maxY,label,input,bitMode)
{
  this.gr=new Graph(game,x,y,scale,refreshRate,maxY,label,bitMode);
  this.gr.node=document.createElement("pre"); 
  this.gr.node.setAttribute("style", "background-color: rgba(255, 40, 255, 0.6); position: absolute;left:"+x+"px;top:"+y+"px;width:"+(32*10*this.gr.scale)+"px;text-align:justify;color:white;font-weight:bold;font-size:"+14*this.gr.scale+"px");
  this.game.canvas.parentNode.appendChild( this.gr.node); 
  this.game.time.events.loop(refreshRate, this.gr.draw,this.gr);
  this.graphs[this.gr.label]=this.gr;
  return this.gr;
};
//destroy me
PocketDebug.prototype.destroy = function() 
{
  for(var graph in this.graphs){
    this.game.canvas.parentNode.removeChild(this.graphs[graph].node);
    this.graphs[graph]=null;    
  }  
  Phaser.Plugin.prototype.destroy.apply(this,arguments);        
};