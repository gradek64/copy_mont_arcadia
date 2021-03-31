import { is, omit } from 'ramda'
import { browserHistory } from 'react-router'
import { getLocation } from '../selectors/routingSelectors'

const shouldTransferShoppingBag = function shouldTransferShoppingBag(
  transferStoreID,
  transferOrderID
) {
  return is(Number)(transferStoreID) && transferOrderID > 0
}

const removeTransferShoppingBagParams = (state) => {
  const { pathname, query } = getLocation(state)
  browserHistory.replace({
    pathname,
    query: omit(['transferStoreID', 'transferOrderID'], query),
  })
}

export { shouldTransferShoppingBag, removeTransferShoppingBagParams }
