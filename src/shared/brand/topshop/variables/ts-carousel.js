const colors = require('./ts-colors.js')
const base = require('./ts-base.js')

const ARROW_SIZE = '34px'

// Retrieved image width & height from PDP images
const IMG_HEIGHT = 1590
const IMG_WIDTH = 1060
const ASPECT_RATIO = (IMG_HEIGHT / IMG_WIDTH) * 100

module.exports = {
  'carousel-padding': '0',
  'carousel-arrow-position': '15px',
  'carousel-selector-background-color': colors.white,
  'carousel-selector-border-color': colors['md-gray'],
  'carousel-selector-selected-background-color': colors['dk-gray'],
  'carousel-selector-selected-border-color': colors['dk-gray'],
  'carousel-selector-size': '7px',
  'carousel-selector-padding': '1em 0 10px',
  'carousel-selector-position': 'absolute',
  'carousel-selector-bottom': '0',
  'carousel-selector-z-index': '5',
  'carousel-selector-width': '100%',
  'carousel-tap-message-border-radius': '0',
  'carousel-tap-message-font-family': base['font-family-primary'],
  'carousel-tap-message-letter-spacing': '0.085em',

  'carousel-arrow-width': ARROW_SIZE,
  'carousel-arrow-height': ARROW_SIZE,
  'carousel-container-width': '168px',
  'carousel-thumbnails-nav-container-height': ARROW_SIZE,
  'carousel-thumbnail-arrow-width': '34px',
  'carousel-main-image-alignment': 'left',
  'carousel-container-item-padding-bottom-desktop': `${ASPECT_RATIO}%`,
  'carousel-container-item-height-desktop': '0',
}
