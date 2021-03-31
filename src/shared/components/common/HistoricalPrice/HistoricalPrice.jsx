import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Price from '../Price/Price'
import isWasPrice from '../../../lib/is-was-price'
import QubitReact from 'qubit-react/wrapper'
import LabeledPrice from '../LabeledPrice'

export default class HistoricalPrice extends Component {
  static propTypes = {
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wasPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wasWasPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalMarkdownValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    rrp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    shouldShowSaving: PropTypes.bool,
    brandName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    shouldShowSaving: false,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  setAllPrices = () => {
    const { l } = this.context
    const {
      price,
      wasPrice,
      wasWasPrice,
      rrp,
      brandName,
      shouldShowSaving,
      totalMarkdownValue,
    } = this.props
    const retail = rrp && (
      <LabeledPrice key="retail" rrp={rrp} brandName={brandName} l={l} />
    )

    // TODO - Remove wasPrice !== wasWasPrice once change has been made within WCS
    const wasWas = wasWasPrice &&
      wasPrice !== wasWasPrice && (
        <LabeledPrice
          key="wasWas"
          wasWasPrice={wasWasPrice}
          brandName={brandName}
          l={l}
        />
      )

    const was = isWasPrice(wasPrice, price) && (
      <LabeledPrice key="was" wasPrice={wasPrice} brandName={brandName} l={l} />
    )

    const promotion = isWasPrice(wasPrice || wasWasPrice, price) ? (
      <LabeledPrice key="promo" regPrice={price} brandName={brandName} l={l} />
    ) : (
      [
        <span className="HistoricalPrice-label" key="promo-label">
          {l`Price`}:{' '}
        </span>,
        <Price key="promo-price" price={price} />,
      ]
    )

    const saving = shouldShowSaving && (
      <span key="saving" className="HistoricalPrice-saving">
        {l`You save`} <Price price={totalMarkdownValue} />{' '}
      </span>
    )

    if (wasPrice || wasWasPrice || rrp) {
      if (shouldShowSaving && totalMarkdownValue) {
        return [retail, wasWas, was, promotion, saving]
      }
      return [retail, wasWas, was, promotion]
    }

    return [
      retail,
      <span key="label" className="HistoricalPrice-label">
        {l`Price`}:{' '}
      </span>,
      <Price key="price" price={price} />,
    ]
  }

  render() {
    const { price, wasPrice, wasWasPrice } = this.props
    return (
      <span className={`HistoricalPrice ${this.props.className || ''}`}>
        <QubitReact
          id="exp-323-discounted-pricing"
          price={price}
          wasPrice={wasPrice}
          wasWasPrice={wasWasPrice}
          priceComponent={Price}
          isWasPrice={isWasPrice}
        >
          {this.setAllPrices()}
        </QubitReact>
      </span>
    )
  }
}
