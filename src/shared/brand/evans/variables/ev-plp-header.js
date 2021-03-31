const base = require('./ev-base')
const typography = require('./ev-typography')

module.exports = {
  'plp-header-total-font-family': base['font-family-primary'],
  'plp-header-total-font-weight': typography['font-weight-normal'],
  'plp-header-total-font-size': typography['font-size-info'],
  'plp-header-total-vertical-align': 'middle',
  'plp-header-padding': '15px 10px 10px',
  'plp-header-title-font-weight': typography['font-weight-normal'],
  'plp-header-title-font-size': typography['font-size-info'],
  'plp-header-title-margin-bottom': null,
  'plp-cat-header-margin-bottom': '10px',
  'plp-header-title-text-transform': 'uppercase',
}
