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
//  maxY (in dev)   : the highest value of your input variable
//  refreshRate     : draw graph every refreshRate ms
//  bits            : retro mode, do not reformat 0's and 1's
//  label (in dev)  : the label of your input variable

var Graph = function (game,maxY,refreshRate,bits,label,content)
{
    this.game=game;this.refreshRate=this.initialRate=refreshRate;this.maxY=maxY;this.label=label;this.bits=bits;this.hide=false;this.content=content;
    //explained in Graph.draw(), the zeros are used to pad the final string result.
    this.scanBinary=this.startBinary=0x010000000;this.zeros= Array(30).join("0"); this.counter=0;
    // add the scanlines      
    this.line0=new Scanline(this,0);this.line1=new Scanline(this,1);
    this.line2=new Scanline(this,2);this.line3=new Scanline(this,3);
    this.line4=new Scanline(this,4);
    return this;
}

//graph drawing, if not hidden, concatenate output of Scanline.draw(), then returns the string

Graph.prototype.update =function(input)
{  
    //clock
    this.counter=(this.counter+1)%this.refreshRate;
    if(!this.hide&&this.counter==0)
    {
        //determine which scanline to draw on.
        this.input=input<1?input*1000:input;
        this.rownumber=~~((this.input-1)/(this.maxY/5));
        //scanbinary is a reference used for masking.if reached MSB, start over, else shift by one bit
        this.scanBinary=((this.scanBinary>>1))||this.startBinary;
        //concatenate and display resulting string
        this.result=this.line4.draw()+this.maxY+'\n'+this.line3.draw()+'\n'+this.line2.draw()+'\n'+this.line1.draw()+'\n'+this.line0.draw()+'\n';
        this.result+=this.input+" "+this.label+" DC:"+this.game.renderer.renderSession.drawCount;
        this.content.textContent=this.result;
    }
};

