import { omit, path, pathOr } from 'ramda'
import { createSelector } from 'reselect'
import { getCurrentProduct, getProductDetail } from './productSelectors'
import {
  getCatEntryId,
  getInventoryPositions,
  getBasketProductsWithInventory,
} from '../lib/ffs/product-inventory-utilities'

// Check if out of stock Sizes
export const checkIfOOS = (productItems) =>
  !(
    productItems &&
    productItems.length &&
    productItems.some((item) => item.quantity > 0)
  )

/**
 * Selector function that returns the active product and inventory details
 * @NOTE please refer to productWithInventory.json schema
 */
export const getActiveProductWithInventory = createSelector(
  getCurrentProduct,
  getProductDetail,
  (currentProduct, productDetail) => {
    const productDataQuantity = path(['productDataQuantity'], currentProduct)
    const activeItemSKU = path(['activeItem', 'sku'], productDetail)
    const catEntryId = getCatEntryId(activeItemSKU, productDataQuantity)

    return activeItemSKU && catEntryId
      ? {
          catEntryId,
          inventoryPositions: omit(
            ['catentryId'],
            getInventoryPositions(catEntryId, productDataQuantity)
          ),
          name: path(['name'], currentProduct),
          productId: path(['productId'], currentProduct),
          quantity: path(['selectedQuantity'], productDetail),
          size: path(['activeItem', 'size'], productDetail),
          sku: activeItemSKU,
        }
      : null
  }
)

export const getShoppingBagProductsWithInventory = createSelector(
  (state) => pathOr({}, ['shoppingBag', 'bag'], state),
  (bag) => getBasketProductsWithInventory(bag)
)

export const getCheckoutOrderSummaryProductsWithInventory = createSelector(
  (state) => pathOr({}, ['checkout', 'orderSummary', 'basket'], state),
  (bag) => getBasketProductsWithInventory(bag)
)

export const getDCInventoryForProduct = (product) =>
  pathOr([], ['inventoryPositions', 'inventorys'], product)

export const getStoreInventoryForProduct = (product) =>
  pathOr([], ['inventoryPositions', 'invavls'], product)

export const getDCStockQuantityForProduct = createSelector(
  getDCInventoryForProduct,
  (inventory) =>
    inventory.reduce((total, { quantity = 0 }) => total + quantity, 0)
)

export const getStoreStockQuantityForProduct = createSelector(
  getStoreInventoryForProduct,
  (inventory) =>
    inventory.reduce((total, { quantity = 0 }) => total + quantity, 0)
)

export const getTotalStockQuantityForProduct = (state) =>
  getDCStockQuantityForProduct(state) + getStoreStockQuantityForProduct(state)

export const isStandardDeliveryOnlyProduct = (inventory) => {
  const { inStock, exceedsAllowedQty, quantity = 0 } = inventory

  const bagQuantity = inStock && !exceedsAllowedQty && quantity
  const stockQuantity = getDCStockQuantityForProduct(inventory)

  return bagQuantity > stockQuantity
}
