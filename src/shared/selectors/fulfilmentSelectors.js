import { createSelector } from 'reselect'
import { isCFSIToday } from '../lib/get-delivery-days/isCfsi'
import {
  getActiveProductWithInventory,
  getCheckoutOrderSummaryProductsWithInventory,
} from './inventorySelectors'

const isBasketCFSI = createSelector(
  [
    // @TODO no need to use inventory selectors for CFSI Today
    getCheckoutOrderSummaryProductsWithInventory,
    (state, storeDetails) => storeDetails,
  ],
  (products, storeDetails) => {
    return (
      products.length >= 1 &&
      products.reduce(
        (basketCFSToday, product) =>
          basketCFSToday && isCFSIToday(product, storeDetails),
        true
      )
    )
  }
)

const isActiveProductCFSI = createSelector(
  [
    // @TODO no need to use inventory selectors for CFSI Today
    getActiveProductWithInventory,
    (state, storeDetails) => storeDetails,
  ],
  (activeProduct, storeDetails) => {
    return isCFSIToday(activeProduct, storeDetails)
  }
)

export const isCFSIAvailable = (state, storeDetails, storeLocatorType) => {
  return storeLocatorType === 'collectFromStore'
    ? isBasketCFSI(state, storeDetails)
    : isActiveProductCFSI(state, storeDetails)
}
