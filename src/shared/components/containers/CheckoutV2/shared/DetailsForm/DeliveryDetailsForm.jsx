import PropTypes from 'prop-types'
import React from 'react'

import AddressFormDetails from '../../../../common/AddressFormDetails/AddressFormDetails'
import CheckoutPrimaryTitle from '../CheckoutPrimaryTitle'

const DeliveryDetailsForm = (props, { l }) => {
  const { bagContainsOnlyDDPProduct, showDDPAddressModal, isCollection } = props
  const title = isCollection ? 'Collection Details' : 'Delivery Address'
  return (
    <div className="DeliveryDetailsForm">
      <CheckoutPrimaryTitle isAugmented title={l(title)} />
      {bagContainsOnlyDDPProduct && (
        <button
          onClick={showDDPAddressModal}
          className="DeliveryDetailsForm-link"
        >
          {l('Why we need this')}
        </button>
      )}
      <AddressFormDetails addressType="deliveryCheckout" titleHidden />
    </div>
  )
}

DeliveryDetailsForm.propTypes = {
  showDDPAddressModal: PropTypes.func.isRequired,
  bagContainsOnlyDDPProduct: PropTypes.bool,
  isCollection: PropTypes.bool,
}

DeliveryDetailsForm.defaultProps = {
  bagContainsOnlyDDPProduct: false,
  isCollection: false,
}

DeliveryDetailsForm.contextTypes = {
  l: PropTypes.func,
}

export default DeliveryDetailsForm
