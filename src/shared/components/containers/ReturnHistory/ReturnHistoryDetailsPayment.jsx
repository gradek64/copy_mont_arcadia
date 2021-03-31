import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PrivacyGuard } from '../../../lib'
import Image from '../../common/Image/Image'

export default class ReturnHistoryDetailsPayment extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  renderPaymentMethod = (
    { cardNumberStar, paymentMethod, totalCost, icon },
    index
  ) => {
    const { l } = this.context
    return (
      <div
        className="ReturnHistoryDetailsPayment-paymentMethodContainer"
        key={index}
      >
        <Image
          className="ReturnHistoryDetailsPayment-icon"
          src={
            icon
              ? `/assets/common/images/${icon}`
              : '/assets/{brandName}/images/credit-card.svg'
          }
        />
        <div>
          <div className="ReturnHistoryDetailsPayment-paymentInfo">
            {l`Payment method`}:{' '}
            <PrivacyGuard>
              <span>{paymentMethod}</span>
            </PrivacyGuard>
          </div>
          {cardNumberStar && (
            <div className="ReturnHistoryDetailsPayment-paymentInfo">
              {l`Card Number`}:{' '}
              <PrivacyGuard>
                <span>{cardNumberStar}</span>
              </PrivacyGuard>
            </div>
          )}
          <div className="ReturnHistoryDetailsPayment-paymentInfo">
            {l`Credited`}:{' '}
            <PrivacyGuard>
              <span>{totalCost}</span>
            </PrivacyGuard>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { paymentDetails } = this.props
    if (!Array.isArray(paymentDetails)) return null

    const { l } = this.context

    return (
      <div className="ReturnHistoryDetailsPayment-container">
        <div className="ReturnHistoryDetailsPayment-header">{l`Payment details`}</div>
        {paymentDetails.map(this.renderPaymentMethod)}
        <div className="ReturnHistoryDetailsPayment-customerServiceMessage">
          {l`Please allow 7 days from the date above before contacting Customer Services regarding your refund.`}
        </div>
      </div>
    )
  }
}
