const colors = require('./br-colors.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1413
const IMG_WIDTH = 1060
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-selector-background-color': colors['lt-md-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-product-arrow-mask-size': '15px',
  'carousel-arrow-height': ARROW_SIZE,
  'carousel-arrow-width': ARROW_SIZE,
  'carousel-container-width': '160px',
  'carousel-container-height': '510px',
  'carousel-thumbnails-thumb-border': `solid 1px ${colors['lt-md-gray']}`,
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': '34px',
  'carousel-zoom-icon': '/assets/burton/images/zoom.svg',
  'carousel-zoom-padding': '0',
  'carousel-zoom-position-right': '10px',
  'carousel-zoom-position-bottom': '10px',
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',
}
