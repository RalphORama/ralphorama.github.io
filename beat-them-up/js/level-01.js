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

  // hero specific variables
  this.jumping
  this.jumpingTempY
  this.minY
}

BeatThemUp.game.prototype =
{
  create: function () {
    // REV UP THAT PHYSICS ENGINE
    this.physics.startSystem(Phaser.Physics.ARCADE)

    // Add the background sprite for the game
    this.bg = this.add.tileSprite(0, 0, 1920, 800, 'bg_grass')
    this.bg.anchor.setTo(0, 0)

    // Set the world bounds
    this.world.setBounds(0, 0, 1920, 800)

    // Set up the world!
    // createPlatforms(this)

    // Initialize keys for keyboard input
    this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.keyDn = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.keyJump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    // Create the main character
    createHero(this)

    // make the camera follow the hero
    this.camera.follow(this.hero)
  },

  update: function () {
    // Make our hero collide with our platforms
    this.physics.arcade.collide(this.hero, this.platforms)

    // Movement stuff
    // Reset hero's velocity
    this.hero.body.velocity.x = 0

    // Handle keyboard input
    if (this.keyRight.isDown) {
      this.hero.body.velocity.x = 150
      // Set the hero to face right
      this.hero.scale.x = Math.abs(this.hero.scale.x)
      this.hero.animations.play('walk', 10, true)
    } else if (this.keyLeft.isDown) {
      this.hero.body.velocity.x = -150
      // Set the hero to face left
      this.hero.scale.x = -1 * Math.abs(this.hero.scale.x)
      this.hero.animations.play('walk', 10, true)
    } else {
      this.hero.animations.stop()
      this.hero.frame = 0
    }

    // Handle vertical movement for the hero
    // First make sure we're not jumping and we're within the movable range
    if (this.jumping === false) {
      // If the 'up' key is pressed
      if (this.keyUp.isDown === true && this.hero.y > this.minY) {
        this.hero.body.velocity.y = -100
      } else if (this.keyDn.isDown === true) {
        this.hero.body.velocity.y = 100
      } else {
        this.hero.body.velocity.y = 0
      }
    }

    // If we're not jumping and the user wants to jump, start jumping
    if (this.keyJump.isDown && this.jumping === false) {
      this.jumping = true
      this.jumpingTempY = this.hero.y
      startJumping(this.hero)
    }
    // if we're jumping and the hero should come to rest, stop jumping
    if (this.jumping === true) {
      if (this.hero.y >= this.jumpingTempY) {
        this.jumping = false
        stopJumping(this.hero)
        this.hero.y = this.jumpingTempY
        console.log('Y: ' + this.hero.y)
      }
    }
  }
}
/*
function createPlatforms (thisGame) {
  thisGame.platforms = thisGame.add.group()
  thisGame.platforms.enableBody = true

  for (var i = 0; i < thisGame.game.width / 70; i++) {
    var ground = thisGame.platforms.create(i * 70, thisGame.world.height - 32, 'plat_grass')
    ground.body.immovable = true
  }
}
*/

function createHero (thisGame) {
  // Create the hero!
  thisGame.hero = thisGame.add.sprite(0, 800, 'Hero')
    // Set his anchor to the middle
  thisGame.hero.anchor.x = 0.5
  // scale the hero
  thisGame.hero.scale.setTo(0.35)

  // Add animation set
  thisGame.hero.animations.add('walk')

  // Physics logic
  // Enable Physics for the hero
  thisGame.physics.arcade.enable(thisGame.hero)
  // Set up some gravity - we won't use this for now
  // thisGame.hero.body.gravity.y = 300
  // so he can't escape
  thisGame.hero.body.collideWorldBounds = true

  // Set up hero vars
  // He's not jumping
  thisGame.jumping = false
  // Set the temp y
  thisGame.jumpingTempY = thisGame.hero.y

  // Set up how far the hero can travel up the screen
  thisGame.minY = 600
}

function startJumping (hero) {
  hero.body.velocity.y = -500
  hero.body.gravity.y = 1000
  hero.y -= 1
}

function stopJumping (hero) {
  hero.body.velocity.y = 0
  hero.body.gravity.y = 0
}
