const colors = require('./ms-colors.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1441
const IMG_WIDTH = 1060
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-arrow-width': ARROW_SIZE,
  'carousel-arrow-height': '70px',
  'carousel-selector-background-color': null,
  'carousel-selector-border-color': colors['dk-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-selector-size': '9px',
  'carousel-product-arrow-width': '42px',
  'carousel-thumbnail-padding': '53px',

  'carousel-container-width': '160px',
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': ARROW_SIZE,
  'carousel-thumbnail-arrow-height': ARROW_SIZE,
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',
}
