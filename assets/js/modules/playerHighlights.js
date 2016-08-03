const $ = require('jquery')
const players = require('../core/players.js')
const settings = require('../core/settings.js')

const playerHighlights = {
  
  // Variables
  transferHightlightWatch: settings.get('transferHightlightWatch') || true,
  transferHightlightPlayer: settings.get('transferHightlightPlayer') || true,
  
  // Cache variables
  cache: function() {
    this.listViews = $('#ismr-elements-list')
    this.listPlayers = this.listViews.find('.ism-row-select')
  },
  
  // Listen for changes to user settings
  listenOnSettings: function() {
    settings.watch('transferHightlightWatch', (newValue) => newValue === true ? this.render() : this.destroy())
    settings.watch('transferHightlightPlayer', (newValue) => newValue === true ? this.render() : this.destroy())
  },
  
 // Add fixtures to a player in list view
  addHighlighttoListRow: function(elem) {
    elem = $(elem)
    if (!!settings.get('transferHightlightPlayer')) {
      elem.css('background-color', 'lightblue')
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
    players.get()
      .then((players) => {
        this.players = players
        this.render()
      })

  }
    
}


$(document).on('fplReady', () => playerHighlights.init())