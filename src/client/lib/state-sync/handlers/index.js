import { shippingDestinationSyncHandler } from './shippingDestinationSyncHandler'
import { shoppingBagSyncHandler } from './shoppingBagSyncHandler'
import { sessionUXSyncHandler } from './sessionUXSyncHandler'

export default {
  sessionUX: sessionUXSyncHandler(),
  shippingDestination: shippingDestinationSyncHandler(),
  shoppingBag: shoppingBagSyncHandler(),
}
