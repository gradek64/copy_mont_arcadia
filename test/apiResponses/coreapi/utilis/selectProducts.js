/* eslint-disable no-await-in-loop */
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'
import { getPdp } from '../utilis/getPdp'

const productListUriWithPage = `${
  eps.products.productsListingPage.path
}?currentPage=`

const SEARCH_TERM = 'shirts'
const SEARCH_TERM_SALE = 'scarf'
const SEARCH_TERM_BUNDLES = 'bundles'

const PRODUCT_SIMPLE = 'simple'
const PRODUCT_WAS_PRICE = 'wasPrice'
const PRODUCT_COLOUR_SWATCHES = 'colourSwatches'
const PRODUCT_BUNDLES = 'bundles'

const searchForProducts = async (searchTerm = '', page = 1) => {
  let searchResultsArray
  try {
    searchResultsArray = await superagent
      .get(`${productListUriWithPage}${page}`)
      .query({ q: searchTerm })
      .set(headers)
  } catch (e) {
    throw e
  }
  return searchResultsArray.body.products
}

const collectAvailableProducts = async (productType, searchTerm, upToPage) => {
  let pages
  let listOfProducts
  const productsList = []

  if (productType === PRODUCT_SIMPLE) {
    for (pages = 1; pages <= upToPage; pages++) {
      listOfProducts = await searchForProducts(searchTerm, pages)
      listOfProducts.filter(
        (item) => !item.wasPrice && productsList.push(item.productId)
      )
    }
    return productsList
  }

  if (productType === PRODUCT_WAS_PRICE) {
    for (pages = 1; pages <= upToPage; pages++) {
      listOfProducts = await searchForProducts(searchTerm, pages)

      listOfProducts.filter(
        (item) => item.wasPrice && productsList.push(item.productId)
      )
    }
    return productsList
  }

  if (productType === PRODUCT_COLOUR_SWATCHES) {
    for (pages = 1; pages <= upToPage; pages++) {
      listOfProducts = await searchForProducts(searchTerm, pages)
      listOfProducts.filter(
        (item) =>
          item.colourSwatches.length > 0 && productsList.push(item.productId)
      )
    }
    return productsList
  }

  if (productType === PRODUCT_BUNDLES) {
    for (pages = 1; pages <= upToPage; pages++) {
      listOfProducts = await searchForProducts(searchTerm, pages)
      listOfProducts.filter(
        (item) =>
          item.bundleType === 'Flexible' && productsList.push(item.productId)
      )
    }
    return productsList
  }
}

const findSuitableProduct = async (productType, searchTerm, upToPage) => {
  let productId
  let productSku
  let catEntry
  const productQuantity = 1
  const prodsArray = await collectAvailableProducts(
    productType,
    searchTerm,
    upToPage
  )

  for (let prodIndex = 0; prodIndex < prodsArray.length; prodIndex++) {
    const pdp = await getPdp(prodsArray[prodIndex])
    const item = pdp.items.find((item) => item.quantity >= 5)
    if (item) {
      productId = pdp.productId
      productSku = item.sku
      catEntry = item.catEntryId
      break
    }
  }

  return {
    productId,
    productSku,
    productQuantity,
    catEntry,
  }
}

export const getProducts = async () => {
  let productsSimpleId
  let productsWasPriceId
  let productsColourSwatchesId
  let productsFlexibleId

  try {
    productsSimpleId = await findSuitableProduct(
      PRODUCT_SIMPLE,
      SEARCH_TERM,
      10
    )
    productsWasPriceId = await findSuitableProduct(
      PRODUCT_WAS_PRICE,
      SEARCH_TERM_SALE,
      10
    )
    productsColourSwatchesId = await findSuitableProduct(
      PRODUCT_COLOUR_SWATCHES,
      SEARCH_TERM,
      10
    )
    productsFlexibleId = await findSuitableProduct(
      PRODUCT_BUNDLES,
      SEARCH_TERM_BUNDLES,
      10
    )
  } catch (e) {
    throw e
  }
  return {
    productsSimpleId,
    productsWasPriceId,
    productsColourSwatchesId,
    productsFlexibleId,
  }
}
