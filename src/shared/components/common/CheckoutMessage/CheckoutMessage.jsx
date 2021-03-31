import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Button from '../../common/Button/Button'
import Message from '../../common/FormComponents/Message/Message'
import OrderProducts from '../../common/OrderProducts/OrderProducts'
import { getShoppingBagProductsWithInventory } from '../../../selectors/inventorySelectors'
import * as ShoppingBagActions from '../../../actions/common/shoppingBagActions'

@connect(
  (state) => ({
    bagProducts: getShoppingBagProductsWithInventory(state),
    orderSummaryError: state.checkout.orderSummaryError,
    loadingShoppingBag: state.shoppingBag.loadingShoppingBag,
  }),
  ShoppingBagActions
)
class CheckoutMessage extends Component {
  static propTypes = {
    orderSummaryError: PropTypes.object,
    bagProducts: PropTypes.array,
    loadingShoppingBag: PropTypes.bool,
    getBag: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { getBag, orderSummaryError } = this.props
    if (orderSummaryError && orderSummaryError.isOutOfStock) getBag()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { getBag, orderSummaryError } = this.props
    // If OrderSummary returns with OOS items. We display OOS items to delete from the latest Bag items without getting a new OrderSummary using get bag param 'false'.
    if (
      nextProps.orderSummaryError &&
      orderSummaryError &&
      !orderSummaryError.isOutOfStock &&
      nextProps.orderSummaryError.isOutOfStock
    )
      getBag()
  }

  renderOosErrorMessage() {
    const { l } = this.context
    return (
      <div className="CheckoutMessage">
        <Message
          message={l`You have items in your bag that are no longer available. Please review your bag before payment.`}
          type={'error'}
        />
        <OrderProducts
          products={this.props.bagProducts}
          oosOnly
          canModify
          allowEmptyBag
          hasDiscountText
        />
      </div>
    )
  }

  renderErrorMessage(message) {
    const { l } = this.context
    return (
      <div className="CheckoutMessage">
        <p className="CheckoutMessage-message">{message}</p>
        <Button clickHandler={() => browserHistory.push('/')}>
          {l`Continue Shopping`}
        </Button>
      </div>
    )
  }

  render() {
    const { orderSummaryError, bagProducts, loadingShoppingBag } = this.props
    const message = orderSummaryError.message

    if (!message || (!bagProducts.length && loadingShoppingBag)) return null

    return orderSummaryError.isOutOfStock
      ? this.renderOosErrorMessage()
      : this.renderErrorMessage(message)
  }
}

export default CheckoutMessage
