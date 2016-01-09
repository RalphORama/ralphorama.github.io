var BeatThemUp = {}

BeatThemUp.boot = function (game) {
}

BeatThemUp.boot.prototype =
{
  init: function () {
    // disallow multi-touch
    this.input.maxPointers = 1

    // pause the game if our browser tab loses focus
    this.stage.disableVisibilityChange = true
  },

  preload: function () {
    // load assets required for the preloader
    this.load.image('preloadBar', 'img/preload/preloadBar.png')
  },

  create: function () {
    // change the background color to match the page color
    this.stage.backgroundColor = '#CCCCCC'
    // Start the preloader since we've already got everything we need set up
    this.state.start('preloader')
  }
}
