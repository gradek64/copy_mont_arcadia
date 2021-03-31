const colors = require('./dp-colors')

const megaNav = {
  'mega-nav-bg-color': colors['mega-nav-bg'],
  'mega-nav-height': null,
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
  'mega-nav-category-link-font-size': '0.9em',
  'mega-nav-category-link-font-size-tablet': '0.8em',
  'mega-nav-category-link-letter-spacing': 'inherit',
  'mega-nav-category-link-height': 'inherit',
  'mega-nav-category-link-font-weight': 'normal',
  'mega-nav-category-link-color-hover': colors['mega-nav-cat-hover'],
  'mega-nav-category-link-text-align': 'center',
  'mega-nav-category-link-line-height': '1',
  'mega-nav-category-link-padding': '16px 5px',
  'mega-nav-category-link-color': null,
  'mega-nav-category-link-margin': '0',
  'mega-nav-category-link-hover-text-decoration': 'underline',
}

const megaNavSubnavWrapper = {
  'mega-nav-subnavwrapper-bg-color': colors['mega-nav-subnav-bg'],
  'mega-nav-subnavwrapper-right': 'inherit',
}

const megaNavSubnav = {
  'mega-nav-subnav-bg-color': colors['mega-nav-subnav-bg'],
  'mega-nav-subnav-left': '0',
  'mega-nav-subnav-width': '100%',
  'mega-nav-subnav-max-width': '100%',
}

const megaNavSubcategory = {
  'mega-nav-subcategory-margin-top': '26px',
}

const megaNavSubcategoryHeader = {
  'mega-nav-subcategory-header-margin-bottom': '10px',
  'mega-nav-subcategory-header-color': colors.black,
  'mega-nav-subcategory-header-font-size': '0.94em',
  'mega-nav-subcategory-header-font-weight': 'bold',
  'mega-nav-subcategory-header-border-bottom': `1px solid ${
    colors['mega-nav-subcat-header-border']
  }`,
  'mega-nav-subcategory-header-text-transform': 'capitalize',
  'mega-nav-subcategory-header-display': 'inline-block',
  'mega-nav-subcategory-header-line-height': 1,
}

const megaNavSubCategoryItem = {
  'mega-nav-sub-category-item-margin-top': '10px',
  'mega-nav-sub-category-item-padding-left': '0',
}

const megaNavSubCategoryItemLink = {
  'mega-nav-sub-category-item-link-font-size': '0.9em',
  'mega-nav-sub-category-item-link-font-weight': 'normal',
  'mega-nav-sub-category-item-link-color': 'inherit',
  'mega-nav-sub-category-item-link-hover-color': 'inherit',
  'mega-nav-sub-category-item-link-hover-text-decoration': 'underline',
  'mega-nav-sub-category-item-link-hover-font-weight': 'bold',
}

const megaNavSpecificLinks = {
  'mega-nav-category-link-inspire-me-font-weight': 'bold',
}

module.exports = Object.assign(
  megaNav,
  megaNavCategories,
  megaNavSubnavWrapper,
  megaNavCategory,
  megaNavCategoryLink,
  megaNavSubnav,
  megaNavSubcategory,
  megaNavSubcategoryHeader,
  megaNavSubCategoryItem,
  megaNavSubCategoryItemLink,
  megaNavSpecificLinks
)
