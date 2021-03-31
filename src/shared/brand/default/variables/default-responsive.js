const breakpoints = require('../../../constants/responsive.js')

function createCssVars(prev, next) {
  const values = breakpoints[next]
  // Set breakpoints
  if (values.min)
    prev[`${next}-start-width`] = values.min + (values.min !== 0 && 'px')
  if (values.max) prev[`${next}-end-width`] = `${values.max}px`

  // Set media queries
  prev[next] = `screen and (min-width: ${values.min}${
    values.min !== 0 ? 'px' : ''
  }${values.max ? `) and (max-width: ${values.max}px)` : ')'}`

  return prev
}

// Generates CSS variables from responsive config
module.exports = Object.keys(breakpoints).reduce(createCssVars, {})
