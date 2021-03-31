import { createSyncHandler } from '../syncHandlerFactory'
import { syncBag } from '../../../../shared/actions/common/shoppingBagActions'

export const SHOPPING_BAG_SYNC_KEY = 'shoppingBag'

/*
 * 'storedActions' whitelists actions for bag multi-tab synchronisation.
 * 
 * More shopping bag actions can be added if needed. Any action
 * recognised by shoppingBagReducer.js is valid.  
 */

export const shoppingBagSyncHandler = () =>
  createSyncHandler({
    key: SHOPPING_BAG_SYNC_KEY,
    storedActions: [
      'UPDATE_BAG',
      'FETCH_ORDER_SUMMARY_SUCCESS',
      'UPDATE_SHOPPING_BAG_BADGE_COUNT',
    ],
    updateAction: syncBag,
  })
