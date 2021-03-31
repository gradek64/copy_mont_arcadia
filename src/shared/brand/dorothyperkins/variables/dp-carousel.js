const colors = require('./dp-colors.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1108
const IMG_WIDTH = 815
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-selector-background-color': null,
  'carousel-selector-border-color': colors['lt-md-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-selector-selected-border-color': colors['dk-gray'],
  'carousel-arrow-height': ARROW_SIZE,
  'carousel-arrow-width': ARROW_SIZE,
  'carousel-selector-size': '10px',
  'carousel-selecor-vertical-margin': '3px',
  'carousel-arrow-position': '10px',
  'carousel-product-arrow-mask-size': '13px',
  'carousel-product-remove-color': colors['dk-gray'],
  'carousel-zoom-position-right': '5px',
  'carousel-zoom-icon': '/assets/dorothyperkins/images/zoom.svg',

  'carousel-container-width': '160px',
  'carousel-thumbnails-thumb-border': `solid 1px ${colors['lt-gray']}`,
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': '34px',
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',
}
