import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { PrivacyGuard } from '../../../lib'

import Image from '../../common/Image/Image'

export default class OrderHistoryDetailsPayment extends Component {
  static propTypes = {
    paymentDetails: PropTypes.array.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const { paymentDetails } = this.props
    return (
      <section className="OrderHistoryDetailsPayment">
        {paymentDetails.map(({ paymentMethod, cardNumberStar, icon }, key) => (
          <div
            className="OrderHistoryDetailsPayment-body"
            key={key} // eslint-disable-line react/no-array-index-key
          >
            <Image
              className="OrderHistoryDetailsPayment-icon"
              src={
                icon
                  ? `/assets/common/images/${icon}`
                  : '/assets/{brandName}/images/credit-card.svg'
              }
            />
            <div className="OrderHistoryDetailsPayment-payment">
              <PrivacyGuard>
                <span className="OrderHistoryDetailsPayment-type">
                  {paymentMethod}
                </span>
              </PrivacyGuard>
              {cardNumberStar && (
                <div className="OrderHistoryDetailsPayment-cardDetails">
                  <span className="OrderHistoryDetailsPayment-label">
                    {l`Card Number`}:
                  </span>
                  <PrivacyGuard>
                    <p className="OrderHistoryDetailsPayment-cardNumber">
                      {cardNumberStar}
                    </p>
                  </PrivacyGuard>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    )
  }
}
