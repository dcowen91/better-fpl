const $ = require('jquery')
const players = require('../core/players.js')
const settings = require('../core/settings.js')

const playerHighlights = {

  // Cache variables
  cache: function () {
    this.listViews = $('#ismr-elements-list')
    this.listPlayers = this.listViews.find('.ism-row-select')
  },

  // Listen for changes to user settings
  listenOnSettings: function() {
    settings.watch('transferHighlight', (newValue) => newValue === true ? this.render() : this.destroy())
  },

  // Add fixtures to a player in list view
  addHighlighttoListRow: function(elem) {
    if (!settings.get('transferHighlight'))
      return

    elem = $(elem)
    let code = elem.attr('data-code')

    if (code === undefined)
      code = elem.find('[data-code]').attr('data-code')

    if (elem.hasClass("ism-element-list__in-squad")) {
      elem.css('background-color', 'lightcoral')
      let appendTarget = elem.find('.ism-table--el__strong')
      appendTarget = $(appendTarget)
      appendTarget.css('color', '#242424')
      
      appendTarget = elem.find('.ism-table--el__name')
      appendTarget = $(appendTarget)
      appendTarget.css('color', '#242424')
    }
    else if (this.players.includes(parseInt(code))) {
      elem.css('background-color', 'lightblue')
    }
    else {
      // Needed for when elements are removed from watchlist
      elem.css('background-color', 'white')
    }
  },

  // Apply a mutation observer on the list views
  watchListViews: function() {
    let observer = new MutationObserver((mutations) => {
      // When we add highlights the number of mutations equal the number of list players
      // so when they don't match, then we need to recache the players and add highlights again
      if (mutations.length !== this.listPlayers.length) {
        this.listPlayers = this.listViews.find('.ism-row-select')
        this.listPlayers.each((i, elem) => this.addHighlighttoListRow(elem))
        players.getWatchlistPlayers()
          .then((players) => {
            this.players = players
            this.render()
          })
      }

    })

    this.listViews.each((i, view) => observer.observe(view, { subtree: true, childList: true }))
  },

  // Render everything
  render: function() {
    this.listPlayers.each((i, elem) => this.addHighlighttoListRow(elem))
  },

  // Remove the added DOM elements
  destroy: function() {
    this.listPlayers.each((i, elem) => $(elem).css('background-color', 'white'))
  },

  // Initialize module
  init: function() {

    // Start of with caching our variables and watching for changes 
    // in both the DOM and the user settings
    this.cache()
    this.listenOnSettings()
    this.watchListViews()

    // Get the players from the core module and begin rendering
    players.getWatchlistPlayers()
      .then((players) => {
        this.players = players
        this.render()
      })
  }
}

$(document).on('fplReady', () => playerHighlights.init())