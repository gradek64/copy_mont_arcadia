const colors = require('./ev-colors')
const typography = require('./ev-typography')

const megaNav = {
  'mega-nav-height': '30px',
  'mega-nav-bg-color': colors['mega-nav-bg'],
}

const megaNavCategories = {
  'mega-nav-categories-padding': '0',
}

const megaNavCategory = {
  'mega-nav-category-hover-color': 'inherit',
  'mega-nav-category-flex-grow': 1,
  'mega-nav-category-text-align': 'center',
}

const megaNavCategoryLink = {
  'mega-nav-category-link-display': 'inline-block',
  'mega-nav-category-link-color': colors['mega-nav-cat-link-color'],
  'mega-nav-category-link-text-transform': 'uppercase',
  'mega-nav-category-link-font-size': typography['font-size-link'],
  'mega-nav-category-link-font-size-min-laptop': typography['font-size-link'],
  'mega-nav-category-link-letter-spacing': '1px',
  'mega-nav-category-link-height': '30px',
  'mega-nav-category-link-padding': '0',
  'mega-nav-category-link-font-weight': typography['font-weight-link'],
  'mega-nav-category-link-text-align': 'left',
  'mega-nav-category-link-margin': '0',
  'mega-nav-category-link-color-hover': 'inherit',
  'mega-nav-category-link-after-height': '2px',
  'mega-nav-category-link-after-bottom': '1px',
  'mega-nav-category-link-after-bg-color':
    colors['mega-nav-cat-link-border-bottom-color'],
}

const megaNavColumn = {
  'mega-nav-column-border-right': `1px solid ${
    colors['mega-nav-column-border']
  }`,
}

const megaNavSubnavWrapper = {
  'mega-nav-subnavwrapper-bg-color': colors['mega-nav-subnav-wrapper-bg-color'],
  'mega-nav-subnavwrapper-right': '0',
}

const megaNavSubnav = {
  'mega-nav-subnav-max-width': '1199px',
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '16px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-margin-bottom': '8px',
  'mega-nav-subcategory-header-color': colors.black,
  'mega-nav-subcategory-header-font-size': '1.1em',
  'mega-nav-subcategory-header-font-weight': typography['font-size-link'],
  'mega-nav-subcategory-header-text-transform': 'capitalize',
  'mega-nav-subcategory-header-text-decoration': 'underline',
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '10px',
  'mega-nav-sub-category-item-padding-left': '0',
  'mega-nav-sub-category-item-line-height': '1',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '0.91em',
  'mega-nav-sub-category-item-link-font-weight':
    typography['font-weight-detail'],
  'mega-nav-sub-category-item-link-color': 'inherit',
  'mega-nav-sub-category-item-link-hover-color': 'inherit',
  'mega-nav-sub-category-item-link-hover-text-decoration': 'underline',
  'mega-nav-sub-category-item-link-line-height': '19px',
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
