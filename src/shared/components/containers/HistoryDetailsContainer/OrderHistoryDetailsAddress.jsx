import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { PrivacyGuard } from '../../../lib'

import Image from '../../common/Image/Image'

export default class OrderHistoryDetailsAddress extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    deliveryMethod: PropTypes.string,
    address: PropTypes.object,
    className: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
  }

  getAddressIcon = (type, deliveryMethod = '') => {
    const homeIcon = '/assets/{brandName}/images/checkout-home.svg'
    const storeIcon = '/assets/{brandName}/images/arcadia-store-icon.svg'

    if (type !== 'billing' && deliveryMethod.includes('Collect'))
      return storeIcon
    return homeIcon
  }

  render() {
    const { l } = this.context
    const { address, type, deliveryMethod, className } = this.props
    const title = type === 'billing' ? l`Payment details` : l`Delivery Details`

    const addressIcon = this.getAddressIcon(type, deliveryMethod)

    if (!address) return null
    return (
      <section className={`OrderHistoryDetailsAddress ${className}`}>
        <h3 className="OrderHistoryDetailsAddress-title">{title}</h3>
        <div className="OrderHistoryDetailsAddress-body">
          <Image
            className="OrderHistoryDetailsAddress-icon"
            src={addressIcon}
          />
          <p className="OrderHistoryDetailsAddress-details">
            {type === 'billing' && (
              <span className="OrderHistoryDetailsAddress-line OrderHistoryDetailsAddress-label">
                {l`Billing address`}:
              </span>
            )}
            {address.name && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsAddress-line">
                  {address.name}
                </span>
              </PrivacyGuard>
            )}
            {address.address1 && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsAddress-line">
                  {address.address1}
                </span>
              </PrivacyGuard>
            )}
            {address.address2 && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsAddress-line">
                  {address.address2}
                </span>
              </PrivacyGuard>
            )}
            {address.address3 && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsAddress-line">
                  {address.address3}
                </span>
              </PrivacyGuard>
            )}
            {address.address4 && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsAddress-line">
                  {address.address4}
                </span>
              </PrivacyGuard>
            )}
            {address.country && (
              <PrivacyGuard>
                <span className="OrderHistoryDetailsAddress-line">
                  {address.country}
                </span>
              </PrivacyGuard>
            )}
          </p>
        </div>
      </section>
    )
  }
}
