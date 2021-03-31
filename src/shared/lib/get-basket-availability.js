import { getFulfilmentDetails } from './get-delivery-days/get-fulfilments'
import { getNumberOfDaysFromNow } from './get-delivery-days/utils'
import { getBasketProductsWithInventory } from './ffs/product-inventory-utilities'

export const deliveryDays = (basket = {}, store = {}) => {
  if (typeof basket !== 'object' || !Array.isArray(basket.products)) return {}
  const products = getBasketProductsWithInventory(basket)

  return products.reduce(
    (deliveryDays, product) => {
      const {
        CFSiDay,
        expressDeliveryDay,
        homeExpressDeliveryDay,
        parcelCollectDay,
      } = getFulfilmentDetails(product, store)
      const daysFromNow = getNumberOfDaysFromNow(CFSiDay)
      if (!CFSiDay) {
        deliveryDays.CFSiDay = ''
      }
      if (deliveryDays.CFSiDay && daysFromNow > deliveryDays.daysFromNow) {
        deliveryDays.daysFromNow = daysFromNow
        deliveryDays.CFSiDay = CFSiDay
      }
      if (!expressDeliveryDay) {
        deliveryDays.expressDeliveryDay = false
      }
      if (!homeExpressDeliveryDay) {
        deliveryDays.homeExpressDeliveryDay = false
      }
      if (!parcelCollectDay) {
        deliveryDays.parcelCollectDay = false
      }
      return deliveryDays
    },
    {
      CFSiDay: 'today',
      daysFromNow: 0,
      expressDeliveryDay: true,
      homeExpressDeliveryDay: true,
      parcelCollectDay: true,
    }
  )
}
