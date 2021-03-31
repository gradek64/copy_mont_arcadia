import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { PrivacyGuard } from '../../../lib'

export default class OrderHistoryDetailsDelivery extends Component {
  static propTypes = {
    deliveryMethod: PropTypes.string,
    deliveryCarrier: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const { deliveryMethod, deliveryCarrier } = this.props

    return (
      <section className="OrderHistoryDetailsDelivery">
        {deliveryMethod && (
          <p className="OrderHistoryDetailsDelivery-text">
            {l`Delivery method`}:{' '}
            <PrivacyGuard>
              <span>{deliveryMethod}</span>
            </PrivacyGuard>
          </p>
        )}
        {deliveryCarrier && (
          <p className="OrderHistoryDetailsDelivery-text">
            {l`Carrier`}:{' '}
            <PrivacyGuard>
              <span>{deliveryCarrier}</span>
            </PrivacyGuard>
          </p>
        )}
      </section>
    )
  }
}
