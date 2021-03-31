import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// components
import AddressPreview from '../../../common/AddressPreview/AddressPreview'

// selectors
import {
  getUserAddress,
  getUserDetails,
} from '../../../../selectors/common/accountSelectors'

const mapStateToProps = (state) => ({
  address: getUserAddress(state, 'billingDetails'),
  details: getUserDetails(state, 'billingDetails'),
})

function BillingAddressPreview(props, context) {
  const { address, details, onChangeButtonClick } = props

  const { l } = context

  return (
    <div className="DeliveryAddressPreview">
      <h3 className="DeliveryAddressPreview-title">{l`Billing Details`}</h3>
      <AddressPreview
        address={address}
        details={details}
        onClickChangeButton={onChangeButtonClick}
      />
    </div>
  )
}

BillingAddressPreview.contextTypes = {
  l: PropTypes.func,
}

BillingAddressPreview.propTypes = {
  address: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  onChangeButtonClick: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(BillingAddressPreview)
