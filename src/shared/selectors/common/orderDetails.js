// TODO: Move this file to ../ (main selectors folder) https://arcadiagroup.atlassian.net/browse/PTM-575

import { selectBillingCountry, selectDeliveryCountry } from './accountSelectors'
import { getCheckoutAmount } from '../checkoutSelectors'

export function getOrderDetails(state) {
  return {
    delivery: selectDeliveryCountry(state),
    billing: selectBillingCountry(state),
    amount: getCheckoutAmount(state),
  }
}
