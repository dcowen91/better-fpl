/*
 * Alters the template that react uses to render players in the field and on the bench
 *
 * At this point we have to guess what variables can be used because there's no known
 * way of knowing which variables are in the module scope
 * 
 * This should not wait for document ready beacuse we want to alter the template
 * before any of the views are rendered
 */

const $ = require('jquery')

const playerTemplates = {

  cache: function() {
    this.templates = $(this.templateContainers)
  },

  replaceTemplate: function() {
    let self = this
    this.templates.each(function() {
      let template = $(this)
      let content = template.text()
      // Add data-id
      content = content.replace(self.stringToReplace, self.stringToReplace + ' data-id="<%- id %>"')
      template.text(content)
    })
  },
  
  init: function(templateContainers, string) {
    this.templateContainers = templateContainers.join(', ')
    this.stringToReplace = string

    this.cache()
    this.replaceTemplate()
  }
}

playerTemplates.init([
  '#ismt-team-summary-item',
  '#ismt-squad-base-list-summary-item'
  ], 'class="ism-element"')

playerTemplates.init([
  '#ismt-statistics-stat-item',
  '#ismt-squad-selection-list-detail-item',
  '#ismt-squad-base-elements-list-item',
  '#ismt-team-my-detail-item'
  ], 'class="ism-table--el__primary"')
