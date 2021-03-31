import { path } from 'ramda'

import { detailsFragment } from './logon'
import { savedAddressFragment, creditCardFragment } from './orderSummary'

const addDeliveryAddressTransform = (body = {}) => {
  const savedAddresses = path(['deliveryoptionsform', 'savedAddresses'], body)

  return {
    deliveryDetails: detailsFragment(
      path(['deliveryoptionsform', 'deliveryDetails'], body)
    ),
    billingDetails: detailsFragment(
      path(['OrderCalculateForm', 'billingDetails'], body)
    ),
    creditCard: creditCardFragment(
      path(['OrderCalculateForm', 'CreditCard'], body)
    ),
    savedAddresses: Array.isArray(savedAddresses)
      ? savedAddresses.map(savedAddressFragment)
      : [],
  }
}

export default addDeliveryAddressTransform
