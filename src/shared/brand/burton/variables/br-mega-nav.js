const colors = require('./br-colors')

const SUBNAV_MAX_WIDTH = '1080px'

const megaNav = {
  'mega-nav-height': '50px',
  'mega-nav-bg-color': colors['mega-nav-bg-color'],
}

const megaNavCategories = {
  'mega-nav-categories-padding': '0',
}

const megaNavCategory = {
  'mega-nav-category-hover-color': colors['mega-nav-category-hover'],
  'mega-nav-category-flex-grow': 1,
}

const megaNavCategoryLink = {
  'mega-nav-category-link-display': 'inline-block',
  'mega-nav-category-link-text-transform': 'uppercase',
  'mega-nav-category-link-font-size': '12px',
  'mega-nav-category-link-font-size-min-laptop': '13px',
  'mega-nav-category-link-letter-spacing': '0.3px',
  'mega-nav-category-link-height': '18px',
  'mega-nav-category-link-padding': '0',
  'mega-nav-category-link-font-weight': '500',
  'mega-nav-category-link-color': colors['mega-nav-category-link-color'],
  'mega-nav-category-link-text-align': 'center',
  'mega-nav-category-link-color-hover': 'inherit',
  'mega-nav-category-link-border-bottom-hover': `solid 1px ${
    colors['mega-nav-category-link-border-color']
  }`,
  'mega-nav-category-link-margin': '0',
  'mega-nav-category-link-margin-min-laptop': '0',
}

const megaNavSubnavWrapper = {
  'mega-nav-subnavwrapper-bg-color': colors['mega-nav-subnav-bg'],
  'mega-nav-subnavwrapper-right': '0',
}

const megaNavSubnav = {
  'mega-nav-subnav-max-width': SUBNAV_MAX_WIDTH,
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '26px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-font-size': '14px',
  'mega-nav-subcategory-header-color': colors['mega-nav-sub-cat-header-color'],
  'mega-nav-subcategory-header-font-weight': 'bold',
  'mega-nav-subcategory-header-margin-bottom': '16px',
  'mega-nav-subcategory-header-text-transform': 'uppercase',
  'mega-nav-subcategory-header-display': 'block',
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '16px',
  'mega-nav-sub-category-item-padding-left': '0',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '14px',
  'mega-nav-sub-category-item-link-font-weight': '500',
  'mega-nav-sub-category-item-link-hover-color':
    colors['mega-nav-sub-cat-item-link-hover-color'],
  'mega-nav-sub-category-item-link-color':
    colors['mega-nav-sub-cat-item-link-color'],
  'mega-nav-sub-category-item-link-hover-text-decoration': 'underline',
}

module.exports = Object.assign(
  megaNav,
  megaNavCategories,
  megaNavCategory,
  megaNavCategoryLink,
  megaNavSubnavWrapper,
  megaNavSubnav,
  megaNavSubcategory,
  megaNavSubcategoryHeader,
  megaNavSubCategoryItem,
  megaNavSubCategoryItemLink
)
