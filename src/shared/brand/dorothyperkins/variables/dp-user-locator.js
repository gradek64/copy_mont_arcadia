const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../dorothyperkins/variables/dp-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'user-locator-go-disabled-font-color': colors.white,
  'user-locator-go-disabled-backgound-color': colors['md-dk-gray'],

  'user-locator-input-font-weight': 'bold',
  'user-locator-input-border-color': colors['md-gray'],

  'user-locator-height': '46px',
  'user-locator-icon-size': '26px',
}
