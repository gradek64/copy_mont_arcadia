import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { PrivacyGuard } from '../../../lib'

export default class OrderHistoryDetailsSummary extends Component {
  static propTypes = {
    deliveryPrice: PropTypes.string,
    totalOrderPrice: PropTypes.string,
    isDDPOrder: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  render() {
    const { l, p } = this.context
    const { deliveryPrice, totalOrderPrice, isDDPOrder } = this.props
    if (!totalOrderPrice && !deliveryPrice) return null
    return (
      <section className="OrderHistoryDetailsSummary">
        {!isDDPOrder && (
          <p className="OrderHistoryDetailsSummary-prices">
            <strong className="OrderHistoryDetailsSummary-left">
              {l`Delivery`}:
            </strong>
            <PrivacyGuard>
              <span className="OrderHistoryDetailsSummary-right">
                {p(deliveryPrice)}
              </span>
            </PrivacyGuard>
          </p>
        )}
        <p className="OrderHistoryDetailsSummary-prices">
          <strong className="OrderHistoryDetailsSummary-left">
            {l`Total`}:
          </strong>
          <PrivacyGuard>
            <span className="OrderHistoryDetailsSummary-right">
              {p(totalOrderPrice)}
            </span>
          </PrivacyGuard>
        </p>
      </section>
    )
  }
}
