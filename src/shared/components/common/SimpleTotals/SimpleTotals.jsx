import React, { Component } from 'react'
import { fixTotal } from '../../../../shared/lib/checkout-utilities/helpers'
import PropTypes from 'prop-types'
import { pluck } from 'ramda'

export default class SimpleTotals extends Component {
  static propTypes = {
    isDDPStandaloneOrder: PropTypes.bool,
    shippingInfo: PropTypes.shape({
      label: PropTypes.string.isRequired,
      cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    priceInfo: PropTypes.shape({
      subTotal: PropTypes.string.isRequired,
    }).isRequired,
    discounts: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
      })
    ),
    className: PropTypes.string,
  }

  static defaultProps = {
    isDDPStandaloneOrder: false,
    discounts: [],
    className: '',
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  render() {
    const {
      isDDPStandaloneOrder,
      shippingInfo: { label, cost },
      priceInfo: { subTotal },
      discounts,
      className,
    } = this.props
    const { l, p } = this.context
    const calculateTotal = fixTotal(subTotal, cost, pluck('value', discounts))

    return (
      <div className={`SimpleTotals ${className}`}>
        {!isDDPStandaloneOrder && (
          <div className="SimpleTotals-section SimpleTotals-subTotal">
            <span className="SimpleTotals-groupLeft">
              {l('Subtotal before Delivery')}
            </span>
            <span className="SimpleTotals-groupRight">{p(subTotal)}</span>
          </div>
        )}

        {this.props.discounts.map(({ label, value }, i) => {
          return (
            <div
              key={i} // eslint-disable-line react/no-array-index-key
              className="SimpleTotals-section SimpleTotals-discount"
            >
              <span className="SimpleTotals-groupLeft">{l(label)}</span>
              <span className="SimpleTotals-groupRight">{`-${p(value)}`}</span>
            </div>
          )
        })}

        {label &&
          !isDDPStandaloneOrder && (
            <div className="SimpleTotals-section SimpleTotals-delivery">
              <span className="SimpleTotals-groupLeft">{l(label)}</span>
              <span className="SimpleTotals-groupRight">
                {cost && parseFloat(cost) ? p(cost) : l`Free`}
              </span>
            </div>
          )}
        <div className="SimpleTotals-section SimpleTotals-total">
          <span className="SimpleTotals-groupLeft">{l`Total to pay`}</span>
          <span className="SimpleTotals-groupRight">{p(calculateTotal)}</span>
        </div>
      </div>
    )
  }
}
