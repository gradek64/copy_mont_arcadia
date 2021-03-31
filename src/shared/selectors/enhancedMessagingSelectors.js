import { createSelector } from 'reselect'
import { pathOr } from 'ramda'
import { getShoppingBagProductsWithInventory } from './inventorySelectors'

export const getExpressDeliveryAvailableForProducts = createSelector(
  getShoppingBagProductsWithInventory,
  (products) =>
    products.map((product) => ({
      catEntryId: product.catEntryId,
      available:
        pathOr(
          0,
          ['inventoryPositions', 'inventorys', '0', 'quantity'],
          product
        ) > product.quantity,
    }))
)
