const colors = require('./ms-colors')
const typography = require('./ms-typography')

const megaNav = {
  'mega-nav-height': '50px',
  'mega-nav-bg-color': colors['mega-nav-bg'],
}

const megaNavCategories = {
  'mega-nav-categories-padding': '0',
}

const megaNavCategory = {
  'mega-nav-category-hover-border-bottom': 'none',
  'mega-nav-category-flex-grow': 1,
  'mega-nav-category-text-align': 'center',
}

const megaNavCategoryLink = {
  'mega-nav-category-link-display': 'inline-block',
  'mega-nav-category-link-text-transform': 'uppercase',
  'mega-nav-category-link-font-size': '12px',
  'mega-nav-category-link-font-size-tablet': '11px',
  'mega-nav-category-link-letter-spacing': '.071em',
  'mega-nav-category-link-text-align': 'center',
  'mega-nav-category-link-height': 'auto',
  'mega-nav-category-link-padding': '28px 5px',
  'mega-nav-category-link-font-weight': typography['font-weight-link'],
  'mega-nav-category-link-color': colors['mega-nav-cat-link-color'],
  'mega-nav-category-link-color-hover': colors['mega-nav-cat-hover'],
}

const megaNavColumn = {
  'mega-nav-column-border-right': `1px solid ${
    colors['mega-nav-column-border']
  }`,
}

const megaNavSubnavWrapper = {
  'mega-nav-subnavwrapper-bg-color': colors['mega-nav-subnav-bg'],
  'mega-nav-subnavwrapper-right': 'inherit',
}

const megaNavSubnav = {
  'mega-nav-subnav-max-width': '100%',
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '26px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-margin-bottom': '10px',
  'mega-nav-subcategory-header-color': colors.black,
  'mega-nav-subcategory-header-font-size': '0.9em',
  'mega-nav-subcategory-header-font-weight': typography['font-weight-h1'],
  'mega-nav-subcategory-header-border-bottom': 'none',
  'mega-nav-subcategory-header-text-transform': 'uppercase',
  'mega-nav-subcategory-header-display': 'block',
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '10px',
  'mega-nav-sub-category-item-padding-left': '0',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '0.86em',
  'mega-nav-sub-category-item-link-font-weight': typography['font-weight-link'],
  'mega-nav-sub-category-item-link-color': '#333333',
  'mega-nav-sub-category-item-link-hover-color': 'inherit',
  'mega-nav-sub-category-item-link-hover-text-decoration': 'none',
  'mega-nav-sub-category-item-link-line-height': '1.3em',
  'mega-nav-sub-category-item-link-hover-font-weight':
    typography['font-weight-500'],
}

module.exports = Object.assign(
  megaNav,
  megaNavCategories,
  megaNavCategory,
  megaNavCategoryLink,
  megaNavColumn,
  megaNavSubnavWrapper,
  megaNavSubnav,
  megaNavSubcategory,
  megaNavSubcategoryHeader,
  megaNavSubCategoryItem,
  megaNavSubCategoryItemLink
)
