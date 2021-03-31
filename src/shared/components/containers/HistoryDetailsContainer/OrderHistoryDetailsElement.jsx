import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Image from '../../common/Image/Image'
import Price from '../../common/Price/Price'
import { PrivacyGuard } from '../../../lib'

export default class OrderHistoryDetailsElement extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    isDDPProduct: PropTypes.bool,
    productName: PropTypes.string,
    productCode: PropTypes.string,
    size: PropTypes.string,
    price: PropTypes.string,
    total: PropTypes.string,
    quantity: PropTypes.number,
    colour: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const {
      imageUrl,
      productName,
      productCode,
      size,
      price,
      total,
      quantity,
      colour,
      isDDPProduct,
    } = this.props

    return (
      <div className="OrderHistoryDetailsElement">
        <Image
          className="OrderHistoryDetailsElement-image"
          src={imageUrl}
          alt={productName}
        />
        <div className="OrderHistoryDetailsElement-table">
          <div className="OrderHistoryDetailsElement-col OrderHistoryDetailsElement-col1">
            {productName && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--productName">
                  {productName}
                </span>
              </PrivacyGuard>
            )}
            {productCode && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--productCode">
                  {l`Item code`} - {productCode}
                </span>
              </PrivacyGuard>
            )}
            {size &&
              !isDDPProduct && (
                <PrivacyGuard>
                  <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--size">
                    {l`Size`}: {size}
                  </span>
                </PrivacyGuard>
              )}
            {colour &&
              !isDDPProduct && (
                <PrivacyGuard>
                  <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--colour">
                    {l`Colour`}: {colour}
                  </span>
                </PrivacyGuard>
              )}
          </div>
          <div className="OrderHistoryDetailsElement-col OrderHistoryDetailsElement-col2">
            {quantity && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--quantity">
                  {l`Quantity`}: {quantity}
                </span>
              </PrivacyGuard>
            )}
          </div>
          <div className="OrderHistoryDetailsElement-col OrderHistoryDetailsElement-col3">
            {price && (
              <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--price">
                {l`Price`}: <Price price={price} privacyProtected />
              </span>
            )}
          </div>
          <div className="OrderHistoryDetailsElement-col OrderHistoryDetailsElement-col4">
            {total && (
              <span className="OrderHistoryDetailsElement-content OrderHistoryDetailsElement-content--total">
                {l`Total`}: <Price price={total} privacyProtected />
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
}
