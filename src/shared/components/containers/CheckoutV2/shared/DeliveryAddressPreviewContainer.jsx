import React from 'react'
import AddressPreview from '../../../common/AddressPreview/AddressPreview'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { pluck, pathOr } from 'ramda'
import { setDeliveryEditingEnabled } from '../../../../actions/common/checkoutActions'
import CheckoutTitle from './CheckoutTitle'

const mapStateToProps = (state) => ({
  address: pluck(
    'value',
    pathOr({}, ['forms', 'checkout', 'yourAddress', 'fields'], state)
  ),
  details: pluck(
    'value',
    pathOr({}, ['forms', 'checkout', 'yourDetails', 'fields'], state)
  ),
})

const mapDispatchToProps = {
  setDeliveryEditingEnabled,
}

function DeliveryAddressPreviewContainer(props, context) {
  const { address, details, setDeliveryEditingEnabled } = props
  const { l } = context
  return (
    <div className="DeliveryAddressPreviewContainer">
      <CheckoutTitle separator>{l`Delivery Details`}</CheckoutTitle>
      <div className="DeliveryAddressPreviewContainer-preview">
        <AddressPreview
          details={details}
          address={address}
          onClickChangeButton={() => setDeliveryEditingEnabled(true)}
          rightAlignedButton
        />
      </div>
    </div>
  )
}

DeliveryAddressPreviewContainer.contextTypes = {
  l: PropTypes.func,
}

DeliveryAddressPreviewContainer.propTypes = {
  address: PropTypes.object,
  details: PropTypes.object,
  setDeliveryEditingEnabled: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryAddressPreviewContainer)
