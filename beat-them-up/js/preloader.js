/* global BeatThemUp */

BeatThemUp.preloader = function (game) {
  this.background = null
  this.preloadBar = null

  this.ready = false
}

BeatThemUp.preloader.prototype =
{
  preload: function () {
    // Create a loading bar
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar')
    // Make it centered exactly
    this.preloadBar.anchor.set(0.5, 0.5)
    // Load the rest of the assets that we require for the game
    // Hero spritesheet
    this.load.spritesheet('Hero', 'img/hero/hero-walking-sheet.png', 180, 325)

    // backgrounds
    this.load.image('bg_desert', 'img/background/colored_desert.png')
    this.load.image('bg_grass', 'img/background/colored_grass.png')
    this.load.image('bg_land', 'img/background/colored_land.png')

    // Pickups
    this.load.image('coin_diamond', 'img/items/coinDiamond.png')
    this.load.image('coin_gold', 'img/items/coinGold.png')
    this.load.image('coin_silver', 'img/items/coinSilver.png')
    this.load.image('star_diamond', 'img/items/starDiamond.png')
    this.load.image('star_gold', 'img/items/starGold.png')
    this.load.image('star_silver', 'img/items/starSilver.png')

    // Platforms
    this.load.image('plat_dirt', 'img/platforms/dirt.png')
    this.load.image('plat_grass', 'img/platforms/grass.png')
    this.load.image('plat_sand', 'img/platforms/sand.png')
  },

  create: function () {
    // Load the main game
    this.state.start('level-01')
  }
}
