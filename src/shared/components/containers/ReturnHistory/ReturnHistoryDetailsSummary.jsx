import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Price from '../../common/Price/Price'

export default class ReturnHistoryDetailsSummary extends Component {
  static propTypes = {
    totalOrderPrice: PropTypes.string.isRequired,
    totalOrdersDiscount: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const {
      totalOrderPrice,
      totalOrdersDiscount,
      subTotal,
      deliveryPrice,
    } = this.props

    return (
      <div className="ReturnHistoryDetailsSummary">
        <div className="ReturnHistoryDetailsSummary-container">
          <div>
            <p className="ReturnHistoryDetailsSummary-title">
              <strong>{l`Subtotal`}</strong>:
            </p>
            <p className="ReturnHistoryDetailsSummary-value">
              <Price price={subTotal} privacyProtected />
            </p>
          </div>
          {totalOrdersDiscount && (
            <div>
              <p className="ReturnHistoryDetailsSummary-title ReturnHistoryDetailsSummary-discount">
                <strong>{l`Discount`}</strong>:
              </p>
              <p className="ReturnHistoryDetailsSummary-value">
                <Price price={totalOrdersDiscount} privacyProtected />
              </p>
            </div>
          )}
          <div>
            <p className="ReturnHistoryDetailsSummary-title">
              <strong>{l`Delivery`}</strong>:
            </p>
            <p className="ReturnHistoryDetailsSummary-value">
              <Price price={deliveryPrice} privacyProtected />
            </p>
          </div>
          <div>
            <p className="ReturnHistoryDetailsSummary-title">
              <strong>{l`Total credit returned`}</strong>:
            </p>
            <p className="ReturnHistoryDetailsSummary-value">
              <Price price={totalOrderPrice} privacyProtected />
            </p>
          </div>
        </div>
      </div>
    )
  }
}
