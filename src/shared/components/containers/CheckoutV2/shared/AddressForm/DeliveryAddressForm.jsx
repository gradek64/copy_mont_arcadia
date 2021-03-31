import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { selectDeliveryCountry } from '../../../../../actions/common/checkoutActions'

import AddressForm from '../../../../common/AddressForm/AddressForm'

class DeliveryAddressForm extends PureComponent {
  render() {
    return (
      <AddressForm
        addressType="deliveryCheckout"
        titleHidden
        onSelectCountry={this.props.selectDeliveryCountry}
      />
    )
  }
}

const mapDispatchToProps = {
  selectDeliveryCountry,
}

export default connect(
  null,
  mapDispatchToProps
)(DeliveryAddressForm)

export { DeliveryAddressForm as WrappedDeliveryAddressForm, mapDispatchToProps }
