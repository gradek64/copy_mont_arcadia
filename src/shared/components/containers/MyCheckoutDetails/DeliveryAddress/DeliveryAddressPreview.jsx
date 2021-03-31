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
  address: getUserAddress(state, 'deliveryDetails'),
  details: getUserDetails(state, 'deliveryDetails'),
})

function DeliveryAddressPreview(props, context) {
  const { address, details, onChangeButtonClick } = props

  const { l } = context

  return (
    <div className="DeliveryAddressPreview">
      <h3 className="DeliveryAddressPreview-title">{l`Delivery Details`}</h3>
      <AddressPreview
        address={address}
        details={details}
        onClickChangeButton={onChangeButtonClick}
      />
    </div>
  )
}

DeliveryAddressPreview.contextTypes = {
  l: PropTypes.func,
}

DeliveryAddressPreview.propTypes = {
  address: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  onChangeButtonClick: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(DeliveryAddressPreview)
