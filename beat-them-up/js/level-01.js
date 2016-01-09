/*
global BeatThemUp
global Phaser
*/

BeatThemUp.game = function (game) {
  /* We declare global variables in this section */
  // Sprite variables
  this.bg
  this.hero

  // Keys for input
  this.keyLeft
  this.keyRight
  this.keyUp
  this.keyDn
  this.keyJump

  // Platform groups
  this.platforms
}

BeatThemUp.game.prototype =
{
  create: function () {
    // REV UP THAT PHYSICS ENGINE
    this.physics.startSystem(Phaser.Physics.ARCADE)

    // Add the background sprite for the game
    this.bg = this.add.sprite(0, this.game.height + 150, 'bg_grass')
    this.bg.anchor.setTo(0, 1)
    this.bg.scale.setTo(0.8)

    // Set up the world!
    createPlatforms(this)

    // Initialize keys for keyboard input
    this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.keyDn = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.keyJump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    // Create the main character
    createHero(this)
  },

  update: function () {
    this.physics.arcade.collide(this.hero, this.platforms)
  }
}

function createPlatforms (thisGame) {
  thisGame.platforms = thisGame.add.group()
  thisGame.platforms.enableBody = true

  for (var i = 0; i < thisGame.game.width / 70; i++) {
    var ground = thisGame.platforms.create(i * 70, thisGame.world.height - 32, 'plat_grass')
    ground.body.immovable = true
  }
}

function createHero (thisGame) {
  // Create the hero!
  thisGame.hero = thisGame.add.sprite(80, 400, 'Hero')
    // Set his anchor to the middle
  thisGame.hero.anchor.x = 0.5
  // scale the hero
  thisGame.hero.scale.setTo(0.5)

  // Physics logic
  // Enable Physics for the hero
  thisGame.physics.arcade.enable(thisGame.hero)
  // Set up some gravity
  thisGame.hero.body.gravity.y = 300
  // so he can't escape
  thisGame.hero.collideWorldBounds = true
}
