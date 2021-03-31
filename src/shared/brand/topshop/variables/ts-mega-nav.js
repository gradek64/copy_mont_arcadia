const colors = require('./ts-colors')
const typography = require('./ts-typography')

const megaNav = {
  'mega-nav-height': '50px',
  'mega-nav-bg-color': colors['mega-nav-bg'],
}

const megaNavCategories = {
  'mega-nav-categories-justify-content': 'space-around',
  'mega-nav-categories-padding': '0',
}

const megaNavCategory = {
  'mega-nav-category-hover-color': colors['mega-nav-cat-hover'],
  'mega-nav-category-flex-grow': 1,
  'mega-nav-category-text-align': 'center',
}

const megaNavCategoryLink = {
  'mega-nav-category-link-display': 'inline-block',
  'mega-nav-category-link-text-transform': 'uppercase',
  'mega-nav-category-link-font-size': '12px',
  'mega-nav-category-link-font-size-tablet': '11px',
  'mega-nav-category-link-letter-spacing': '1.2px',
  'mega-nav-category-link-color': colors['mega-nav-cat-color'],
  'mega-nav-category-link-height': 'auto',
  'mega-nav-category-link-padding': '0',
  'mega-nav-category-link-margin': '0',
  'mega-nav-category-link-color-hover': colors['mega-nav-cat-hover'],
  'mega-nav-category-link-font-weight': typography['font-weight-400'],
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
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '26px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-margin-bottom': '10px',
  'mega-nav-subcategory-header-color': colors['mega-nav-subcat-header-color'],
  'mega-nav-subcategory-header-font-size': '12px',
  'mega-nav-subcategory-header-font-weight': 'normal',
  'mega-nav-subcategory-header-border-bottom': `1px solid ${
    colors['mega-nav-subcat-header-border']
  }`,
  'mega-nav-subcategory-header-text-transform': 'uppercase',
  'mega-nav-subcategory-header-display': 'block',
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '10px',
  'mega-nav-sub-category-item-padding-left': '5px',
  'mega-nav-sub-category-item-line-height': '1',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '12px',
  'mega-nav-sub-category-item-link-font-weight': 'normal',
  'mega-nav-sub-category-item-link-color': 'inherit',
  'mega-nav-sub-category-item-link-hover-color':
    colors['mega-nav-subcat-hover-color'],
  'mega-nav-sub-category-item-link-hover-text-decoration': 'none',
  'mega-nav-sub-category-item-link-letter-spacing': '0.3px',
  'mega-nav-sub-category-item-link-line-height': '20px',
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
