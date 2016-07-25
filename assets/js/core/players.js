const $ = require('jquery')

const elements = {
  teams: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  elements: [],

  loadElements: function() {
    return Promise.resolve( $.ajax('https://fantasy.premierleague.com/drf/bootstrap-static') )
  },

  loadElementSummary: function(id, team) {
    return Promise.resolve(
      $.getJSON('https://fantasy.premierleague.com/drf/element-summary/' + id, (data) => {
        data.team = team
        return data
      })
    )
  },

  get: function() {
    let done = []
    let promises = []

    // Modules are cached so we can just return the elements if we have them
    if (this.elements.length !== 0)
      return Promise.resolve(this.elements)

    let elements = this.loadElements()
      .then((data) => {
        this.elements = data.elements
        
        for (var i = 0; i < this.teams.length; i++) {
          let team = this.teams[i]

          if (done.indexOf(team) < 0) {
            let id = this.elements.find((element) => element.team === team).id
            promises.push(this.loadElementSummary(id, team))
          }
        }

        return Promise.all(promises)
      })
      .then((data) => {
        this.elements = this.elements.map((element) => {
          element.fixtures = data.find((d) => d.team === element.team).fixtures
          return element
        })

        return this.elements
      })
      .catch((err) => {
        throw err
      })

    return Promise.resolve(elements)
  }
}

module.exports = elements