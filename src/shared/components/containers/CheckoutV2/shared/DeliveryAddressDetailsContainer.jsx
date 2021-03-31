import PropTypes from 'prop-types'
import { pathOr } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { selectedDeliveryLocationTypeEquals } from '../../../../selectors/checkoutSelectors'

// components
import DeliveryDetailsForm from './DetailsForm/DeliveryDetailsForm'
import DeliveryAddressForm from './AddressForm/DeliveryAddressForm'
import DeliveryAddressPreviewContainer from './DeliveryAddressPreviewContainer'
import { isMobileBreakpoint } from '../../../../selectors/viewportSelectors'

const mapStateToProps = (state) => ({
  deliveryEditingEnabled: pathOr(
    false,
    ['checkout', 'deliveryAndPayment', 'deliveryEditingEnabled'],
    state
  ),
  isHomeDelivery: selectedDeliveryLocationTypeEquals(state, 'HOME'),
  isMobileBreakpoint: isMobileBreakpoint(state),
})

function DeliveryAddressDetailsContainer(props) {
  const { isHomeDelivery, deliveryEditingEnabled, isMobileBreakpoint } = props

  if (!isHomeDelivery) {
    return null
  }

  return (
    <div className="DeliveryAddressDetailsContainer">
      {deliveryEditingEnabled ? (
        <div>
          <DeliveryDetailsForm renderTelephone={isMobileBreakpoint} />
          <DeliveryAddressForm renderTelephone={!isMobileBreakpoint} />
        </div>
      ) : (
        <DeliveryAddressPreviewContainer />
      )}
    </div>
  )
}

DeliveryAddressDetailsContainer.propTypes = {
  deliveryEditingEnabled: PropTypes.bool,
  isHomeDelivery: PropTypes.bool,
}

export default connect(mapStateToProps)(DeliveryAddressDetailsContainer)
