import { createSelector } from 'reselect'
import { pathOr } from 'ramda'
import {
  getShoppingBagProductsWithInventory,
  isStandardDeliveryOnlyProduct,
} from './inventorySelectors'

const rootSelector = (state) => state.shoppingBag || {}

export const isMinibagOpen = (state) => {
  const { miniBagOpen } = rootSelector(state)

  return miniBagOpen
}

export const getShoppingBag = (state) => {
  const { bag } = rootSelector(state)

  return bag || {}
}

export const getShoppingBagTotal = (state) => {
  const { total } = getShoppingBag(state)

  return total ? Number(total) : 0
}

export const getShoppingBagSubTotal = (state) => {
  const { subTotal } = getShoppingBag(state)

  return subTotal ? Number(subTotal) : 0
}

export const isZeroValueBag = (state) => {
  return getShoppingBagTotal(state) === 0
}

export const getShoppingBagProducts = (state) => {
  const { products } = getShoppingBag(state)

  return products || []
}

export const getShoppingBagProduct = createSelector(
  [getShoppingBagProducts, (state, productId) => productId],
  (products, productId) =>
    products.find((product) => product.productId === productId)
)

export const getShoppingBagOrderId = (state) => {
  const { orderId } = getShoppingBag(state)

  return orderId
}

export const getShoppingBagTotalItems = (state) => {
  const { totalItems } = rootSelector(state)

  return totalItems
}

export const isShoppingBagEmpty = (state) => {
  return getShoppingBagTotalItems(state) <= 0
}

export const isShoppingBagLoading = (state) => {
  const { loadingShoppingBag } = rootSelector(state)

  return loadingShoppingBag
}

export const bagContainsDDPProduct = createSelector(
  getShoppingBagProducts,
  (products) =>
    products.reduce((rv, product) => rv || product.isDDPProduct, false)
)

export const bagContainsOnlyDDPProduct = (state) =>
  getShoppingBagTotalItems(state) === 1 && bagContainsDDPProduct(state)

export const bagContainsOutOfStockProduct = createSelector(
  getShoppingBagProducts,
  (products) =>
    products.filter((product) => product.inStock === false).length > 0
)

export const bagContainsPartiallyOutOfStockProduct = createSelector(
  getShoppingBagProducts,
  (products) =>
    products.filter((product) => product.exceedsAllowedQty).length > 0
)

export const bagContainsStandardDeliveryOnlyProduct = createSelector(
  getShoppingBagProductsWithInventory,
  (products) =>
    Array.isArray(products) &&
    products.filter((product) => isStandardDeliveryOnlyProduct(product))
      .length > 0
)

export function getPromoCodeConfirmation(state) {
  const { promotionCodeConfirmation } = rootSelector(state)

  return promotionCodeConfirmation
}

export function getAppliedPromotions(state) {
  const { promotions } = getShoppingBag(state)

  return promotions
}

export const isBasketTotalCoveredByGiftCards = (state) => {
  const shoppingBag = getShoppingBag(state)
  return shoppingBag.isOrderCoveredByGiftCards || false
}

export const calculateBagDiscount = (state) => {
  const bagDiscounts = pathOr([], ['shoppingBag', 'bag', 'discounts'], state)
  return bagDiscounts.reduce((pre, cur) => {
    return pre + parseFloat(cur.value)
  }, 0)
}

export const isAddingToBag = (state) =>
  pathOr(false, ['shoppingBag', 'isAddingToBag'], state)

export const getDeliveryMessageThresholds = (state) => {
  const shoppingBag = getShoppingBag(state)

  return shoppingBag.deliveryMessageThresholds || {}
}
