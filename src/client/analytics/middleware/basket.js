import { zip } from 'ramda'
import dataLayer from '../../../shared/analytics/dataLayer'
import { addStateListeners } from '../storeObserver'
import {
  addPreDispatchListeners,
  addPostDispatchListeners,
} from './analytics-middleware'
import * as DataMapper from './data-mapper'
import { getShoppingBagProducts } from '../../../shared/selectors/shoppingBagSelectors'
import { getCurrencyCode } from '../../../shared/selectors/configSelectors'
import transformBasket from '../transforms/basket'

export const listeners = {
  pause: true,
  pauseTimer: null,
}

export const mergingState = {
  isMergingBag: false,
}

const padArraysWithUndefined = (oldProducts, newProducts) => {
  oldProducts = oldProducts.slice()
  newProducts = newProducts.slice()
  const maxLen = () => Math.max(oldProducts.length, newProducts.length)
  const isSameProduct = (a = {}, b = {}) => a.productId === b.productId
  let i = 0

  // Make both arrays the same length by inserting `undefined` elements
  // where products have been added or removed
  while (i < maxLen()) {
    if (!oldProducts[i]) {
      oldProducts[i] = undefined
    } else if (!isSameProduct(oldProducts[i], newProducts[i])) {
      newProducts.splice(i, 0, undefined)
    }
    i++
  }

  return [oldProducts, newProducts]
}

/**
 * Compares 2 products arrays and returns an array of differences
 *
 * @param oldProducts {Array<Product>}
 * @param newProducts {Array<Product>}
 * @return {Array} an array of products that have changed. Each has additional `$status` property which is either:
 *   'added', 'removed', 'increased' or 'decreased'
 *   If the `$status` is either 'increased' or 'decreased' then the `quantity` is the amount it has changed by
 */
export const productsDiff = (oldProducts, newProducts) => {
  ;[oldProducts, newProducts] = padArraysWithUndefined(oldProducts, newProducts)

  // build an array of pairs of old and new products
  return (
    zip(oldProducts, newProducts)
      // compare the products in each pair and build up an array of differences
      .reduce((diffs, [oldProduct, newProduct]) => {
        if (!oldProduct && newProduct) {
          diffs.push({ ...newProduct, $status: 'added' })
        } else if (oldProduct && !newProduct) {
          diffs.push({ ...oldProduct, $status: 'removed' })
        } else if (oldProduct.orderItemId !== newProduct.orderItemId) {
          diffs = diffs.concat([
            { ...newProduct, $status: 'added' },
            { ...oldProduct, $status: 'removed' },
          ])
        } else if (oldProduct.quantity < newProduct.quantity) {
          diffs.push({
            ...newProduct,
            quantity: newProduct.quantity - oldProduct.quantity,
            $status: 'increased',
          })
        } else if (oldProduct.quantity > newProduct.quantity) {
          diffs.push({
            ...oldProduct,
            quantity: oldProduct.quantity - newProduct.quantity,
            $status: 'decreased',
          })
        }
        return diffs
      }, [])
  )
}

const getMergedProductsData = (products = [], productsToMerge = []) =>
  products.map((product) => {
    const { productId } = product
    // eslint-disable-next-line no-restricted-syntax
    for (const productToMerge of productsToMerge) {
      if (productToMerge && productToMerge.productId === productId) {
        return {
          ...product,
          colour: productToMerge.colour,
          items: productToMerge.items,
          attributes: productToMerge.attributes,
        }
      }
    }
    return product
  })

export const clearBasketStateListenerPause = () => {
  if (!listeners.pause) {
    return
  }

  listeners.pause = false

  if (listeners.pauseTimer) {
    clearTimeout(listeners.pauseTimer)
    listeners.pauseTimer = null
  }
}

export const pauseBasket = (action, store) => {
  // Pausing the listener only if we logout. Like this we are able to trigger
  // events fir merge, add and remove from bag and increase and decrease the quantity of a product
  // in the shopping bag, but we do not trigger the removeFromBasket action when logging out
  listeners.pause = action.type === 'LOGOUT'

  // pause fallback
  listeners.pauseTimer = setTimeout(() => {
    clearBasketStateListenerPause(action, store)
  }, 0)
}

export const basketStateListener = (oldState = {}, newState) => {
  if (listeners.pause) {
    return
  }

  // We do not get back the `attributes` for shopping bag products,
  // though we mostly have the data available already inside the store
  // so we are merging it with that. Either with PDP or PLP -> QuickView.
  const { currentProduct: pdpProduct, quickview } = newState
  const quickViewProduct = quickview && quickview.product
  const mergeProductData = (products) =>
    getMergedProductsData(products, [pdpProduct, quickViewProduct])

  const oldProducts = getShoppingBagProducts(oldState)
  const newProducts = getShoppingBagProducts(newState)
  const currencyCode = getCurrencyCode(newState)

  const diff = productsDiff(oldProducts, newProducts)
  const removedFromBasket = diff.filter(
    (product) =>
      product.$status === 'removed' || product.$status === 'decreased'
  )
  const addedToBasket = diff.filter(
    (product) => product.$status === 'added' || product.$status === 'increased'
  )

  if (removedFromBasket.length > 0) {
    dataLayer.push(
      {
        ecommerce: {
          currencyCode,
          remove: {
            products: mergeProductData(removedFromBasket).map((product) =>
              DataMapper.product(product)
            ),
          },
        },
        fullBasket: transformBasket(newState),
      },
      'basketSchema',
      'removeFromBasket'
    )
  }

  if (addedToBasket.length > 0) {
    const { isMergingBag } = mergingState
    dataLayer.push(
      {
        ecommerce: {
          currencyCode,
          add: {
            actionField: {
              addType: isMergingBag ? 'Merge Bag' : 'Add to Basket',
            },
            products: mergeProductData(addedToBasket).map((product) =>
              DataMapper.product(product)
            ),
          },
        },
        fullBasket: transformBasket(newState),
      },
      'basketSchema',
      isMergingBag ? 'mergeBag' : 'addToBasket'
    )
  }
}

export const startMerging = () => {
  mergingState.isMergingBag = true
}

export const endMerging = () => {
  mergingState.isMergingBag = false
}

export default () => {
  addStateListeners(basketStateListener)

  // On intial app load, we need to wait for the 'is the user logged in' process to finish otherwise
  // if they are and have pre-populated bag items, an addToBag event will be triggered
  addPostDispatchListeners(
    ['UPDATE_BAG', 'NO_BAG'],
    clearBasketStateListenerPause
  )

  // we want to be able to distinguish when products are added via a bag merge
  addPostDispatchListeners('BAG_MERGE_STARTED', startMerging)
  addPostDispatchListeners('BAG_MERGE_FINISHED', endMerging)

  // This RESET_FORM happens at the end of checkout process and prevents the clearing of the bag
  // from triggering a removeFromBasket event
  addPostDispatchListeners(
    'RESET_FORM',
    (action, store) =>
      action.formName === 'billingCardDetails' && pauseBasket(action, store)
  )

  // Prevents the emptying of the bag from a logout from triggering a removeFromBasket event
  addPreDispatchListeners('LOGOUT', pauseBasket)

  // The bag is cleared momentarily when going to the checkout process so this prevents a
  // removeFromBag event
  addPreDispatchListeners('FETCH_ORDER_SUMMARY_SUCCESS', pauseBasket)
}
