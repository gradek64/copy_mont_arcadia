// Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Links
import { footerCheckoutLinksUrls } from './checkoutLinksConfig'

// Components
import Image from '../../../../../shared/components/common/Image/Image'

// Selectors
import { selectPaymentMethodsValidForFooter } from '../../../../../shared/selectors/paymentMethodSelectors'

@connect((state) => ({
  acceptedPayments: selectPaymentMethodsValidForFooter(
    state
  ),
}))
class FooterCheckout extends Component {
  static propTypes = {
    brandCode: PropTypes.string.isRequired,
    acceptedPayments: PropTypes.array.isRequired,
    region: PropTypes.string.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const { brandCode, acceptedPayments, region } = this.props

    return (
      <footer className="FooterCheckout">
        <div className="FooterCheckout-container">
          <div className="FooterCheckout-paymentIconContainer">
            <span className="FooterCheckout-weaccept">{l`We accept`}</span>
            <div className="FooterCheckout-paymentIconWrapper">
              {acceptedPayments.map(({ value, icon }) => (
                <Image
                  key={value}
                  alt={l`Payment method`}
                  className="FooterCheckout-paymentIcon"
                  src={`/assets/common/images/${icon}`}
                />
              ))}
            </div>
          </div>
          <div className="FooterCheckout-linksContainer">
            {footerCheckoutLinksUrls[brandCode].map(({ link, url }) => (
              <a
                key={link}
                className="FooterCheckout-link"
                href={url[region]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l(link)}
              </a>
            ))}
          </div>
        </div>
      </footer>
    )
  }
}

export default FooterCheckout
