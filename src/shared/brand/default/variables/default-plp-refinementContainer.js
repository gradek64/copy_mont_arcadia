const colors = require('./default-colors')

const plpRefinementContainer = {
  'plp-refinementContainer-width': '200px',
  'plp-refinementContainer-margin-right': '15px',
  'plp-refinementContainer-margin-left': '10px',
  'plp-refinementContainer-title-margin': '15px',
}

const plpRefinementListContainer = {
  'plp-refinementListContainer-padding-right': '20px',
  'plp-refinementListContainer-width': '200px',
  'plp-refinementListContainer-stickyHeader-fixed': '50px',
  'plp-refinementListContainer-stickyHeader-fixed-tablet': '50px',
}

const plpRefinementListContainerFixed = {
  'plp-refinementListContainerFixed-width': '210px',
  'plp-refinementListContainerFixed-padding-right': '15px',
  'plp-refinementListContainerFixed-padding-left': '10px',
  'plp-refinementListContainerFixed-margin-left': '-10px',
  'plp-refinementListContainerFixed-background-color': colors.white,
}

module.exports = Object.assign(
  plpRefinementContainer,
  plpRefinementListContainer,
  plpRefinementListContainerFixed
)
