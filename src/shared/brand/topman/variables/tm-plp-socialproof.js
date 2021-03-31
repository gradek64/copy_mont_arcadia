const viewports = {
  'viewport-width': '105vw',
  'tablet-viewport-width': '1.3vw',
  'mobile-viewport-width': '120vw',
}

const font = {
  'min-font': '6px',
  'min-font-val': 6,
  'max-font': '13px',
  'max-font-val': 13,
}

const desktop = {
  'desktop-maxwidth': '1200px',
  'desktop-maxwidth-val': 1200,
}

const tablet = {
  'tablet-minwidth': '768px',
  'tablet-maxwidth': '1029px',
}

const mobile = {
  'mobile-maxwidth': '767px',
  'mobile-maxwidth-val': 767,
}

module.exports = Object.assign(viewports, font, desktop, tablet, mobile)
