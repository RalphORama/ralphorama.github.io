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
  this.heroSpeed
  this.jumping
  this.jumpingTempY
  this.minY
}

BeatThemUp.game.prototype =
{
  create: function () {
    // REV UP THAT PHYSICS ENGINE
    this.physics.startSystem(Phaser.Physics.NINJA)

    // Add the background sprite for the game
    this.bg = this.add.sprite(0, 0, 'bg_iso_01')

    // Set the world bounds
    this.world.setBounds(0, 0, 3200, 600)

    // Set up the world!
    // createPlatforms(this)
    createWorldGeometry(this)

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
    this.physics.arcade.collide(this.hero, this.worldGeometry)

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
        this.hero.body.velocity.y = -1 * Math.abs(this.heroSpeed)
      } else if (this.keyDn.isDown === true) {
        this.hero.body.velocity.y = Math.abs(this.heroSpeed)
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
    if (this.hero.y > this.jumpingTempY && this.jumping === true) {
      // So this can't happen twice
      this.jumping = false

      stopJumping(this.hero)

      // Set the hero back to where he used to be
      this.hero.y = Math.round(this.jumpingTempY - 9)
    }
  },

  render: function () {
    this.game.debug.spriteInfo(this.hero, 10, 20)

    // Show the collision bounds of our hero
    this.game.debug.body(this.hero)
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

function createWorldGeometry (thisGame) {
  thisGame.worldGeometry = thisGame.add.group()
  thisGame.worldGeometry.enableBody = true

  // create first blocking element
  var wall = thisGame.worldGeometry.create(30, 400, 'plat_grass')
  wall.body.immovable = true
}

function createHero (thisGame) {
  // Create the hero!
  thisGame.hero = thisGame.add.sprite(0, 800, 'Hero')
    // Set his anchor to the middle
  thisGame.hero.anchor.x = 0.5
  // scale the hero
  thisGame.hero.scale.setTo(0.4)

  thisGame.hero.position.setTo(145, 467)

  // Add animation set
  thisGame.hero.animations.add('walk')

  // Physics logic
  // Enable Physics for the hero
  thisGame.physics.arcade.enable(thisGame.hero)
  // Set up some gravity - we won't use this for now
  // thisGame.hero.body.gravity.y = 300
  // so he can't escape
  thisGame.hero.body.collideWorldBounds = true

  // let there be some overlap when the hero collides with something
  thisGame.hero.body.overlapY = -500

  // Set up hero vars
  // move speed
  thisGame.heroSpeed = 150
  // He's not jumping
  thisGame.jumping = false
  // Set the temp y
  thisGame.jumpingTempY = thisGame.hero.y

  // Set up how far the hero can travel up the screen
  thisGame.minY = 380
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
