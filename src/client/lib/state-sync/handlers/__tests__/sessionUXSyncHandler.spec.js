import { sessionUXSyncHandler } from '../sessionUXSyncHandler'
import * as syncHandlerFactory from '../../syncHandlerFactory'

describe('sessionSyncHandler', () => {
  it('should call createSyncHandler with a correct config', () => {
    const createSyncHandlerSpy = jest.spyOn(
      syncHandlerFactory,
      'createSyncHandler'
    )
    sessionUXSyncHandler()
    expect(createSyncHandlerSpy).toHaveBeenCalledWith({
      key: 'sessionUX',
      storageType: 'sessionStorage',
      storedActions: ['DISMISS_RECENTLY_VIEWED_TAB'],
    })
  })
})
