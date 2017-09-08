
var PocketDebug =this.Phaser.Plugin.PocketDebug = function (game, parent,x,y,scale)
{
    Phaser.Plugin.call(this, game, parent);
    this.name="Phaser Pocket Debug Plugin";
    this.panels=[];
    this.parameters={FPS:this.game.time.fps,MS:this.game.time.elapsedMS};
    this.components={state:0,stage: 0,plugins: 0,tweens: 0,sound: 0,input: 0,physics: 0,particles: 0,};
    this.timer = (window.performance ? window.performance : Date);

    this.fastHexToRGB=function(hex,alpha){
        return 'rgba('+(hex>>16)+","+((hex>>8)&(0x0000ff))+","+(hex&0x0000ff)+","+alpha+")";
    };
};

Phaser.Plugin.PocketDebug.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.PocketDebug.prototype.constructor = Phaser.Plugin.PocketDebug;

PocketDebug.prototype.init = function(x,y,scale,advanced,bits) 
{  
    this.x=x||0;this.y =y||0;this.scale=scale||1;this.advanced=advanced||false;
    this.game.time.advancedTiming = true;
    this.addPanel(this.x,0+this.y,this.scale,this.parameters,this);  
    this.panels[0].addGraph(60,10,bits,"FPS");
    this.panels[0].addGraph(20,10,bits,"MS");
    if(this.advanced){
        this.addPanel(this.x,100+this.y,this.scale,this.components,this);      
        for (var component in this.components) 
        {
            this.wrap(this.game, component, "update", component);
            this.panels[1].addGraph(1000,10,bits,component);  
        }
    }
};

PocketDebug.prototype.addPanel = function(x,y,scale,maxY,components,dbg)
{
    this.panel=new Panel(x,y,scale,maxY,components,dbg);
    this.panels.push(this.panel);  
};

PocketDebug.prototype.update=function()
{
    this.parameters.FPS=this.game.time.fps;
    this.parameters.MS=this.game.time.elapsedMS;
    this.panels[0].update();
    if(this.advanced){
        this.panels[1].update();
    }
};

PocketDebug.prototype.destroy = function()
{
    this.panels[0].destroy();
    this.panels[1].destroy();
    this.panels=null;      
    Phaser.Plugin.prototype.destroy.apply(this,arguments);        
};

PocketDebug.prototype.wrap = function (obj, component, method, timingStat) 
{
    obj[component][method] = (function(self, name, method, stat, fn)
    {    
        var t0, t1=0;
        return function () 
        {
        t0 = self.timer.now();
        fn.apply(this, arguments);
        t1 = self.timer.now();
        self.components[stat] = (t1 - t0).toFixed(2);//edit this for multi
        }
    })(this, component, method, timingStat, obj[component][method]);
};

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

Panel.prototype.addUI=function(x,y,width,scale,bgcolor,button,label,context,event,parameters)
{
    this.element=document.createElement("pre");
    this.element.setAttribute("style","position: absolute;left:"+(x+10)+"px;top:"+y+"px;width:"+(width*scale)+"px;text-align:center;color:white;font-weight:bold;font-size:"+11*scale+"px");
    this.game.canvas.parentNode.appendChild(this.element); 
    this.element.style["background-color"]=button?this.dbg.fastHexToRGB(bgcolor,0.3):this.dbg.fastHexToRGB(bgcolor,0.6); 
    this.element.textContent=button?label:0;
    this.element.onclick=event.bind(context,parameters);   
    this.nodes.push(this.element);   
    return this.element;
};
Panel.prototype.changeColor=function()
{
    this.mask=((this.mask<<1)&~0xff000000)||16;  
    this.bgc^=this.mask;
    this.txtc=~this.txtc;
    this.content.style["background-color"]=this.dbg.fastHexToRGB(this.bgc,0.6);
    this.content.style.color=this.dbg.fastHexToRGB(this.txtc,1);
};
Panel.prototype.toggle=function()
{  
    this.current.hide= this.content.hidden=!this.current.hide;
};

Panel.prototype.resize=function(direction)
{
    this.current.maxY=direction==1?(this.current.maxY*2):(this.current.maxY/2);
};

Panel.prototype.change=function()
{ 
    this.current.hide=true;
    this.index=(this.index+1)%(this.graphs.length);
    this.current=this.graphs[this.index];
    this.current.hide=false;
};

Panel.prototype.speed=function()
{
    this.current.refreshRate=Math.abs(((this.current.refreshRate-1)%this.current.initialRate))||this.current.initialRate;
    this.setspeed.style["background-color"]=this.dbg.fastHexToRGB(0xff0000*this.current.refreshRate|0xff0000,0.3+0.05*(10-this.current.refreshRate));
};

var Graph = function (game,maxY,refreshRate,bits,label)
{
    this.game=game;this.refreshRate=this.initialRate=refreshRate;this.maxY=maxY;this.label=label;this.bits=bits;this.hide=false;
    this.scanBinary=this.startBinary=0x010000000;this.zeros= Array(30).join("0"); this.counter=0;
    this.line0=new Scanline(this,0);this.line1=new Scanline(this,1);
    this.line2=new Scanline(this,2);this.line3=new Scanline(this,3);
    this.line4=new Scanline(this,4);
    return this;
}

Graph.prototype.update =function(input)
{  
    this.counter=(this.counter+1)%this.refreshRate;
    if(!this.hide&&this.counter==0)
    {
        this.input=input<1?input*1000:input;
        this.rownumber=~~((this.input-1)/(this.maxY/5));
        this.scanBinary=((this.scanBinary>>1))||this.startBinary;
        this.result=this.line4.draw()+this.maxY+'\n'+this.line3.draw()+'\n'+this.line2.draw()+'\n'+this.line1.draw()+'\n'+this.line0.draw()+'\n';
        this.result+=this.input+" "+this.label+" DC:"+this.game.renderer.renderSession.drawCount;
    }
    return this.result;
};

var Scanline=function(gr,linenumber)
{
    this.gr=gr;this.linenumber=linenumber;this.binary=0;
    return  this;      
};

Scanline.prototype.draw=function()
{
    this.binary=this.gr.scanBinary==1?0:(this.gr.rownumber== this.linenumber?(this.gr.scanBinary^this.binary):(this.binary&~this.gr.scanBinary));//this.binary=this.gr.scanBinary; 
    this.n=this.binary.toString(2);
    this.n=this.gr.bits?(this.gr.zeros.substr( this.n.length)+ this.n):(this.gr.zeros.substr( this.n.length)+ this.n).replace(/0/g, "_").replace(/1/g, '*');
    return this.n;
};