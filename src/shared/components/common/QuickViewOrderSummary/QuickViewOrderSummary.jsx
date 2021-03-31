import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from '../Button/Button'
import CheckoutViewBagMobile from '../CheckoutViewBagMobile/CheckoutViewBagMobile'
import WithQubit from '../Qubit/WithQubit'

export default class QuickViewOrderSummary extends Component {
  static propTypes = {
    l: PropTypes.func,
    openMiniBag: PropTypes.func,
    totalCost: PropTypes.string,
  }

  onClick = () => {
    const { openMiniBag } = this.props
    if (openMiniBag) openMiniBag()
  }

  renderCheckoutViewMobile = () => {
    const { openMiniBag, totalCost } = this.props

    return (
      <CheckoutViewBagMobile openMiniBag={openMiniBag} totalCost={totalCost} />
    )
  }

  render() {
    const { isMobile, l } = this.props

    return (
      <WithQubit
        id="checkout-view-bag"
        shouldUseQubit={isMobile}
        renderBag={this.renderCheckoutViewMobile}
      >
        <Button
          className="QuickViewOrderSummary-button"
          clickHandler={this.onClick}
        >
          {l`Order summary`}
        </Button>
      </WithQubit>
    )
  }
}
