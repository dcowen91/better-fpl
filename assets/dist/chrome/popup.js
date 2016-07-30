/*
 * Adds #options to the current page if it's on fantasy.premierleague.com
 * This opens the options page in the tab
 */

document.querySelector('#go-to-options').addEventListener('click', function() {
  let tab = chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    let tab = tabs[0]

    if (!tab.url || tab.url.indexOf('fantasy.premierleague') < 0)
      return document.querySelector('.alert').className += ' show'

    if (tab.url.indexOf('#') > -1)
      tab.url = tab.url.split('#')[0]

    chrome.tabs.update(tab.id, { url: tab.url + '#better-fpl-options' }, () => window.close())
  })
})