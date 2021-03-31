import React from 'react'
import { getFormNames } from '../../lib/checkout-utilities/utils'
import { shouldRedirectForDelivery } from '../../lib/geo-ip-utils'
import { getSiteDeliveryISOs } from '../../selectors/configSelectors'
import { showModal } from './modalActions'
import { selectDeliveryCountry } from './checkoutActions'
import { setFormField } from './formActions'
import { validateDDPForCountry } from './ddpActions'
import { updateShippingDestination } from './shippingDestinationActions'
import ShippingRedirectModal from '../../components/common/ShippingRedirectModal/ShippingRedirectModal'

export function setCountry(addressType, country, isQubitExperience = false) {
  return (dispatch, getState) => {
    const state = getState()
    const formNames = getFormNames(addressType)
    const shouldShowModal =
      ['addressBook', 'deliveryCheckout', 'deliveryMCD'].includes(
        addressType
      ) && shouldRedirectForDelivery(country, getSiteDeliveryISOs(state))

    if (shouldShowModal) {
      return dispatch(
        showModal(<ShippingRedirectModal country={country} />, {
          mode: 'sessionTimeout',
        })
      )
    }

    if (addressType === 'deliveryCheckout') {
      dispatch(updateShippingDestination(country))
      dispatch(validateDDPForCountry(country))
      dispatch(selectDeliveryCountry(country, isQubitExperience))
    }

    dispatch(setFormField(formNames.address, 'state', ''))
    dispatch(setFormField(formNames.address, 'country', country))
  }
}
