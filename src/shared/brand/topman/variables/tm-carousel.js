const colors = require('./tm-colors.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1439
const IMG_WIDTH = 1060
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-padding': '0',
  'carousel-selector-display': 'none',
  'carousel-arrow-width': ARROW_SIZE,
  'carousel-arrow-height': ARROW_SIZE,
  'carousel-thumbnail-padding': '30px',
  'carousel-selector-background-color': null,
  'carousel-selector-border-color': colors['dk-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-opacity-fade-start': '1',
  'carousel-arrow-position': '10px',

  'carousel-container-width': '160px',
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': '34px',
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',
}
