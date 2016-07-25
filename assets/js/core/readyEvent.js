const $ = require('jquery')

const fplReadyEvent = {
  event: new Event('fplReady'),
  emitted: false,
  observerConfig: {
    attributes: true,
    attributeOldValue: true
  },

  observer: function() {
    let self = this

    let observer = new MutationObserver(function(mutations) {
      // Some pages have the data preloaded so the mutation happens twice
      // We emit the event because the page is ready then
      if (mutations.length === 2 && self.emitted === false)
        return self.emit()

      if (mutations.length === 1 && self.overlay.is(':hidden') && self.emitted === false)
        return self.emit()
    })

    observer.observe(this.overlay[0], this.observerConfig)
  },

  cache: function() {
    this.overlay = $('.ism-loading--app.ismjs-loading')
  },

  bindLinks: function() {
    // Links that point to a state in the app
    this.links = $('a').filter((i, link) => $(link).attr('href').indexOf('/a/') > -1)
    this.links.on('click', () => { this.emitted = false })

    // Buttons that redirect to a different view
    // !! NOT WORKING !! AARGH!!!
    this.buttons = $('.ism-save-bar__button, .ismjs-confirm')
    this.buttons.on('click', () => { this.emitted = false; console.log(this.emitted) })
  },

  // If no mutation is detected then emit the event after
  // one second if the overlay is hidden or keep trying
  fallBack: function() {
    let interval = setInterval(() => {
      if (this.overlay.is(':hidden') && this.emitted === false)
        this.emit()
    }, 1000)

    $(document).on('fplReady', () => clearInterval(interval))
  },

  emit: function() {
    document.dispatchEvent(this.event)
    this.emitted = true
  },

  init: function() {
    this.cache()

    if (this.overlay.length === 0)
      return

    // jQquery returns an array but the observer wont take that
    // so we need to specify to only get the first object
    this.observer()
    this.fallBack()
    
    $(document).on('fplReady', () => this.bindLinks())
  }
}

$(document).ready(() => fplReadyEvent.init())