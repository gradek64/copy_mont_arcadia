import React, { Component } from 'react'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import ShippingPreferencesSelector from '../../common/ShippingPreferencesSelector/ShippingPreferencesSelector'

@analyticsDecorator('change-shipping-destination')
class ChangeShippingDestination extends Component {
  render() {
    return (
      <section className="ChangeShippingDestination">
        <ShippingPreferencesSelector />
      </section>
    )
  }
}

export default ChangeShippingDestination
