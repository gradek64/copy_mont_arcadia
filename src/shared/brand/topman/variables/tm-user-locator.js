const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../topman/variables/tm-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'user-locator-margin-top': '10px',
  'user-locator-height': '46px',
  'user-locator-input-border-focus-color': colors['md-gray'],
  'user-locator-icon-offset-right': '15px',
  'user-locator-icon-size': '22px',
}
