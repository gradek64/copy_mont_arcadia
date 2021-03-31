const colors = require('./tm-colors')
const typography = require('./tm-typography')

const CAT_HEIGHT = '50px'

const megaNav = {
  'mega-nav-height': CAT_HEIGHT,
  'mega-nav-bg-color': '#fff',
}

const megaNavCategories = {
  'mega-nav-categories-padding': '0',
}

const megaNavCategory = {
  'mega-nav-category-flex-grow': 1,
  'mega-nav-category-text-align': 'center',
}

const megaNavCategoryLink = {
  'mega-nav-category-link-display': 'inline-block',
  'mega-nav-category-link-text-transform': 'uppercase',
  'mega-nav-category-link-font-size': '12px',
  'mega-nav-category-link-font-size-tablet': '11px',
  'mega-nav-category-link-letter-spacing': '.071em',
  'mega-nav-category-link-color': '#232323',
  'mega-nav-category-link-font-weight': typography['font-weight-400'],
  'mega-nav-category-link-color-hover': '#ccc',
  'mega-nav-category-link-text-align': 'center',
  'mega-nav-categories-font-style': 'normal',
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
  'mega-nav-subnav-line-height': '1',
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '26px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-margin-bottom': '15px',
  'mega-nav-subcategory-header-color': colors.black,
  'mega-nav-subcategory-header-font-size': '13px',
  'mega-nav-subcategory-header-font-weight': 'bold',
  'mega-nav-subcategory-header-border-bottom': `1px solid ${
    colors['mega-nav-subcat-header-border']
  }`,
  'mega-nav-subcategory-header-text-transform': 'capitalize',
  'mega-nav-subcategory-header-display': 'inline-block',
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '10px',
  'mega-nav-sub-category-item-padding-left': '0',
  'mega-nav-sub-category-item-line-height': '1',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '0.9em',
  'mega-nav-sub-category-item-link-font-weight': 'normal',
  'mega-nav-sub-category-item-link-hover-color': '#CCCCCC',
  'mega-nav-sub-category-item-link-letter-spacing': 'normal',
  'mega-nav-sub-category-item-link-line-height': '20px',
}

module.exports = Object.assign(
  megaNav,
  megaNavCategory,
  megaNavCategories,
  megaNavCategoryLink,
  megaNavColumn,
  megaNavSubnavWrapper,
  megaNavSubnav,
  megaNavSubcategory,
  megaNavSubcategoryHeader,
  megaNavSubCategoryItem,
  megaNavSubCategoryItemLink
)
