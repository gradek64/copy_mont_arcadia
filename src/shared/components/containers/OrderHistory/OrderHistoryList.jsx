import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import OrderListContainer from '../OrderListContainer/OrderListContainer'
import OrderListTagline from '../OrderListContainer/OrderListTagline'
import OrderListFooter from '../OrderListContainer/OrderListFooter'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import { orderHistoryRequest } from '../../../actions/common/accountActions'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { TYPE } from '../OrderListContainer/types'

@analyticsDecorator('my-orders', { isAsync: true })
@connect(
  (state) => ({
    orders: state.orderHistory.orders,
    region: state.config.region,
    visited: state.routing.visited,
    orderHistoryMessageFeature: state.features.status.FEATURE_ORDER_HISTORY_MSG,
  }),
  { orderHistoryRequest }
)
class OrderHistoryList extends Component {
  static propTypes = {
    orderHistoryRequest: PropTypes.func.isRequired,
    visited: PropTypes.array.isRequired,
    orders: PropTypes.array,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static needs = [orderHistoryRequest]

  componentDidMount() {
    const { orderHistoryRequest, visited } = this.props
    if (visited.length > 1) orderHistoryRequest()
  }

  sortOrders(list) {
    return [...list].sort((a, b) => b.orderId - a.orderId)
  }

  render() {
    const { l } = this.context
    const { orders } = this.props

    const OrderListTaglineComponent = (
      <OrderListTagline
        tagline={l`Track your current orders, view your order history and start a return`}
      />
    )

    const AccountHeaderComponent = (
      <AccountHeader
        link="/my-account"
        label={l`Back to My Account`}
        title={l`My orders`}
      />
    )

    const OrderListFooterComponent = (
      <OrderListFooter
        displayText={l`Displaying your last 20 orders.`}
        historyRequest={l`Need your full order history?`}
        contact={l` Contact customer service on`}
      />
    )

    return (
      <OrderListContainer
        className="OrderHistoryList"
        notFoundMessage={l`There were no orders found`}
        orders={this.sortOrders(orders)}
        type={TYPE.ORDER}
        AccountHeaderComponent={AccountHeaderComponent}
        OrderListTaglineComponent={OrderListTaglineComponent}
        OrderListFooterComponent={OrderListFooterComponent}
      />
    )
  }
}

export default OrderHistoryList
