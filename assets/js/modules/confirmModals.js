const $ = require('jquery')
const settings = require('../core/settings.js')

const transferModal = {
  cache: function() {
    this.listElements = $('tr.ism-row-select')
    this.modal = $('#ismr-elements-menu')
  },

  bind: function() {
    this.listElements.on('click', this.doListElementAction.bind(this))
  },

  updateButtons: function() {
    this.playerButtonAdd = this.modal.find('.ismjs-add')
    this.playerButtonInfo = this.modal.find('.ismjs-info')
  },

  doListElementAction: function() {
    if (settings.get('hideModals') === false)
      return

    this.modal.hide()

    // We have to make sure this function runs synchronously beacuse of react
    setTimeout(() => {
      this.updateButtons()

      if (this.playerButtonAdd.length === 0 || this.playerButtonAdd.is(':disabled'))
        this.playerButtonInfo.click()
      else
        this.playerButtonAdd.click()
    })
  },

  init: function() {
    this.cache()
    this.bind()
  }
}

$(document).on('fplReady', () => transferModal.init())