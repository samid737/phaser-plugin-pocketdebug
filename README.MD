Pocket sized debug module for Phaser. Displays FPS graph, WEBGL drawcalls in any DOM (text) element. [Demo](https://samid737.github.io/phaser-plugin-pocketdebug/)

# Description

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

pocketdebug =game.plugins.add(Phaser.Plugin.PocketDebug,x,y,scale,advanced,bitmode);

//arguments : 
//  x,y             : position of panels relative to top-left corner of game
//  scale           : font-size and width of panel element multiplied by this scalevalue(default 1)
//  advanced        : adds an extra panel to measure state,stage,plugins,tweens,sound,input,physics,particles update time (in microseconds. 1 us=0.001ms).
//  bitmode         : do not reformat scanline, will output 0's and 1's, for retro feel and less overhead.

```
* UI:

* --    :   hide/show graphs.
* \+     :   zoom in Y range.
* \-     :   zoom out & range.
* \->    :   cycle trough graphs.
* \>>    :   increase refresh rate, resets after 10 clicks.

* click on A graph to change the color for better color contrast.

# Dev notes

the src folder contains a commented version. Ideas, contributions, optimizations, suggestions are very welcome. 
All changes are found in the [Changelog](https://github.com/samid737/phaser-plugin-pocketdebug/blob/master/CHANGELOG.md);
The source code for the wrapper function is from phaser-debug by englercj : https://github.com/englercj/phaser-debug.

