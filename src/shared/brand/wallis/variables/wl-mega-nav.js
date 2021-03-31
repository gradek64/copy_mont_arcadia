const colors = require('./wl-colors')

const megaNav = {
  'mega-nav-height': '60px',
  'mega-nav-bg-color': '#fff',
  'mega-nav-margin-bottom': '10px',
}

const megaNavCategories = {
  'mega-nav-categories-padding': '0 10px',
}

const megaNavCategory = {
  'mega-nav-category-hover-border-bottom': 'none',
  'mega-nav-category-flex-grow': 1,
  'mega-nav-category-text-align': 'center',
}

const megaNavCategoryLink = {
  'mega-nav-category-link-display': 'inline-block',
  'mega-nav-category-link-text-transform': 'capitalize',
  'mega-nav-category-link-font-size': '16px',
  'mega-nav-category-link-text-align': 'center',
  'mega-nav-category-link-margin': '0',
  'mega-nav-category-link-after-height': '0',
  'mega-nav-category-link-letter-spacing': '0',
  'mega-nav-category-link-height': 'inherit',
  'mega-nav-category-link-padding': '44px 0',
  'mega-nav-category-link-font-weight': 'normal',
  'mega-nav-category-link-color': colors.black,
  'mega-nav-category-link-color-hover': colors['dk-gray'],
}

const megaNavColumn = {
  'mega-nav-column-border-left': `1px solid ${
    colors['mega-nav-column-border']
  }`,
}

const megaNavSubnavWrapper = {
  'mega-nav-subnavwrapper-bg-color': colors['mega-nav-subnav-bg'],
  'mega-nav-subnavwrapper-right': '0',
}

const megaNavSubnav = {
  'mega-nav-subnav-max-width': '1199px',
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '26px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-margin-bottom': '5px',
  'mega-nav-subcategory-header-color': colors['mega-nav-subcat-header-color'],
  'mega-nav-subcategory-header-font-size': '1.2em',
  'mega-nav-subcategory-header-font-weight': '500',
  'mega-nav-subcategory-header-border-bottom': 'none',
  'mega-nav-subcategory-header-text-transform': 'uppercase',
  'mega-nav-subcategory-header-padding': '0 0 0 20px',
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '0',
  'mega-nav-sub-category-item-padding-left': '0',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '1.04em',
  'mega-nav-sub-category-item-link-font-weight': 'normal',
  'mega-nav-sub-category-item-link-color': 'inherit',
  'mega-nav-sub-category-item-link-transition':
    'background-color .2s linear 0s',
  'mega-nav-sub-category-item-link-padding': '7.5px 20px',
  'mega-nav-sub-category-item-link-hover-color':
    colors['mega-nav-subcat-item-link-hover-color'],
  'mega-nav-sub-category-item-link-hover-text-decoration': 'none',
  'mega-nav-sub-category-item-link-hover-background-color': colors.terracotta,
  'mega-nav-sub-category-item-link-hover-transition':
    'background-color 0s linear',
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
