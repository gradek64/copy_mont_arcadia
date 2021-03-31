import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { PrivacyGuard } from '../../../lib'
import { TYPE } from './types'

export default class OrderElement extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(TYPE)).isRequired,
    orderId: PropTypes.number,
    orderDate: PropTypes.string,
    orderTotal: PropTypes.string,
    orderStatus: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  get url() {
    const { orderId, type } = this.props
    const base = `/my-account/${type}-history/${orderId}`
    switch (type) {
      default:
      case TYPE.ORDER:
        return base
      case TYPE.RETURN: {
        const { rmaId } = this.props
        return `${base}/${rmaId}`
      }
    }
  }

  render() {
    const { l } = this.context
    const { orderId, orderDate, orderTotal, orderStatus } = this.props

    return (
      <li className="OrderElement">
        <Link to={this.url} className="OrderElement-link">
          <dl className="OrderElement-list">
            <dt className="OrderElement-listTitle">{l`Order Number`}</dt>
            <dd className="OrderElement-listItem">
              <PrivacyGuard>
                <strong className="OrderElement-orderNumber">{orderId}</strong>
              </PrivacyGuard>
            </dd>
            <dt className="screen-reader-text">{l`Order date`}</dt>
            <PrivacyGuard>
              <dd className="OrderElement-listItem"> {orderDate}</dd>
            </PrivacyGuard>

            <dt className="screen-reader-text">{l`Order Number`}</dt>
            <PrivacyGuard>
              <dd className="OrderElement-listItem">{orderTotal}</dd>
            </PrivacyGuard>

            <dt className="screen-reader-text">{l`Status`}</dt>
            <dd className="OrderElement-listItem">
              <PrivacyGuard>
                <strong className="OrderElement-orderStatus">
                  {orderStatus}
                </strong>
              </PrivacyGuard>
            </dd>
          </dl>
        </Link>
      </li>
    )
  }
}
