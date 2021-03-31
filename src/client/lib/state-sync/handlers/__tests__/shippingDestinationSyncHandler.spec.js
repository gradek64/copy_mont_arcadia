import {
  SHIPPING_DESTINATION_SYNC_KEY,
  shippingDestinationSyncHandler,
} from '../shippingDestinationSyncHandler'
import * as syncHandlerFactory from '../../syncHandlerFactory'

describe('shippingDestinationSyncHandler', () => {
  it('should call createSyncHandler with a correct config', () => {
    const spy = jest.spyOn(syncHandlerFactory, 'createSyncHandler')
    shippingDestinationSyncHandler()
    expect(spy).toHaveBeenCalledWith({
      key: SHIPPING_DESTINATION_SYNC_KEY,
      storedActions: ['SET_SHIPPING_DESTINATION', 'SET_LANGUAGE'],
    })
  })
})
