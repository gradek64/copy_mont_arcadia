const typography = require('./ev-typography')

module.exports = {
  'plp-no-results-padding': '20px 10px 10px',

  'plp-no-results-clear-filters-width': null,

  'plp-no-results-message-before-content':
    'url("public/evans/images/error.svg")',
  'plp-no-results-message-before-display': 'block',

  'plp-no-results-clear-filters-decoration': 'underline',
  'plp-no-results-clear-filters-text-transform': 'capitalize',
  'plp-no-results-clear-filters-font-weight': typography['font-weight-thick'],
  'plp-no-results-clear-filters-before-content':
    'url("public/evans/images/delete.svg")',
  'plp-no-results-clear-filters-before-margin-left': '0.8em',
  'plp-no-results-clear-filters-before-margin-right': '0.8em',

  'plp-no-results-error-image-size': '50px',

  'plp-no-results-filter-type-padding-top': 0,
  'plp-no-results-filter-type-error-image-display': 'none',
  'plp-no-results-filter-type-message-padding': 0,
}
