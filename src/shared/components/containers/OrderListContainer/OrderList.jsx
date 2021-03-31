import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderElement from './OrderElement'
import { TYPE } from '../../containers/OrderListContainer/types'

export default class OrderList extends Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    type: PropTypes.oneOf(Object.values(TYPE)).isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { orders, type } = this.props
    const { l } = this.context

    return (
      <ol className="OrderList-list">
        {orders.slice(0, 20).map((order) => {
          const orderStatus = order.isOrderDDPOnly
            ? l`Completed.`
            : order.status
          return (
            <OrderElement
              rmaId={order.rmaId}
              key={`${order.rmaId}-${order.orderId}`}
              orderId={order.orderId}
              orderDate={order.date}
              orderTotal={order.total}
              orderStatus={orderStatus}
              type={type}
            />
          )
        })}
      </ol>
    )
  }
}
