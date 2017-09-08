var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.baseURL = '//examples.phaser.io/';
  game.load.crossOrigin = 'anonymous';
  game.load.image('boxes', 'assets/sprites/block.png');
  game.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() {
  counter=0;
  threshold=200;
  pocketdebug = game.plugins.add(Phaser.Plugin.PocketDebug,0,0,1,true);
  dudes=game.add.group();
  dudes.spawnrate=200;

        //gui instance
}

function update() {
  counter++;
  if(counter>dudes.spawnrate){

    counter=0;
    for(i=0;i<400/(dudes.spawnrate+1);i++){
      addSprite();      
    }
  }

  if(game.time.fps<10){
    dudes.forEach(function(dude){dude.destroy()});
  }
  dudes.forEach(function(dude){dude.body.velocity.x+=0.08});
  dudes.forEach(function(dude){dude.body.angularVelocity+=0.08});
  
  game.physics.arcade.collide(dudes,dudes);
}

function render() {
}

function addSprite(){
    child=game.add.sprite(game.width*Math.random(),game.height*Math.random(),'dude');
    game.physics.arcade.enable(child);
    child.body.velocity.x=Math.random()*1000;
    child.body.velocity.y=Math.random()*1000;
    child.body.collideWorldBounds=true;
    child.body.bounce.setTo(1);
    game.add.tween(child).to({x:500,y:400},1000,"Linear",true);
    dudes.add(child);
}
