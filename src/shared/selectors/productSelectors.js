import { createSelector } from 'reselect'
import { path, pathOr, filter, find, map, propEq } from 'ramda'

export const rootProductsSelector = (state) => state.products || {}

export const getProductsSearchResultsTotal = (state) => {
  const { totalProducts } = rootProductsSelector(state)

  return Number(totalProducts) || 0
}

export const getSelectedSKUs = (state) => {
  return filter(
    (value) => value,
    map(path(['fields', 'size', 'value']), state.forms.bundlesAddToBag)
  )
}

export const getSelectedSKU = (productId, state) => {
  return getSelectedSKUs(state)[productId]
}

export const getCurrentProduct = (state) => path(['currentProduct'], state)

/**
 * We can use Akamai's Geo IP feature to know the country of the user + the product's `countryExclusion` attribute
 * to know if they product is available for the user to purchase or not.
 *
 * Some products should not be available to user's in certain countries. These are attributed in ECMC with a country
 * exclusion list as a comma separated list of ISO 2 codes.
 * This list can either whitelist countries with a '+' prefix e.g. '+GB,FR,DE' which excludes all others
 * or blacklist countries with no prefix e.g 'GB,FR,DE' with includes all others.
 * If the field is not set or is an empty string there are no exclusions.
 */
export const isCountryExcluded = (state, product = {}) => {
  const attributes = product.attributes || {}
  const countryExclusion = attributes.countryExclusion || ''

  if (countryExclusion === '') return false

  const geoISO = state.geoIP.geoISO
  if (!geoISO) return false

  const inclusive = countryExclusion[0] === '+'
  const geoISOMatches = countryExclusion.includes(geoISO)

  return (geoISOMatches && !inclusive) || (!geoISOMatches && inclusive)
}

export const getCurrentProductId = (state) =>
  pathOr('', ['productId'], getCurrentProduct(state)).toString()

export const getPdpBreadcrumbs = (state) =>
  pathOr([], ['breadcrumbs'], getCurrentProduct(state))

export const getPlpBreadcrumbs = pathOr([], ['products', 'breadcrumbs'])

export const getProductDetail = (state) => path(['productDetail'], state)

export const getProductDetailSelectedQuantity = (state) => {
  const productDetail = getProductDetail(state) || {}
  const { selectedQuantity } = productDetail

  return selectedQuantity || 1
}

export const getCurrentProductIsPreloaded = (state) =>
  path(['currentProduct', 'isPreloaded'], state)

export const getSizeGuideType = (state) =>
  path(['productDetail', 'sizeGuideType'], state)

export const getProducts = (state) =>
  pathOr([], ['products', 'products'], state)

export const getProductsLength = (state) =>
  pathOr([], ['products', 'products'], state).length

export const getProductById = (id, state) =>
  find(propEq('productId', id), getProducts(state))

export const getShouldIndex = (state) => {
  const { shouldIndex } = rootProductsSelector(state)

  return Boolean(shouldIndex)
}

export const getSelectedProductSwatches = (state) => {
  const { selectedProductSwatches } = rootProductsSelector(state)

  return selectedProductSwatches
}

export const getSortOptions = (state) =>
  pathOr([], ['products', 'sortOptions'], state)
export const getCurrentSortOptionKey = (state) =>
  path(['sorting', 'currentSortOption'], state)

export const getCurrentSortOption = createSelector(
  [getSortOptions, getCurrentSortOptionKey],
  (sortOptions, currentSortOption) => {
    const sortOptionSelected = sortOptions.find(
      (option) => option.value === currentSortOption
    )

    return sortOptionSelected || sortOptions[0]
  }
)

export const getProductsLocation = (state) =>
  pathOr({}, ['products', 'location'], state)

export const getPageType = (state) => path(['pageType'], state)

export const getCategoryTitle = (state) =>
  path(['products', 'categoryTitle'], state)
