var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.baseURL = '//examples.phaser.io/';
  game.load.crossOrigin = 'anonymous';
  game.load.image('boxes', 'assets/sprites/block.png');
  game.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() {
  pocketdebug = game.plugins.add(Phaser.Plugin.PocketDebug);
  pocketdebug.add(10,0,1,200,61,"FPS");
  pocketdebug.add(10,150,1,100,100,"MS");  

  game.time.events.loop(50,addSprite,this);

  dudes=game.add.group();
}

function update() {
  dudes.forEach(function(dude){dude.rotation+=0.02});
}

function render() {
}

function addSprite(){
  child=game.add.sprite(game.width*Math.random(),game.height*Math.random(),'dude');
  dudes.add(child);
}
