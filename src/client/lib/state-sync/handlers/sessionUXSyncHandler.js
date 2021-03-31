import { createSyncHandler } from '../syncHandlerFactory'

export const sessionUXSyncHandler = () =>
  createSyncHandler({
    key: 'sessionUX',
    storedActions: ['DISMISS_RECENTLY_VIEWED_TAB'],
    storageType: 'sessionStorage',
  })
