const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../burton/variables/br-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'user-locator-input-font-weight': 'bold',
  'user-locator-go-disabled-font-color': colors.white,
  'user-locator-go-disabled-backgound-color': colors['md-dk-gray'],
  'user-locator-height': '46px',
  'user-locator-map-marker-height': '22px',
  'user-locator-map-marker-margin-top': '4px',
  'user-locator-icon-background-size': '22px',
}
