Pocket sized debug module for Phaser. Displays FPS graph, WEBGL drawcalls in any DOM (text) element. [Demo](https://samid737.github.io/phaser-plugin-pocketdebug/)

# Description

A quick and convenient way to display basic performance info.
Displays FPS, MS graphs and drawcalls (WEBGL) in HTML DOM elements. Based upon 
[pocketplot](https://github.com/samid737/pocketplot), a simple plotting program.

A graph is text only and consists of scanlines:

```javascript
   _________*_*_____________*____ scanLine 0 (32 bit number)
   _______*_____*_________*______ scanLine 1
   _____*_________*__*_*_________ etc....
   _*_*__________________________ ....
   ______________________________ ..
```

# Requirements:

* Phaser v2 (tested in 2.6.2 and 2.8.4)
* Phaser.WEBGL mode for draw counts

# Usage

```javascript
pocketdebug =game.plugins.add(Phaser.Plugin.PocketDebug);
pocketdebug.add(10,0,1,200,61,"FPS");
//pocketdebug.add(10,150,1,200,100,"MS"); optional

//arguments : x,y,scale,refreshRate,maxY,label
//  x,y             : position of graph relative to top-left corner of game
//  scale           : font-size and width of <pre> element multiplied by this scalevalue(default 1)
//  refreshRate     : draw graph every refreshRate ms
//  maxY (in dev)   : the highest value of your input variable
//  label (in dev)  : the label of your input (currently only "FPS" or "MS")
//  bitMode         : do not reformat scanline, will output 0's and 1's.

```

# Dev notes

the src folder contains a commented version to explain the program. Ideas, contributions, optimizations, suggestions are much much appreciated.
All changes are found in the [Changelog](https://samid737.github.io/phaser-plugin-pocketdebug/CHANGELOG.md/);