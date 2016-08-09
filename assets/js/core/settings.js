const watch = require('watchjs').watch

let settings = {

  // Default settings
  settings: {
    hideModals: true,
    showFixtures: true,
    disableModalHorizontalScroll: true,
    transferHighlight: true
  },

  sync: function(done) {
    chrome.storage.sync.get((settings) => {

      for (var key in settings) {
        this.settings[key] = settings[key]
      }
      
      done()
    })
  },

  set: function(settings) {
    return chrome.storage.sync.set(settings)
  },

  get: function(key) {
    return this.settings[key]
  },

  onChange: function() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let key in changes) {
        this.settings[key] = changes[key].newValue
      }
    })
  },

  watch: function(values, callback) {
    watch(this.settings, values, (prop, action, newValue, oldValue) => callback(newValue))
  },

  init: function() {
    this.sync(() => {
      this.onChange()
    })
  }
}

settings.init()

module.exports = settings