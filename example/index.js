var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.baseURL = '//examples.phaser.io/';
  game.load.crossOrigin = 'anonymous';
  game.load.image('boxes', 'assets/sprites/block.png');
  game.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() {
  pocketdebug = game.plugins.add(Phaser.Plugin.PocketDebug);
  pocketdebug.add(10,0,0.8,200,61,"FPS");
  pocketdebug.add(10,150,1,100,100,"MS");  

  game.time.events.loop(200,addSprite,this);

  dudes=game.add.group();
}

function update() {
  //dudes.forEach(function(dude){dude.rotation+=0.08});
}

function render() {
}

function addSprite(){
  if(game.time.fps>40){
    child=game.add.sprite(game.width*Math.random(),game.height*Math.random(),'dude');
    game.physics.arcade.enable(child);
   // dudes.add(child);
  }else{
    dudes.forEach(function(dude){dude.destroy()});
  }

}
