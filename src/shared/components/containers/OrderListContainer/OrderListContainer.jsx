import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NotFound from './NotFound'
import OrderList from './OrderList'
import { TYPE } from '../../containers/OrderListContainer/types'

export default class OrderListContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    notFoundMessage: PropTypes.string.isRequired,
    orders: PropTypes.array.isRequired,
    type: PropTypes.oneOf(Object.values(TYPE)).isRequired,
    OrderListTaglineComponent: PropTypes.element,
    OrderListFooterComponent: PropTypes.element,
    AccountHeaderComponent: PropTypes.element,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  get hasOrders() {
    const { orders } = this.props
    return Array.isArray(orders) && orders.length > 0
  }

  render() {
    const {
      className,
      notFoundMessage,
      orders,
      type,
      AccountHeaderComponent,
      OrderListTaglineComponent,
      OrderListFooterComponent,
    } = this.props

    return (
      <section className={className}>
        {AccountHeaderComponent}
        {this.hasOrders ? (
          <div className="OrderList-inner">
            <div className="OrderList">
              {OrderListTaglineComponent}
              <OrderList orders={orders} type={type} />
              {OrderListFooterComponent}
            </div>
          </div>
        ) : (
          <NotFound message={notFoundMessage} />
        )}
      </section>
    )
  }
}
