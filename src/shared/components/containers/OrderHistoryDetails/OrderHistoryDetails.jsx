import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import HistoryDetailsContainer from '../HistoryDetailsContainer/HistoryDetailsContainer'
import {
  setOrderHistoryDetails,
  orderHistoryDetailsRequest,
} from '../../../actions/common/accountActions'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { getDecoratedOrderDetails } from '../../../selectors/common/accountSelectors'
import {
  isFeatureOrderReturnsEnabled,
  isFeatureTrackMyOrdersEnabled,
} from '../../../selectors/featureSelectors'
import { getOrderReturnUrl } from '../../../selectors/common/configSelectors'

export const mapStateToProps = (state) => ({
  orderDetails: getDecoratedOrderDetails(state),
  visited: state.routing.visited,
  isFeatureOrderReturnsEnabled: isFeatureOrderReturnsEnabled(state),
  isFeatureTrackMyOrdersEnabled: isFeatureTrackMyOrdersEnabled(state),
  orderReturnUrl: getOrderReturnUrl(state),
})

@analyticsDecorator('order-details', { isAsync: true })
@connect(
  mapStateToProps,
  {
    setOrderHistoryDetails,
    orderHistoryDetailsRequest,
  }
)
class OrderHistoryDetails extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    orderDetails: PropTypes.object.isRequired,
    visited: PropTypes.array.isRequired,
    setOrderHistoryDetails: PropTypes.func,
    orderHistoryDetailsRequest: PropTypes.func,
    orderReturnUrl: PropTypes.string,
    isFeatureOrderReturnsEnabled: PropTypes.bool,
    isFeatureTrackMyOrdersEnabled: PropTypes.bool,
  }
  static contextTypes = {
    l: PropTypes.func,
  }

  UNSAFE_componentWillMount() {
    if (!process.browser) return
    const {
      params: { param },
      orderDetails: { orderId },
      setOrderHistoryDetails,
      orderHistoryDetailsRequest,
      visited,
    } = this.props
    const currentOrderId = parseInt(param, 10)

    if (orderId && currentOrderId !== orderId) setOrderHistoryDetails({})
    // first fetch is performed by server-side render
    if (visited.length > 1) orderHistoryDetailsRequest(currentOrderId)
  }

  static needs = [(location) => orderHistoryDetailsRequest(location.param)]

  render() {
    const { l } = this.context
    const {
      orderReturnUrl,
      isFeatureOrderReturnsEnabled,
      isFeatureTrackMyOrdersEnabled,
      orderDetails,
      params: { param },
    } = this.props
    return (
      <section className="OrderHistoryDetails">
        <AccountHeader
          link="/my-account/order-history"
          label={l`Back to My Orders`}
          title={l`Order details`}
        />
        <div className="MyAccount-wrapper">
          <HistoryDetailsContainer
            orderDetails={orderDetails}
            paramId={param}
            orderReturnUrl={orderReturnUrl}
            isFeatureOrderReturnsEnabled={isFeatureOrderReturnsEnabled}
            isFeatureTrackMyOrdersEnabled={isFeatureTrackMyOrdersEnabled}
          />
        </div>
      </section>
    )
  }
}

export default OrderHistoryDetails
