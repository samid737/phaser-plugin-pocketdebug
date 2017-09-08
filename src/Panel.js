
//a Panel is where all graphs are drawn into, the txtc and bgc are used in changeColor() with this.mask as mask bits.

var Panel =function(x,y,scale,components,dbg)
{
	this.game=dbg.game; this.graphs=[]; this.dbg=dbg;this.components=components;this.hide=false;this.nodes=[];this.index=0;
	this.width=340*scale;this.txtc=0xffffff;this.bgc=0xff00ff;this.mask=0x000016;this.fontSize=14;
	this.content=this.addUI(x,y,260,scale,0xff00ff,false,"",this,this.changeColor); 
	this.toggler=this.addUI(x,y,25,scale,0xffff00,true,"--",this,this.toggle);
	this.plus=this.addUI(x,y+17,25,scale,0x00ff00,true,"+",this,this.resize,1); 
	this.minus=this.addUI(x,y+34,25,scale,0xff0000,true,"-",this,this.resize,-1); 
	this.next=this.addUI(x,y+51,25,scale,0x0000ff,true,"->",this,this.change,1);  
	this.setspeed=this.addUI(x,y+65,25,scale,0xff0000,true,">>",this,this.speed,1);  
	return this;
};

Panel.prototype.update=function()
{
    this.content.textContent=this.current.update(this.components[this.current.label]);
};

Panel.prototype.destroy=function()
{
    this.nodes.forEach(function(element){this.game.canvas.parentNode.removeChild(element);});
};

Panel.prototype.addGraph=function(maxY,refreshRate,bits,label)
{
    this.graph=new Graph(this.game,maxY,refreshRate,bits,label);
    this.graphs.push(this.graph);   
    this.current=this.graphs[0];
};

//add UI elements, if not a button don't label it. Bind click events to this panel.

Panel.prototype.addUI=function(x,y,width,scale,bgcolor,button,label,context,event,parameters)
{
    this.element=document.createElement("pre"); 
    this.element.setAttribute("style","position: absolute;left:"+(x+10)+"px;top:"+y+"px;width:"+(width*scale)+"px;text-align:center;color:white;font-weight:bold;font-size:"+11*scale+"px");
    this.game.canvas.parentNode.appendChild(this.element); 
    this.element.style["background-color"]=UI?this.dbg.fastHexToRGB(bgcolor,0.3):this.dbg.fastHexToRGB(bgcolor,0.6); 
    this.element.textContent=button?label:0;
    this.element.onclick=event.bind(context,parameters);   
    this.nodes.push(this.element);   
    return this.element;
};

//Hue shift
Panel.prototype.changeColor=function()
{
    //shift left while not 180 degree hueshift
    this.mask=((this.mask<<1)&~0xff000000)||16;  
    //bitmasking
    this.bgc^=this.mask;
    this.txtc=~this.txtc;
    //console.log((("000000").substr( this.mask.toString(16).length)+ this.mask.toString(16)));//for debugging
    this.content.style["background-color"]=this.dbg.fastHexToRGB(this.bgc,0.6);
    this.content.style.color=this.dbg.fastHexToRGB(this.txtc,1);
};

//used to hide the graphs
Panel.prototype.toggle=function()
{  
    this.current.hide= this.content.hidden=!this.current.hide;
};

//resize the Y range of the graph (resize element in dev)

Panel.prototype.resize=function(direction)
{
    this.current.maxY=direction==1?(this.current.maxY*2):(this.current.maxY/2);
    //this.width+=40*direction;
    //this.fontSize+=direction;
    //this.content.style["width"]=this.width;
    //this.content.style["fontSize"]=this.fontSize;    
};

//switch graphs, current is the currently displayed graph

Panel.prototype.change=function()
{ 
    this.current.hide=true;
    this.index=(this.index+1)%(this.graphs.length);
    this.current=this.graphs[this.index];
    this.current.hide=false;
    //this.graphs.forEach(function(graph){console.log(graph.hide + " "+graph.label)});
};

//speed up the graph, increase redness proportionally to refreshRate

Panel.prototype.speed=function()
{
    this.current.refreshRate=Math.abs(((this.current.refreshRate-1)%this.current.initialRate))||this.current.initialRate;
    this.setspeed.style["background-color"]=this.dbg.fastHexToRGB(0xff0000*this.current.refreshRate|0xff0000,0.3+0.05*(10-this.current.refreshRate));
};