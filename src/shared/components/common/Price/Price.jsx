import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { PrivacyGuard } from '../../../lib'

export default class Price extends Component {
  static propTypes = {
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    className: PropTypes.string,
    privacyProtected: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  render() {
    const { p, l } = this.context
    const { privacyProtected, price = 0, className } = this.props
    const formatted = p(price, true)
    const { symbol, value } = formatted

    return (
      <PrivacyGuard noProtection={!privacyProtected}>
        <span className={`Price ${className} notranslate`}>
          {!price && price !== 0
            ? l`Free`
            : formatted.position === 'before'
              ? `${symbol}${value}`
              : `${value}${symbol}`}
        </span>
      </PrivacyGuard>
    )
  }
}
