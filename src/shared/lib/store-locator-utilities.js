import {
  both,
  compose,
  has,
  keys,
  pickBy,
  pathEq,
  path,
  isEmpty,
  pluck,
} from 'ramda'
import { getBasketProductsWithInventory } from '../lib/ffs/product-inventory-utilities'

export const getSelectedFilters = compose(
  keys,
  pickBy(pathEq(['selected'], true))
)
export const getAppliedFilters = compose(
  keys,
  pickBy(pathEq(['applied'], true))
)

/* Function that returns a string containing all product sku numbers
 * {product1Sku},{product2Sku},... */
export const getSkuList = (basket) => {
  const products = getBasketProductsWithInventory(basket)
  return products
    .reduce(
      (result, product) =>
        has('sku')(product) ? [...result, `${product.sku}`] : result,
      []
    )
    .join(',')
}

/* Function that returns a string in the following format
 * {productSku}:{productQuantity},... */
export const getBasketDetails = (basket) => {
  const products = getBasketProductsWithInventory(basket)
  return products
    .reduce(
      (result, product) =>
        both(has('sku'), has('quantity'))(product)
          ? [...result, `${product.sku}:${product.quantity}`]
          : result,
      []
    )
    .join(',')
}

export const shouldFetchBagStock = (
  basket = {},
  deliveryStoreDetails = {},
  storeId = ''
) => {
  const products = getBasketProductsWithInventory(basket)
  if (isEmpty(products) || !storeId) return false
  if (isEmpty(deliveryStoreDetails) || deliveryStoreDetails.storeId !== storeId)
    return true
  return (
    !!path(['stockList'], deliveryStoreDetails) &&
    !products.every((product) =>
      pluck('sku', deliveryStoreDetails.stockList).includes(product.sku)
    )
  )
}
