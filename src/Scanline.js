//a scanline is a 32 bit binary:  00000000000000000000000000000000
var Scanline=function(gr,linenumber){
  this.gr=gr,this.linenumber=linenumber,this.binary=0;
  return  this;      
} 
//draw the scanLine  --> _________________________*______ 
Scanline.prototype.draw=function(){
  //if reached MSB then reset scanline, else, if this fps is at my level, draw at my scanline, else silence me
  this.binary=1>> this.gr.scanBinary==0?0:(this.gr.rownumber== this.linenumber?(this.gr.scanBinary^this.binary):(this.binary&~this.gr.scanBinary));
  //this.binary=this.gr.scanBinary;//for debugging , displays default scanBinary
  //binary formatting and string building
  this.n=this.binary.toString(2); 
  this.n=(this.gr.zeros.substr( this.n.length)+ this.n).replace(/0/g, "_").replace(/1/g, '*');
  return this.n+'\n';
}