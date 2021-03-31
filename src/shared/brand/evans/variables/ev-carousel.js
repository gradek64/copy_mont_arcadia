const colors = require('./ev-colors.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1441
const IMG_WIDTH = 1060
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-selector-background-color': null,
  'carousel-selector-border-color': colors['lt-md-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-selector-selected-border-color': colors.black,
  'carousel-product-arrow-mask-size': '15px',

  'carousel-arrow-width': ARROW_SIZE,
  'carousel-arrow-height': ARROW_SIZE,
  'carousel-container-width': '160px',
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': '34px',
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',

  'carousel-zoom-icon': '/assets/evans/images/zoom.svg',
}
