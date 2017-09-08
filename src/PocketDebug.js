//Phaser Pocket Debug Plugin by samid737
//Pocket sized debug graph fit into a DOM text element.
//Displays FPS and MS graphs using strings.
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
    //wrap update functions
    if(this.advanced){
        this.addPanel(this.x,100+this.y,this.scale,this.components,this);      
        for (var component in this.components) 
        {
            this.wrap(this.game, component, "update", component);
            this.panels[1].addGraph(1000,10,bits,component);  
        }
    }
};

//add a graph to the DOM and update this graph using timer events
//two DOM elements are added, one contained with the actual graph, and another is a mask on top of the graph to cancel out zeros.

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

//timing wrapper, source from phaser-debug by englercj : https://github.com/englercj/phaser-debug

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

