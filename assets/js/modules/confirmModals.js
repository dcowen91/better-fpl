const $ = require('jquery')
const settings = require('../core/settings.js')

const transferModal = {
  cache: function() {
    this.listElements = $('tr.ism-row-select')
    this.modal = $('#ismr-elements-menu')
    this.listViews = $('#ismr-elements-list')
  },

  bind: function() {
    this.listElements.on('click', this.doListElementAction.bind(this))
  },

  // Apply a mutation observer on the list views
  watchListViews: function() {
    let observer = new MutationObserver((mutations) => {

      // When we add fixtures the number of mutations equal the number of list players
      // so when they don't match, then we need to recache the players and add fixtures again
      if (mutations[0].addedNodes[0].className !== 'fixtures-container') {
        this.cache()
        this.bind()
      }

    })

    this.listViews.each((i, view) => observer.observe(view, { subtree: true, childList: true }))
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
    this.watchListViews()
  }
}

$(document).on('fplReady', () => transferModal.init())