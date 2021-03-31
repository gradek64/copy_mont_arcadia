import {
  getLocationQuery,
  getPrevPath,
  getRoutePath,
} from '../../../../shared/selectors/routingSelectors'
import {
  getCurrentProduct,
  getPlpBreadcrumbs,
  getProductsSearchResultsTotal,
} from '../../../../shared/selectors/productSelectors'
import { getCategoryId } from '../../../../shared/selectors/navigationSelectors'
import { getSelectedRefinements } from '../../../../shared/selectors/refinementsSelectors'
import { getPageTitle, getFixedCmsPageName } from './page-view-utils'

const getPdpData = (state) => {
  const { lineNumber, name } = getCurrentProduct(state)

  return {
    type: 'Product Display',
    category: `Prod Detail:(${lineNumber})${name}`,
  }
}

const getPlpData = (state) => {
  const pageData = { type: 'Category Display' }
  const query = getLocationQuery(state)

  if (query.q !== undefined) {
    pageData.category = 'Search'
  } else {
    const locationPath = () => getRoutePath(state)
    const categoryId = getCategoryId(state, locationPath)
    const breadcrumbLabels = getPlpBreadcrumbs(state).map(({ label }) => label)
    breadcrumbLabels.shift()
    pageData.category = `Category:${breadcrumbLabels.join(' > ')}`
    pageData.categoryId = categoryId && categoryId.toString()
  }

  const resultsTotal = getProductsSearchResultsTotal(state)
  pageData.searchResults = String(resultsTotal)

  const refinements = getSelectedRefinements(state)
  pageData.filteredPage = refinements.length > 0

  if (pageData.filteredPage) {
    pageData.appliedFilters = refinements.reduce(
      (appliedFilters, { key, value }) => {
        appliedFilters[key] = value
        return appliedFilters
      },
      {}
    )
  }
  return pageData
}

// @TODO use analytics constants for page types
const pageDataMapper = {
  plp: getPlpData,

  pdp: getPdpData,

  bundle: getPdpData,

  home: () => ({
    type: 'Home Page',
    category: 'Home Page',
  }),

  'write-a-review': () => ({
    type: 'Bazaar Voice',
    category: 'Category:Bazaar Voice',
  }),

  'mrCms-pages': () => ({
    type: 'Featured Page',
    category: getFixedCmsPageName(),
  }),

  'cms-pages': () => ({
    type: 'Featured Page',
    category: getFixedCmsPageName(),
  }),

  'style-adviser': () => ({
    type: 'Featured Page',
    category: getPageTitle(),
  }),

  'store-locator': () => ({
    type: 'Store Finder',
    category: 'Store Finder',
  }),

  'change-password': () => ({
    type: 'My Account',
    category: 'My Account > My Password',
  }),

  'change-shipping-destination': () => ({
    type: 'Change Shipping',
    category: 'Change Shipping',
  }),

  'collect-from-store': () => ({
    type: 'Store Finder',
    category: 'Store Finder Checkout',
  }),

  'delivery-details': () => ({
    type: 'Delivery Details',
    category: 'Checkout',
  }),

  'checkout-login': () => ({
    type: 'Register/Logon',
    category: 'Register/Logon',
  }),

  'payment-details': () => ({
    type: 'Payment Details',
    category: 'Payment Details Form',
  }),

  'order-completed': () => ({
    type: 'Order Confirmed',
    category: 'Order Confirmed',
  }),

  'delivery-payment': () => ({
    type: 'Delivery Payment',
    category: 'Delivery Payment Form',
  }),

  'my-checkout-details': () => ({
    type: 'My Account',
    category: 'My Account > My Checkout Details',
  }),

  'my-details': () => ({
    type: 'My Account',
    category: 'My Account > My Details',
  }),

  'my-account': () => ({
    type: 'My Account',
    category: 'My Account',
  }),

  'order-details': () => ({
    type: 'My Account',
    category: 'My Account > My Order Details',
  }),

  'my-orders': () => ({
    type: 'My Account',
    category: 'My Account > My Orders',
  }),

  'register-login': () => ({
    type: 'Register/Logon',
    category: 'Register/Logon',
  }),

  'not-found': () => ({
    type: 'Error Page - 404',
    category: 'Error Page - 404',
  }),

  'find-in-store': () => ({
    type: 'Store Finder',
    category: 'Store Finder Product',
  }),

  'reset-password': () => ({
    type: 'Reset Password',
    category: 'Reset Password',
  }),

  wishlist: (state) => ({
    type: 'Wish List',
    category: 'Wish List',
    prevPath: getPrevPath(state),
  }),
}

export const getPageData = (pageName, state) => {
  const dataMapper = pageDataMapper[pageName]
  return dataMapper ? dataMapper(state) : undefined
}
