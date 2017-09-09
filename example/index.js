var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.baseURL = '//examples.phaser.io/';
  game.load.crossOrigin = 'anonymous';
  game.load.image('boxes', 'assets/sprites/block.png');
  game.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() {

 pocketdebug = game.plugins.add(Phaser.Plugin.PocketDebug,0,0,1,true);

}

function update() {

}

function render() {
}

function addSprite(){
 
}
