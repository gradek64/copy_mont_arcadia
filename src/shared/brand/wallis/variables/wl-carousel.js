const colors = require('./wl-colors.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1590
const IMG_WIDTH = 1060
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-selector-background-color': colors['lt-gray'],
  'carousel-selector-border-color': colors['lt-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-selector-selected-border-color': colors['dk-gray'],
  'carousel-product-arrow-mask-size': '14px',
  'carousel-product-remove-color': colors.black,

  'carousel-arrow-width': ARROW_SIZE,
  'carousel-arrow-height': ARROW_SIZE,
  'carousel-container-width': '160px',
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': '34px',
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',
}
