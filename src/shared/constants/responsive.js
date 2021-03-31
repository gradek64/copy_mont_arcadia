// Order from min to wide!!
module.exports = {
  mobile: {
    file: true,
    min: 0,
    max: 767,
  },
  'min-tablet': {
    file: false,
    min: 768,
    max: null,
  },
  tablet: {
    file: true,
    min: 768,
    max: 991,
  },
  'min-laptop': {
    file: false,
    min: 992,
    max: null,
  },
  laptop: {
    file: true,
    min: 992,
    max: 1199,
  },
  desktop: {
    file: true,
    min: 1200,
    max: null,
  },

  grid: {
    gridMaxWidthTablet: 768,
    gridMaxWidthDesktop: 1200,
  },
}
