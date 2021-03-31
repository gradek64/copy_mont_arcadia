const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../wallis/variables/wl-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'user-locator-go-disabled-backgound-color': colors['terracotta-lt'],
  'user-locator-go-disabled-border-color': colors.terracotta,
  'user-locator-input-border-color': colors['dk-gray'],
  'user-locator-input-width': '85%',
  'user-locator-input-font-weight': 'bold',

  'user-locator-height': '46px',
  'user-locator-icon-offset-right': '12px',
  'user-locator-icon-size': '30px',
}
