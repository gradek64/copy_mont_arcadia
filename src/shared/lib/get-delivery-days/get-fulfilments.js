import { isNonEmptyObject } from './utils'
import { getDCDeliveryDay } from './get-dc-deliveryday'
import { getExpressDeliveryDay } from './get-express'
import { isCFSIToday } from './isCfsi'
/**
 * Function that returns product delivery availability
 *
 * @param {Object} product mapped product with its inventory details, refer to ProductInventory schema
 * @param {Object} store
 * @returns {Object}
 *
 *  Delivery Precedence
 *  StoreExpress - store with express, DC
 *  Home express - DC, store express
 *  ParcelShop - from DC
 */
export function getFulfilmentDetails(product = {}, store = {}) {
  if (!isNonEmptyObject(product)) return null

  const DCDeliveryDay = getDCDeliveryDay(product) // express from DC (warehouse)
  const expressDeliveryDay = getExpressDeliveryDay(product) || DCDeliveryDay // express from store inventory
  const CFSiDay = isCFSIToday(product, store) ? 'today' : expressDeliveryDay

  return {
    CFSiDay,
    expressDeliveryDay,
    homeExpressDeliveryDay: DCDeliveryDay || expressDeliveryDay,
    parcelCollectDay: DCDeliveryDay,
  }
}
