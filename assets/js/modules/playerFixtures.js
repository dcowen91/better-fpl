const $ = require('jquery')
const players = require('../core/players.js')
const settings = require('../core/settings.js')

const playerFixtures = {

  // Variables
  showFixtures: settings.get('showFixtures') || true,

  // Cache variables
  cache: function() {
    this.pitchViews = $('#ism-summary, #ismr-summary')
    this.listViews = $('#ismr-elements-list')
    this.pitchPlayers = this.pitchViews.find('.ism-element')
    this.listPlayers = this.listViews.find('.ism-row-select')
  },

  // Listen for changes to user settings
  listenOnSettings: function() {
    settings.watch('showFixtures', (newValue) => newValue === true ? this.render() : this.destroy())
  },

  // Add fixtures to all players in pitch views
  addFixturesToPitchPlayer: function(elem) {
    if (settings.get('showFixtures') === false)
      return
    
    elem = $(elem)

    let id = elem.attr('data-id')

    // If the id is undefined then the function is invoked by a mutation observer
    // In that case we just need to get it from the child with the data-id attribute
    if (id === undefined)
      id = elem.find('[data-id]').attr('data-id')

    let player = this.players.find((player) => player.id == id)
    let appendTarget = elem.find('.ism-element__controls')
    let fixturesContainer = $('<ul/>', {class: 'fixtures-container--field'})

    // Add the next five fixtures to the fixtures container
    for (var i = 0; i < 5; i++) {
      let fixture = player.fixtures[i]
      let fixtureElement = $('<li/>', {
        class: 'diff-' + fixture.difficulty,
        title: fixture.opponent_name + (fixture.is_home ? ' (H)' : ' (A)')
      })

      fixturesContainer.append(fixtureElement)
    }

    // Insert the fixtures container before the append target
    fixturesContainer.insertAfter(appendTarget)
  },

  // Add fixtures to a player in list view
  addFixturesToListPlayer: function(elem) {
    if (settings.get('showFixtures') === false)
      return

    elem = $(elem)

    let id = elem.find('.ism-table--el__primary').attr('data-id')
    let player = this.players.find((player) => player.id == id)
    let appendTarget = elem.find('.ism-table--el__primary-text .ism-table--el__strong')
    let fixturesContainer = $('<ul/>', {class: 'fixtures-container'})

    for (var i = 0; i < 5; i++) {
      let fixture = player.fixtures[i]
      let fixtureElement = $('<li/>', {
        class: 'diff-' + fixture.difficulty,
        title: fixture.opponent_name + (fixture.is_home ? ' (H)' : ' (A)')
      })

      fixturesContainer.append(fixtureElement)
    }

    fixturesContainer.insertAfter(appendTarget)
  },

  // Apply a mutation observer on the pitch views
  watchPitchViews: function() {
    let observer = new MutationObserver((mutations) => {

      // Pitch view is rerendered because of a substitution
      // We need to cache our elements again because they were removed
      if (mutations.length === 19) {
        this.pitchPlayers = this.pitchViews.find('.ism-element')
        return this.pitchPlayers.each((i, elem) => this.addFixturesToPitchPlayer(elem))
      }    

      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className !== 'fixtures-container--field')
          this.addFixturesToPitchPlayer(mutation.addedNodes[0])
      })

    })

    // Observe each pitch view
    this.pitchViews.each((i, view) => observer.observe(view, { subtree: true, childList: true }))
  },

  // Apply a mutation observer on the list views
  watchListViews: function() {
    let observer = new MutationObserver((mutations) => {

      // When we add fixtures the number of mutations equal the number of list players
      // so when they don't match, then we need to recache the players and add fixtures again
      if (mutations.length !== this.listPlayers.length) {
        this.listPlayers = this.listViews.find('.ism-row-select')
        this.listPlayers.each((i, elem) => this.addFixturesToListPlayer(elem))
      }

    })

    this.listViews.each((i, view) => observer.observe(view, { subtree: true, childList: true }))
  },

  // Render everything
  render: function() {
    this.pitchPlayers.each((i, elem) => this.addFixturesToPitchPlayer(elem))
    this.listPlayers.each((i, elem) => this.addFixturesToListPlayer(elem))
  },

  // Remove the added DOM elements
  destroy: function() {
    this.pitchViews.find('.fixtures-container--field').remove()
    this.listViews.find('.fixtures-container').remove()
  },

  // Initialize module
  init: function() {

    // Start of with caching our variables and watching for changes 
    // in both the DOM and the user settings
    this.cache()
    this.listenOnSettings()
    this.watchPitchViews()
    this.watchListViews()

    // Get the players from the core module and begin rendering
    players.get()
      .then((players) => {
        this.players = players
        this.render()
      })

  }

}

$(document).on('fplReady', () => playerFixtures.init())