const $ = require('jquery')
const settings = require('../core/settings.js')

const playerDialogs = {

  cache: function() {
    this.buttons = $('.ism-element__link')
    this.body = $('body')
  },

  // Listen for changes to user settings
  listenOnSettings: function() {
    settings.watch('disableModalHorizontalScroll', (newValue) => newValue === true ? this.addClass() : this.removeClass())
  },

  addClass: function() {
    if (settings.get('disableModalHorizontalScroll') === true)
      this.body.addClass('dialog-max-width')
  },

  removeClass: function() {
    if (settings.get('disableModalHorizontalScroll') === false)
      this.body.removeClass('dialog-max-width')
  },

  init: function() {
    this.cache()
    this.listenOnSettings()

    if (settings.get('disableModalHorizontalScroll') === true)
      this.addClass()
    else
      this.removeClass()
  }

}

$(document).on('fplReady', () => playerDialogs.init())