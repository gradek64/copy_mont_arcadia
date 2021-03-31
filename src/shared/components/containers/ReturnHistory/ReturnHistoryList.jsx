import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import OrderListContainer from '../OrderListContainer/OrderListContainer'
import OrderListTagline from '../OrderListContainer/OrderListTagline'
import OrderListFooter from '../OrderListContainer/OrderListFooter'
import { returnHistoryRequest } from '../../../actions/common/accountActions'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import { TYPE } from '../OrderListContainer/types'

@connect(
  (state) => ({
    returns: state.returnHistory.returns,
    visited: state.routing.visited,
  }),
  { returnHistoryRequest }
)
class ReturnHistoryList extends Component {
  static propTypes = {
    returnHistoryRequest: PropTypes.func.isRequired,
    visited: PropTypes.array.isRequired,
    returns: PropTypes.array,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { returnHistoryRequest } = this.props
    if (this.shouldRequestReturnList()) returnHistoryRequest()
  }

  shouldRequestReturnList = () => {
    const { visited, returns } = this.props
    return visited.length > 1 && returns.length === 0
  }

  sortOrders(list) {
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  static needs = [returnHistoryRequest]

  render() {
    const { l } = this.context
    const { returns } = this.props

    const OrderListTaglineComponent = (
      <OrderListTagline
        tagline={l`Track your current returns and view your return history`}
      />
    )

    const AccountHeaderComponent = (
      <AccountHeader
        link="/my-account"
        label={l`Back to My Account`}
        title={l`My returns`}
        l={l}
        type={TYPE.RETURN}
      />
    )

    const OrderListFooterComponent = (
      <OrderListFooter
        displayText={l`Displaying your last 20 returns.`}
        historyRequest={l`Need your full return history?`}
        contact={l` Contact customer service on`}
      />
    )

    return (
      <OrderListContainer
        className="ReturnHistoryList"
        notFoundMessage={l`There are no returns found`}
        orders={this.sortOrders(returns)}
        type={TYPE.RETURN}
        AccountHeaderComponent={AccountHeaderComponent}
        OrderListTaglineComponent={OrderListTaglineComponent}
        OrderListFooterComponent={OrderListFooterComponent}
      />
    )
  }
}

export default ReturnHistoryList
