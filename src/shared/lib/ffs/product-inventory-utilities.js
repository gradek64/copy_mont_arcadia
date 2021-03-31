import { compose, find, path, pathOr, propEq, omit, values } from 'ramda'

/**
 * Helper functions for getActiveProductWithInventory
 */
export const getCatEntryId = (sku, productDataQuantity = {}) =>
  compose(
    pathOr(null, ['skuid']),
    find(propEq('partnumber', sku))
  )(pathOr([], ['SKUs'], productDataQuantity))

export const getInventoryPositions = (catEntryId, productDataQuantity = {}) =>
  find(propEq('catentryId', catEntryId))(
    pathOr([], ['inventoryPositions'], productDataQuantity)
  ) || null

/**
 * Function that returns basket products with mapped inventory details
 *
 * @param {basket} basket either from orderSummary.basket or shoppingBag.bag
 * @returns {array} array of productWithInventory objects
 *
 * @NOTE please refer to productWithInventory.json schema
 *
 * @TODO  EPAM or Cogz to camel-case catentryId from inventoryPositions
 * @TODO  EPAM or Cogz to change type of inventoryPositions.catentryId to number
 */
export const getBasketProductsWithInventory = (basket = {}) => {
  if (!Array.isArray(path(['products'], basket))) return []

  const { products, inventoryPositions = {} } = basket
  return products.map((product) => {
    const inv = find(propEq('catentryId', product.catEntryId.toString()))(
      values(inventoryPositions)
    )
    return inv
      ? {
          ...product,
          inventoryPositions: omit(['partNumber', 'catentryId'], inv),
          sku: inv.partNumber,
        }
      : product
  })
}
