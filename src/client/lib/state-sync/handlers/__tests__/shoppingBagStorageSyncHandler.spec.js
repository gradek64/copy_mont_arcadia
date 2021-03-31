import { shoppingBagSyncHandler } from '../shoppingBagSyncHandler'
import * as syncHandlerFactory from '../../syncHandlerFactory'
import * as shoppingBagActions from '../../../../../shared/actions/common/shoppingBagActions'

describe('shoppingBagSyncHandler', () => {
  it('should call createSyncHandler with a correct config', () => {
    const createSyncHandlerSpy = jest.spyOn(
      syncHandlerFactory,
      'createSyncHandler'
    )
    shoppingBagSyncHandler()
    expect(createSyncHandlerSpy).toHaveBeenCalledWith({
      key: 'shoppingBag',
      storedActions: [
        'UPDATE_BAG',
        'FETCH_ORDER_SUMMARY_SUCCESS',
        'UPDATE_SHOPPING_BAG_BADGE_COUNT',
      ],
      updateAction: expect.any(Function),
    })
  })

  it('should call the updateAction', () => {
    const syncBagSpy = jest.spyOn(shoppingBagActions, 'syncBag')
    const syncHandler = shoppingBagSyncHandler()
    syncHandler.updateAction()
    expect(syncBagSpy).toHaveBeenCalledTimes(1)
  })
})
