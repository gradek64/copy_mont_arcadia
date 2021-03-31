import { compose, ifElse, path, isEmpty } from 'ramda'
import { isNilOrEmpty } from '../../../shared/lib/values'
import { round } from '../../../shared/lib/numbers'
import {
  getMatchingAttribute,
  recommendationCategorySelector,
  recommendationListSelector,
} from '../../../shared/lib/product-utilities'
import { GTM_LIST_TYPES, GTM_PAGE_TYPES } from '../../../shared/analytics/index'

const ECMC_PROD_CE3_PRODUCT_TYPE = 'ECMC_PROD_CE3_PRODUCT_TYPE'
const toString = (value) => (value != null ? `${value}` : value)

const safeRoundTo = (precision) =>
  ifElse(
    isNilOrEmpty,
    () => undefined,
    compose(
      (x) => x.toFixed(precision),
      round,
      parseFloat
    )
  )

export const currency = safeRoundTo(2)

export const percentage = safeRoundTo(2)

export const rating = safeRoundTo(1)

const ECMC_PROD_CE3_BRAND = 'ECMC_PROD_CE3_BRAND'

const mapTotalSizes = (items) => {
  if (!Array.isArray(items)) {
    return
  }
  const sizes = items.filter(({ size }) => size)
  return !isEmpty(sizes) ? sizes.length : undefined
}

const mapSizesInStock = (items) => {
  if (!Array.isArray(items)) {
    return
  }
  return items
    .filter(({ size, quantity }) => size && quantity > 0)
    .map(({ size }) => size)
}

const mapReviewRating = (product) => {
  const reviewRating =
    path(['attributes', 'AverageOverallRating'], product) ||
    path(['bazaarVoiceData', 'average'], product)
  return rating(reviewRating)
}

const mapMarkdown = (wasPrice, unitPrice) => {
  if (!wasPrice) {
    return
  }
  const floatWasPrice = parseFloat(wasPrice)
  const markdown = ((floatWasPrice - parseFloat(unitPrice)) / wasPrice) * 100
  return currency(markdown)
}

const mapDepartment = path(['attributes', 'Department'])

const getCategory = (product, pageType, categoryTitle, list) => {
  // return plp categoryTitle if the product is not from one of the carousels
  if (
    pageType === GTM_PAGE_TYPES.PDP_PAGE_TYPE &&
    (list === GTM_LIST_TYPES.PDP_WHY_NOT_TRY ||
      list === GTM_LIST_TYPES.PDP_RECENTLY_VIEWED)
  ) {
    return GTM_PAGE_TYPES.PDP_PAGE_TYPE
  }
  // Using page category title unless the user is not coming from the plp page and page category title is unavailable
  return (
    categoryTitle ||
    getMatchingAttribute(ECMC_PROD_CE3_PRODUCT_TYPE, product.attributes)
  )
}

const getList = (product, productList, pageType, categoryTitle) => {
  switch (pageType) {
    case GTM_PAGE_TYPES.PDP_PAGE_TYPE:
      return path(['list'], product) || productList
    default:
      return categoryTitle
  }
}

export const product = (
  product = {},
  productList = '',
  pageType = '',
  categoryTitle = ''
) => {
  const wasPrice = product.wasWasPrice || product.wasPrice
  const isOnSale = !!product.wasPrice
  const totalSizes = mapTotalSizes(product.items)
  const sizesInStock = mapSizesInStock(product.items)
  // 'list' property exists on a stat.currentProduct object that also goes through the same transformer. If list property doesn't exist, then we're dealing with recentlyViewed product, that doesn't have a list propery, in which case we use productList parameter passed from productImpressions function
  const list = getList(product, productList, pageType, categoryTitle)
  const category = getCategory(product, pageType, categoryTitle, list)
  const sizesAvailable =
    totalSizes > 0 && sizesInStock
      ? (sizesInStock.length / totalSizes) * 100
      : undefined

  return {
    brand: getMatchingAttribute(ECMC_PROD_CE3_BRAND, product.attributes),
    category,
    colour: product.colour,
    department: mapDepartment(product),
    ecmcCategory: product.iscmCategory,
    id: toString(product.lineNumber),
    list,
    markdown: mapMarkdown(wasPrice, product.unitPrice),
    name: `(${product.lineNumber}) ${product.name}`,
    price: currency(product.unitPrice),
    productId: toString(product.productId),
    quantity: toString(product.quantity),
    reviewRating: mapReviewRating(product),
    size: toString(product.size),
    sizesAvailable: percentage(sizesAvailable),
    sizesInStock:
      sizesInStock && !isEmpty(sizesInStock)
        ? sizesInStock.join(',')
        : undefined,
    totalSizes: toString(totalSizes),
    unitNowPrice: currency(product.unitPrice),
    unitWasPrice: currency(wasPrice),
    isOnSale,
  }
}

export const recommendation = (
  recommendation = {},
  currencyCode = '',
  pageType
) => {
  const { prices, title, refCode, productId = '' } = recommendation
  const category = recommendationCategorySelector(pageType, recommendation)
  const list = recommendationListSelector(pageType)
  const price = toString(
    path([currencyCode, 'salePrice'], prices) ||
      path([currencyCode, 'unitPrice'], prices)
  )

  return {
    id: refCode,
    productId,
    name: `(${refCode}) ${title}`,
    price,
    unitNowPrice: price,
    quantity: 1,
    position: 1,
    category,
    list,
  }
}
