'use strict'

const $ = require('jquery')
const settings = require('./settings.js')

const options = {

  cache: function() {
    this.body = $('body')
    this.template = $('#better-fpl-options-section')
    this.links = this.template.find('.navigation a')
    this.sections = this.template.find('.sections > section')
    this.close = this.template.find('.close-options')
    this.optionValues = this.template.find('.option-value')
  },

  camelCased: function(string) {
    return string.split('-').map((x, i) => i === 0 ? x : x.substr(0,1).toUpperCase() + x.substr(1)).join('')
  },

  appendTemplate: function() {
    return Promise.resolve(
      $.get(chrome.extension.getURL('/options.html'), (template) => $( $.parseHTML(template) ).appendTo('body'))
    )
  },

  updateValues: function() {
    this.optionValues.each((i, element) => {
      element = $(element)
      let name = this.camelCased(element.attr('id'))
      let value = settings.get(name)

      if (element.attr('type') === 'checkbox' && value !== undefined) {
        element.prop('checked', value)
      }
    })
  },

  toggle: function() {
    if (window.location.hash === '#better-fpl-options') {
      this.body.addClass('open-options')
    } else {
      this.body.removeClass('open-options')
    }
  },

  toggleSections: function(e) {
    let link = $(e.target)
    let section = $(link.attr('href'))

    this.links.removeClass('active')
    this.sections.removeClass('active')

    link.addClass('active')
    section.addClass('active')

    e.preventDefault()
  },

  bind: function() {
    $(window).on('hashchange', this.toggle.bind(this))
    this.links.on('click', this.toggleSections.bind(this))
    this.close.on('click', () => window.location.hash = '')
    this.optionValues.on('change', this.updateOptionValue.bind(this))
  },

  updateOptionValue: function(e) {
    let object = {}
    let target = $(e.target)
    let name = this.camelCased(target.attr('id'))
    let value = target.attr('type') === 'checkbox' ? target.is(':checked') : target.val()

    if (value !== undefined) {
      object[name] = value
      return settings.set(object)
    }
  },

  init: function() {
    this.appendTemplate()
      .then(() => {
        this.cache()
        this.bind()
        this.updateValues()
      })
  }

}

$('document').ready(() => options.init())