import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openMiniBag } from '../../../../actions/common/shoppingBagActions'
import { isMobile } from '../../../../selectors/viewportSelectors'
import { getOrderCost } from '../../../../selectors/checkoutSelectors'

import QuickViewOrderSummary from '../../../common/QuickViewOrderSummary/QuickViewOrderSummary'

const mapDispatchToProps = { openMiniBag }

@connect(
  (state) => ({
    totalCost: getOrderCost(state),
    isMobile: isMobile(state),
  }),
  mapDispatchToProps
)
class CheckoutContentContainer extends Component {
  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  componentDidMount() {
    if (window) window.scrollTo(0, 0)
  }

  render() {
    const { children, isMobile, totalCost, openMiniBag } = this.props
    const { l, p } = this.context

    return (
      <section className="CheckoutContentContainer">
        <QuickViewOrderSummary
          isMobile={isMobile}
          openMiniBag={openMiniBag}
          totalCost={p(totalCost)}
          l={l}
        />
        <div className="CheckoutContentContainer-content">{children}</div>
      </section>
    )
  }
}

export default CheckoutContentContainer
