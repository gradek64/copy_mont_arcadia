import { parse as urlParse } from 'url'
import qs from 'qs'
import { browserHistory } from 'react-router'
import { changeURL, getHostname, isProductionBrandHost } from './window'
import {
  ATT_BADGE,
  ATT_BANNER,
  PROMO_BANNER,
} from '../constants/productAssetTypes'
import { productListPageSize } from '../../server/api/mapping/constants/plp'

// Helpers
import { type, isNil, isEmpty, omit } from 'ramda'

// Constants
import { categoryI18n } from '../constants/internationalized-strings'

const mobileAssetType = (additionalAssetType) => ({ assetType }) =>
  assetType === `${additionalAssetType}_MOBILE`

const mobileAttBadge = mobileAssetType(ATT_BADGE)
const mobileAttBanner = mobileAssetType(ATT_BANNER)
const mobilePromoBanner = mobileAssetType(PROMO_BANNER)

const processRedirectUrl = (url) => {
  if (process.browser) {
    if (url.indexOf('/') === 0) {
      // relative url
      browserHistory.replace(url)
    } else {
      const urlObject = urlParse(url)
      if (isProductionBrandHost(getHostname(), urlObject.hostname)) {
        // internal redirect
        browserHistory.replace(urlObject.path)
      } else {
        browserHistory.goBack()
        changeURL(url)
      }
    }
  }
}

const isLowStockProduct = (quantity, stockThreshold = 0) => {
  if (stockThreshold === 0) stockThreshold = 3 // Client patch in case of missed configuration
  return quantity <= stockThreshold
}

const parseCurrentPage = (productsLength) =>
  productsLength ? Math.ceil(productsLength / productListPageSize) + 1 : 1

const isSeoUrlSearchFilter = (seoUrl) => seoUrl && seoUrl.includes('seo=false')

const isSeoUrlCategoryFilter = (seoUrl) => {
  const seoUrlDecoded = decodeURIComponent(seoUrl)
  const isCategoryString = categoryI18n.findIndex((cat) => {
    return (
      seoUrl && seoUrlDecoded.includes(`/${cat}/`) && seoUrl.includes('siteId=')
    )
  })

  return isCategoryString >= 0
}

const isSeoUrlFilterOnScroll = (seoUrl) => {
  const seoUrlDecoded = decodeURIComponent(seoUrl)
  const isCategoryString = categoryI18n.findIndex((cat) => {
    const catRegexp = `(\\/${cat}\\/).+(\\/N-)`
    return (
      seoUrl && type(seoUrlDecoded.match(new RegExp(catRegexp))) === 'Array'
    )
  })

  return isCategoryString >= 0
}

const isSearchUrl = (seoUrl) => seoUrl && seoUrl.includes('/search/')

const hasQueryParameter = (seoUrl) => /[?&]q=/.test(seoUrl)

const parseSearchUrl = (seoUrl) => {
  if (!isSearchUrl(seoUrl) || !hasQueryParameter(seoUrl)) {
    return {}
  }

  return seoUrl
    .split('?')[1]
    .split('&')
    .reduce((acc, val) => {
      const key = val.split('=')
      acc[key[0]] = key[1]
      return acc
    }, {})
}

const getResetSearchUrl = (currentSearchPath) =>
  `/search/?q=${currentSearchPath.match(/Ntt=(.*?)&/)[1]}`

const updateSeoUrlIfSearchFilter = (seoUrl) =>
  isSeoUrlSearchFilter(seoUrl) ? `/filter${seoUrl}` : seoUrl

const cleanSeoUrl = (seoUrl) =>
  seoUrl.replace('/filter', '').replace(/&No=(\d){2,}/, '')

// If this param is found then this seoUrl is a search > filter not
// a Category filter
const seoUrlIncludesProductsIndex = (seoUrl) =>
  seoUrl.search(/&No=(\d){2,}/, '') > 0

const isFiltered = (seoUrl) =>
  (seoUrl && isSeoUrlSearchFilter(seoUrl)) ||
  isSeoUrlCategoryFilter(seoUrl) ||
  isSeoUrlFilterOnScroll(seoUrl)

const reviseNrppParam = (params) =>
  params.includes('Nrpp=')
    ? params.replace(/Nrpp=(\d+)/, 'Nrpp=24')
    : `${params}&Nrpp=24`

const concatUrl = (seoUrl, newParam) =>
  seoUrl.includes('?') ? `${seoUrl}&${newParam}` : `${seoUrl}?${newParam}`

const reviseSiteIdParam = (search, siteId) =>
  isNil(search.match(/(siteId=.*(?=&)|(siteId=.*))/))
    ? concatUrl(search, `siteId=%2F${siteId}`)
    : search

const concatParam = (search, newParam) =>
  isEmpty(search) ? `?${newParam}` : `${search}&${newParam}`

// This part of the seoUrl "/filter" is not required for coreApi.
const prepareSeoUrl = (seoUrl, siteId) => {
  /**
   NOTE : defensive code to make sure siteId is available
   please check : DES-5526
   */

  return reviseSiteIdParam(seoUrl.replace('/filter', ''), siteId)
}

/* @Param: No=0
 * Check in the parameter exists and update index number or
 * if it does not exist add "No" parameter
 *  */
const reviseNoParam = (search, nextPage) =>
  isNil(search.match(/No=\d+/))
    ? concatParam(search, `No=${(nextPage - 1) * productListPageSize}`)
    : search.replace(/No=\d+/, `No=${(nextPage - 1) * productListPageSize}`)

const addSearchParam = (pathname, search, nextPage, siteId) => {
  const seoUrl = `${pathname}${search}`
  return isFiltered(seoUrl)
    ? reviseSiteIdParam(reviseNoParam(search, nextPage), siteId)
    : search
}

const hasSortOption = (seoUrl) => seoUrl && seoUrl.search(/&Ns=(.{2,}?&)/)

const isPriceFilter = (pathname) => {
  const re = new RegExp(
    /&?Nf=nowPrice%7CBTWN(%2B|\+)[0-9]{0,10}.?\d*(%2B|\+)[0-9]{0,10}.?\d*/
  )

  return !!pathname.match(re)
}

const updatePriceSeoUrl = (values, sortOptionNavigationState) => {
  let newSeoUrl = sortOptionNavigationState
  const encodeValues = (min, max) => {
    /** Example of price string not encoded
     Nf=nowPrice|BTWN+103+499
    */
    return encodeURIComponent(`nowPrice|BTWN+${min}+${max}`)
  }
  const re = new RegExp(
    /&?Nf=nowPrice%7CBTWN\+[0-9]{0,10}\.?\d*\+[0-9]{0,10}\.?\d*/
  )
  const isNowPriceSelected = sortOptionNavigationState.match(re)

  // We already have a price refinement selected, we modify with the new values
  if (isNowPriceSelected) {
    newSeoUrl = isNowPriceSelected.input.replace(
      re,
      `&Nf=${encodeValues(values[0], values[1])}`
    )

    // No Price refinement, we need build the string and add to the seoUrl
  } else {
    newSeoUrl = `${sortOptionNavigationState}&Nf=${encodeValues(
      values[0],
      values[1]
    )}`
  }

  return newSeoUrl
}

const removePriceFromSeoUrl = (seoUrl) => {
  const re = new RegExp(
    /&?Nf=nowPrice%7CBTWN\+[0-9]{0,10}\.?\d*\+[0-9]{0,10}\.?\d*/
  )
  const isNowPriceSelected = seoUrl.match(re)

  const newSeoUrl = isNowPriceSelected
    ? isNowPriceSelected.input.replace(re, '')
    : seoUrl

  // In case the now price is the first, make sure we fix the new seoUrl
  return newSeoUrl.match(/\?&/) ? newSeoUrl.replace('?&', '?') : newSeoUrl
}

const encodeIfPriceSeoUrl = (seoUrl) => {
  const re = new RegExp(
    /&?Nf=nowPrice%7CBTWN\+[0-9]{0,10}\.?\d*\+[0-9]{0,10}\.?\d*/
  )

  const isNowPriceSelected = seoUrl.match(re)
  return isNowPriceSelected
    ? isNowPriceSelected.input.replace(
        re,
        encodeURIComponent(isNowPriceSelected[0])
      )
    : seoUrl
}

const getColourSwatchesIndex = (lineNumber = '', colourSwatches = []) =>
  colourSwatches &&
  colourSwatches.findIndex(
    ({ swatchProduct }) => swatchProduct.grouping === lineNumber
  )

const addParamClearAll = (seoUrl) => {
  if (isEmpty(seoUrl)) return seoUrl

  const urlParts = seoUrl.split('?')
  const paramObj = qs.parse(urlParts[1])
  const queryString = qs.stringify({ ...paramObj, clearAll: true })

  return `${urlParts[0]}?${queryString}`
}

const removeParamClearAll = (seoUrl) => {
  if (isEmpty(seoUrl)) return seoUrl

  const paramObj = qs.parse(
    seoUrl,
    { ignoreQueryPrefix: true },
    { encode: false }
  )
  const queryString = qs.stringify(omit(['clearAll'], paramObj), {
    encode: false,
  })

  return `?${queryString}`
}

const getCategoryFromBreadcrumbs = (breadcrumbs) => {
  const breadcrumb =
    breadcrumbs && breadcrumbs.length && breadcrumbs[breadcrumbs.length - 1]
  return breadcrumb && breadcrumb.category
}

const replaceSpacesWithPlus = (pathname) => pathname.replace(/ /g, '+')

const isValidEcmcCategory = (pathname) => {
  const pathnameDecoded = decodeURIComponent(pathname)
  const regex = new RegExp(
    `\\/(${categoryI18n.join('|')})(\\/(?!N\\-)([a-zA-Z0-9À-ž%]+-)+\\d+\\/?)`
  )

  return regex.test(pathnameDecoded)
}

export {
  mobileAttBadge,
  mobileAttBanner,
  mobilePromoBanner,
  processRedirectUrl,
  isLowStockProduct,
  parseCurrentPage,
  isSeoUrlSearchFilter,
  updateSeoUrlIfSearchFilter,
  prepareSeoUrl,
  cleanSeoUrl,
  isSeoUrlCategoryFilter,
  addSearchParam,
  seoUrlIncludesProductsIndex,
  isSearchUrl,
  hasQueryParameter,
  parseSearchUrl,
  isFiltered,
  hasSortOption,
  getResetSearchUrl,
  isPriceFilter,
  updatePriceSeoUrl,
  removePriceFromSeoUrl,
  encodeIfPriceSeoUrl,
  isSeoUrlFilterOnScroll,
  reviseNrppParam,
  reviseSiteIdParam,
  reviseNoParam,
  concatParam,
  concatUrl,
  getColourSwatchesIndex,
  addParamClearAll,
  removeParamClearAll,
  getCategoryFromBreadcrumbs,
  replaceSpacesWithPlus,
  isValidEcmcCategory,
}
