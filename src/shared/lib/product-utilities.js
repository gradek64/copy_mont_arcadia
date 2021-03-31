import { path } from 'ramda'
import { GTM_PAGE_TYPES, GTM_LIST_TYPES } from '../analytics'

/* This is needed since the API returns keynames with appended numbers. These need to be ignored to get the data. */
export const getMatchingAttribute = (key, object = {}) => {
  if (!object) return undefined
  const attributeKey = Object.keys(object).find((objectKey) =>
    objectKey.includes(key)
  )
  return object[attributeKey]
}

export const checkIfOneSizedItem = (items) =>
  items &&
  items.length === 1 &&
  (items[0].size === 'ONE' || items[0].size === '000')

/**
 * Calculates the sum of quanities in the given array of products.
 * (This has been extracted here because no such total exists in WCS responses
 * but is needed in a number of locations)
 * @param {Array<Object>} products the products to calculate the total quantity from
 *
 * @returns {Number} the total quantity
 */
export const getTotalQuantityFromProducts = (products) =>
  products.reduce((total, { quantity }) => total + (quantity || 0), 0)

const ALL_NUMBERS_REGEX = /^\d*$/
const PRODUCT_REGEX = /^[A-Z]{2}\w*/
const BUNDLE_REGEX = /^BUNDLE_\w*/

export const isProductId = (identifier) =>
  typeof identifier === 'number' ||
  ALL_NUMBERS_REGEX.test(identifier) ||
  PRODUCT_REGEX.test(identifier) ||
  BUNDLE_REGEX.test(identifier)

export const recommendationCategorySelector = (pageType, recommendation) =>
  pageType === GTM_PAGE_TYPES.PDP_PAGE_TYPE
    ? GTM_PAGE_TYPES.PDP_PAGE_TYPE
    : path(['attributes', 'pcatcomp'], recommendation) || ''

export const recommendationListSelector = (pageType) =>
  pageType === GTM_PAGE_TYPES.PDP_PAGE_TYPE
    ? GTM_LIST_TYPES.PDP_WHY_NOT_TRY
    : ''

export const getPDPCategoryAndUrl = (breadcrumbs) => {
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 2) {
    return breadcrumbs[breadcrumbs.length - 2]
  }
  return []
}
