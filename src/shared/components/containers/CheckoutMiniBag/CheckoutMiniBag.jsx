import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '../../common/Button/Button'
import CheckoutBagSide from '../../common/CheckoutBagSide/CheckoutBagSide'
import { closeMiniBag } from '../../../actions/common/shoppingBagActions'
import {
  sendAnalyticsClickEvent,
  GTM_ACTION,
  GTM_CATEGORY,
  GTM_LABEL,
} from '../../../analytics'
import { getShoppingBagTotalItems } from '../../../selectors/shoppingBagSelectors'

@connect(
  (state) => ({
    orderSummary: state.checkout.orderSummary,
    totalShoppingBagItems: getShoppingBagTotalItems(state),
  }),
  { closeMiniBag, sendAnalyticsClickEvent }
)
class CheckoutMiniBag extends Component {
  static propTypes = {
    orderSummary: PropTypes.object.isRequired,
    closeMiniBag: PropTypes.func,
    totalShoppingBagItems: PropTypes.number.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  scrollMinibag = (pos) => {
    const content = this.scrollableContent
    if (content) content.scrollTop = pos - content.offsetHeight
  }

  handleClose = () => {
    const { closeMiniBag, sendAnalyticsClickEvent } = this.props
    closeMiniBag()
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.SHOPPING_BAG,
      action: GTM_ACTION.CLICKED,
      label: GTM_LABEL.CLOSE_BUTTON,
    })
  }

  render() {
    const { l } = this.context
    const { orderSummary, closeMiniBag, totalShoppingBagItems } = this.props
    return (
      <div className="CheckoutMiniBag">
        <div>
          <h5 className="CheckoutMiniBag-header">
            {l`My Bag`}
            {` (${totalShoppingBagItems})`}
          </h5>
          <button
            className="CheckoutMiniBag-closeButton"
            onClick={this.handleClose}
            role="button"
          >
            <img
              className="CheckoutMiniBag-closeButtonImg"
              src="/assets/common/images/close-icon.svg"
              alt="close"
            />
          </button>
        </div>
        <div
          className="CheckoutMiniBag-content"
          ref={(div) => {
            this.scrollableContent = div
          }}
        >
          <Button
            className="CheckoutMiniBag-backToCheckout"
            clickHandler={closeMiniBag}
          >
            {l`Back to checkout`}
          </Button>
          <CheckoutBagSide
            orderSummary={orderSummary}
            scrollMinibag={this.scrollMinibag}
            drawer
            showDiscounts
          />
        </div>
      </div>
    )
  }
}

export default CheckoutMiniBag
