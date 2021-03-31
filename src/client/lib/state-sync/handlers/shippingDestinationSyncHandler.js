import { createSyncHandler } from '../syncHandlerFactory'

export const SHIPPING_DESTINATION_SYNC_KEY = 'shippingDestination'

export const shippingDestinationSyncHandler = () =>
  createSyncHandler({
    key: SHIPPING_DESTINATION_SYNC_KEY,
    storedActions: ['SET_SHIPPING_DESTINATION', 'SET_LANGUAGE'],
  })
