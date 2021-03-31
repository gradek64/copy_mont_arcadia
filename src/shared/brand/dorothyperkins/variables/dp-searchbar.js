const colors = require('./dp-colors')
const formInputs = require('./dp-form-inputs')

module.exports = {
  'searchbar-background-color': colors.white,
  'searchbar-font-size': '0.8125em',
  'searchbar-font-color': formInputs['input-active-font-color'],
  'searchbar-placeholder-font-color':
    formInputs['input-placeholder-font-color'],
  'searchbar-icon-position': '1',
  'searchbar-icon-padding': '14px',
  'header-big-searchbar-top': '0',
}
